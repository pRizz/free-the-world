import path from "node:path";
import { readFile } from "node:fs/promises";
import { ensureAwsCliAvailable, loadAwsCallerIdentity, loadStackState } from "../lib/aws-deploy";
import { runCommand } from "../lib/command";
import {
  assertDeployArtifactIntegrity,
  diffDeployManifests,
  getCacheControlForArtifactPath,
  getInvalidationPaths,
  getS3ContentEncoding,
  getS3ContentType,
  readDeployManifest,
  type DeployManifest,
} from "../lib/deploy-artifact";
import { createDeployRun, writeDeploySummary, type DeployBreadcrumb, type DeployRunContext, type DeployVerificationResult } from "../lib/deploy-log";

const args = parseArgs(process.argv.slice(2));
const mode: "apply" | "check" = args.apply === "true" ? "apply" : "check";
const artifactDir = path.resolve(args.artifact ?? ".artifacts/deploy/aws");
const manifestPath = path.join(artifactDir, "deploy-manifest.json");
const localManifest = await readDeployManifest(manifestPath);
const commandName = "deploy:aws:publish";
const run = await createDeployRun({
  command: commandName,
  mode,
  target: "aws",
});

if (localManifest.target !== "aws") {
  throw new Error(`Expected an AWS deploy manifest, received target ${localManifest.target}.`);
}

await run.addBreadcrumb({
  detail: `Loaded AWS artifact manifest ${localManifest.artifactHash} from ${artifactDir}.`,
  status: "info",
  step: "initialize",
});
await recordTimedAction(run, {
  detail: `Verified deploy artifact integrity for ${artifactDir}.`,
  status: "passed",
  step: "artifact integrity",
}, () => assertDeployArtifactIntegrity(artifactDir, localManifest));
await recordTimedAction(run, {
  detail: "Validated AWS CLI access.",
  status: "passed",
  step: "aws cli",
}, () => ensureAwsCliAvailable());

const identity = await recordTimedAction(run, {
  data: (currentIdentity: ReturnType<typeof loadAwsCallerIdentity>) => ({
    accountId: currentIdentity.Account,
    arn: currentIdentity.Arn,
    userId: currentIdentity.UserId,
  }),
  detail: "Loaded the active AWS caller identity.",
  status: "passed",
  step: "caller identity",
}, () => loadAwsCallerIdentity());
const stackState = await recordTimedAction(run, {
  data: (currentStackState: ReturnType<typeof loadStackState>) => ({
    exists: currentStackState.exists,
    stackId: currentStackState.stackId,
    stackStatus: currentStackState.stackStatus,
  }),
  detail: "Loaded the current CloudFormation stack outputs.",
  status: "passed",
  step: "stack state",
}, () => loadStackState());

if (!stackState.exists) {
  throw new Error("AWS stack does not exist. Run deploy:aws:bootstrap before publishing.");
}

const bucketName = stackState.outputs.SiteBucketName;
const distributionId = stackState.outputs.DistributionId;

if (!bucketName || !distributionId) {
  throw new Error("AWS stack outputs did not include SiteBucketName and DistributionId.");
}

const maybeRemoteManifest = await recordTimedAction(run, {
  data: (remoteManifest: Awaited<ReturnType<typeof loadRemoteManifest>>) => ({
    artifactHash: remoteManifest?.artifactHash ?? null,
    publicOrigin: remoteManifest?.publicOrigin ?? null,
  }),
  detail: `Loaded the remote deploy manifest from s3://${bucketName}/deploy-manifest.json.`,
  status: "passed",
  step: "remote manifest",
}, () => loadRemoteManifest(bucketName));
const diff = diffDeployManifests(localManifest, maybeRemoteManifest);
const uploads = [...diff.uploads.map(file => file.path)];

if (diff.changed) {
  uploads.push("deploy-manifest.json");
}

const invalidationPaths = getInvalidationPaths(uploads.concat(diff.deletes));
await run.addBreadcrumb({
  data: {
    bucketName,
    deletes: diff.deletes,
    distributionId,
    invalidationPaths,
    uploads,
  },
  detail: "Computed the S3 and CloudFront publish plan.",
  status: "planned",
  step: "plan",
});
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
  await run.addBreadcrumb({
    detail: "Remote deploy manifest already matches the local artifact hash.",
    status: "skipped",
    step: "apply",
  });
} else if (mode === "check") {
  skippedReasons.push("Check mode only. No S3 uploads, deletes, or CloudFront invalidations were executed.");
  await run.addBreadcrumb({
    detail: "Check mode prevented S3 uploads, deletes, and CloudFront invalidations.",
    status: "skipped",
    step: "apply",
  });
} else {
  for (const relativePath of uploads) {
    const uploadStartedAtMs = Date.now();
    const uploadStartedAt = new Date(uploadStartedAtMs).toISOString();
    await uploadFile(bucketName, artifactDir, relativePath);
    appliedChanges.push(`Uploaded ${relativePath}`);
    await run.addBreadcrumb({
      durationMs: Date.now() - uploadStartedAtMs,
      detail: `Uploaded ${relativePath} to s3://${bucketName}/${relativePath}.`,
      startedAt: uploadStartedAt,
      status: "passed",
      step: "upload",
    });
  }

  for (const relativePath of diff.deletes) {
    const deleteStartedAtMs = Date.now();
    const deleteStartedAt = new Date(deleteStartedAtMs).toISOString();
    runCommand("aws", ["s3", "rm", `s3://${bucketName}/${relativePath}`, "--only-show-errors"]);
    appliedChanges.push(`Deleted ${relativePath}`);
    await run.addBreadcrumb({
      durationMs: Date.now() - deleteStartedAtMs,
      detail: `Deleted s3://${bucketName}/${relativePath}.`,
      startedAt: deleteStartedAt,
      status: "passed",
      step: "delete",
    });
  }

  if (invalidationPaths.length > 0) {
    const invalidationStartedAtMs = Date.now();
    const invalidationStartedAt = new Date(invalidationStartedAtMs).toISOString();
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
    await run.addBreadcrumb({
      durationMs: Date.now() - invalidationStartedAtMs,
      detail: `Created a CloudFront invalidation for ${invalidationPaths.length} path(s).`,
      startedAt: invalidationStartedAt,
      status: "passed",
      step: "invalidation",
    });
  } else {
    skippedReasons.push("Only immutable assets changed, so no CloudFront invalidation was required.");
    await run.addBreadcrumb({
      detail: "Skipped CloudFront invalidation because only immutable assets changed.",
      status: "skipped",
      step: "invalidation",
    });
  }

  const maybeUpdatedRemoteManifest = await recordTimedAction(run, {
    data: (remoteManifest: Awaited<ReturnType<typeof loadRemoteManifest>>) => ({
      artifactHash: remoteManifest?.artifactHash ?? null,
      publicOrigin: remoteManifest?.publicOrigin ?? null,
    }),
    detail: `Reloaded the remote deploy manifest from s3://${bucketName}/deploy-manifest.json after publish.`,
    status: "passed",
    step: "remote manifest verify",
  }, () => loadRemoteManifest(bucketName));
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
  command: commandName,
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

const { runDirectory } = await writeDeploySummary(summary, { runDirectory: run.runDirectory });
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

async function recordTimedAction<T>(
  run: DeployRunContext,
  breadcrumb: Omit<DeployBreadcrumb, "at" | "durationMs" | "startedAt"> & {
    data?: unknown | ((result: T) => unknown);
    failureDetail?: string | ((error: Error) => string);
  },
  action: () => Promise<T> | T
) {
  const startedAtMs = Date.now();
  const startedAt = new Date(startedAtMs).toISOString();

  try {
    const result = await action();
    await run.addBreadcrumb({
      ...breadcrumb,
      data: typeof breadcrumb.data === "function" ? breadcrumb.data(result) : breadcrumb.data,
      durationMs: Date.now() - startedAtMs,
      startedAt,
    });
    return result;
  } catch (error) {
    const errorDetail = error instanceof Error ? error.message : String(error);
    await run.addBreadcrumb({
      detail:
        typeof breadcrumb.failureDetail === "function"
          ? breadcrumb.failureDetail(error instanceof Error ? error : new Error(errorDetail))
          : breadcrumb.failureDetail ?? `${breadcrumb.detail} Failed: ${errorDetail}`,
      durationMs: Date.now() - startedAtMs,
      startedAt,
      status: "failed",
      step: breadcrumb.step,
    });
    throw error;
  }
}
