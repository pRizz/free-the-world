import path from "node:path";
import { readFile } from "node:fs/promises";
import { ensureAwsCliAvailable, loadAwsCallerIdentity, loadStackState } from "../lib/aws-deploy";
import { runCommand } from "../lib/command";
import {
  diffDeployManifests,
  getCacheControlForArtifactPath,
  getInvalidationPaths,
  getS3ContentEncoding,
  getS3ContentType,
  readDeployManifest,
  type DeployManifest,
} from "../lib/deploy-artifact";
import { writeDeploySummary, type DeployVerificationResult } from "../lib/deploy-log";

const args = parseArgs(process.argv.slice(2));
const mode: "apply" | "check" = args.apply === "true" ? "apply" : "check";
const artifactDir = path.resolve(args.artifact ?? ".artifacts/deploy/aws");
const manifestPath = path.join(artifactDir, "deploy-manifest.json");
const localManifest = await readDeployManifest(manifestPath);

if (localManifest.target !== "aws") {
  throw new Error(`Expected an AWS deploy manifest, received target ${localManifest.target}.`);
}

ensureAwsCliAvailable();

const identity = loadAwsCallerIdentity();
const stackState = loadStackState();

if (!stackState.exists) {
  throw new Error("AWS stack does not exist. Run deploy:aws:bootstrap before publishing.");
}

const bucketName = stackState.outputs.SiteBucketName;
const distributionId = stackState.outputs.DistributionId;

if (!bucketName || !distributionId) {
  throw new Error("AWS stack outputs did not include SiteBucketName and DistributionId.");
}

const maybeRemoteManifest = await loadRemoteManifest(bucketName);
const diff = diffDeployManifests(localManifest, maybeRemoteManifest);
const uploads = [...diff.uploads.map(file => file.path)];

if (diff.changed) {
  uploads.push("deploy-manifest.json");
}

const invalidationPaths = getInvalidationPaths(uploads.concat(diff.deletes));
const skippedReasons: string[] = [];
const appliedChanges: string[] = [];
const verificationResults: DeployVerificationResult[] = [
  {
    detail: `Using bucket ${bucketName} and distribution ${distributionId}.`,
    name: "stack outputs",
    status: "passed",
  },
];

if (!diff.changed) {
  skippedReasons.push("The local deploy manifest matches the remote AWS deploy manifest.");
} else if (mode === "check") {
  skippedReasons.push("Check mode only. No S3 uploads, deletes, or CloudFront invalidations were executed.");
} else {
  for (const relativePath of uploads) {
    await uploadFile(bucketName, artifactDir, relativePath);
    appliedChanges.push(`Uploaded ${relativePath}`);
  }

  for (const relativePath of diff.deletes) {
    runCommand("aws", ["s3", "rm", `s3://${bucketName}/${relativePath}`, "--only-show-errors"]);
    appliedChanges.push(`Deleted ${relativePath}`);
  }

  if (invalidationPaths.length > 0) {
    runCommand("aws", [
      "cloudfront",
      "create-invalidation",
      "--distribution-id",
      distributionId,
      "--paths",
      ...invalidationPaths,
      "--output",
      "json",
    ]);
    appliedChanges.push(`Created CloudFront invalidation for ${invalidationPaths.length} path(s).`);
  } else {
    skippedReasons.push("Only immutable assets changed, so no CloudFront invalidation was required.");
  }

  const maybeUpdatedRemoteManifest = await loadRemoteManifest(bucketName);
  if (!maybeUpdatedRemoteManifest || maybeUpdatedRemoteManifest.artifactHash !== localManifest.artifactHash) {
    verificationResults.push({
      detail: "The uploaded deploy manifest does not match the local artifact hash.",
      name: "remote manifest",
      status: "failed",
    });
    throw new Error("Remote deploy manifest did not match the local artifact hash after upload.");
  }

  verificationResults.push({
    detail: `Remote deploy manifest hash ${maybeUpdatedRemoteManifest.artifactHash} matches the local artifact.`,
    name: "remote manifest",
    status: "passed",
  });
}

const summary = {
  appliedChanges,
  artifactDir,
  artifactHash: localManifest.artifactHash,
  command: "deploy:aws:publish",
  discoveredRemoteState: {
    identity,
    maybeRemoteManifest,
    stackState,
  },
  mode,
  plannedChanges: {
    deletes: diff.deletes,
    invalidationPaths,
    uploads,
  },
  resultingUrls: [localManifest.publicOrigin],
  skippedReasons,
  target: "aws",
  verificationResults,
};

const { runDirectory } = await writeDeploySummary(summary);
console.log(`AWS publish ${mode} complete. Summary: ${runDirectory}`);

async function loadRemoteManifest(bucketName: string) {
  const result = runCommand("aws", ["s3", "cp", `s3://${bucketName}/deploy-manifest.json`, "-", "--only-show-errors"], {
    allowFailure: true,
  });

  if (result.status !== 0) {
    return null;
  }

  return JSON.parse(result.stdout) as DeployManifest;
}

async function uploadFile(bucketName: string, rootDir: string, relativePath: string) {
  const filePath = path.join(rootDir, relativePath);
  await readFile(filePath);

  const args = [
    "s3",
    "cp",
    filePath,
    `s3://${bucketName}/${relativePath}`,
    "--cache-control",
    getCacheControlForArtifactPath(relativePath),
    "--content-type",
    getS3ContentType(relativePath),
    "--only-show-errors",
  ];

  const maybeContentEncoding = getS3ContentEncoding(relativePath);
  if (maybeContentEncoding) {
    args.push("--content-encoding", maybeContentEncoding);
  }

  runCommand("aws", args);
}

function parseArgs(rawArgs: string[]) {
  return rawArgs.reduce<Record<string, string>>((accumulator, currentArg) => {
    if (!currentArg.startsWith("--")) {
      return accumulator;
    }

    const [key, value = "true"] = currentArg.slice(2).split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
}
