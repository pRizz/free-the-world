import path from "node:path";
import { cp, mkdir, rm } from "node:fs/promises";
import { getDeployTargetConfig, parseDeployTarget, type DeployTarget } from "../../src/lib/deployment-config";
import { buildMetadataToEnv, resolveBuildMetadata } from "../lib/build-metadata";
import { assertArtifactMatchesTarget, readDeployManifest } from "../lib/deploy-artifact";
import { runCommand } from "../lib/command";
import { createDeployRun, writeDeploySummary } from "../lib/deploy-log";

const args = parseArgs(process.argv.slice(2));
const requestedTarget = args.target;
const targets = requestedTarget ? [parseDeployTarget(requestedTarget)] : (["aws", "github-pages"] as const);
const outputDir = path.resolve(".output/public");
const deployArtifactsDir = path.resolve(".artifacts/deploy");
const commandName = "deploy:build";
const run = await createDeployRun({
  command: commandName,
  mode: "check",
  target: requestedTarget ?? "all",
});
const builtArtifacts: Array<{ artifactHash: string; destinationDir: string; target: DeployTarget }> = [];
const buildMetadata = resolveBuildMetadata();
const buildEnv = buildMetadata ? buildMetadataToEnv(buildMetadata) : {};

await run.addBreadcrumb({
  data: { targets },
  detail: "Preparing to build target-specific deployment artifacts.",
  status: "info",
  step: "initialize",
});

runCommand("bun", ["run", "scripts/compile-content.ts"]);
await run.addBreadcrumb({
  detail: "Compiled content before building deploy artifacts.",
  status: "passed",
  step: "content compile",
});

for (const target of targets) {
  const targetConfig = getDeployTargetConfig(target);
  const destinationDir = path.join(deployArtifactsDir, target);

  runCommand("bun", ["run", "scripts/build-site.ts"], {
    env: {
      ...buildEnv,
      SITE_BASE_PATH: targetConfig.basePath,
      SITE_DEPLOY_TARGET: target,
      SKIP_CONTENT_COMPILE: "true",
    },
  });

  await rm(destinationDir, { force: true, recursive: true });
  await mkdir(path.dirname(destinationDir), { recursive: true });
  await cp(outputDir, destinationDir, { recursive: true });

  await assertArtifactMatchesTarget(destinationDir, target);

  const manifest = await readDeployManifest(path.join(destinationDir, "deploy-manifest.json"));
  builtArtifacts.push({
    artifactHash: manifest.artifactHash,
    destinationDir,
    target,
  });
  await run.addBreadcrumb({
    data: {
      artifactHash: manifest.artifactHash,
      destinationDir,
      publicOrigin: manifest.publicOrigin,
      target,
    },
    detail: `Built ${target} artifact ${manifest.artifactHash}.`,
    status: "passed",
    step: "artifact build",
  });
  console.log(`Built ${target} artifact at ${destinationDir} (${manifest.artifactHash}).`);
}

const { runDirectory } = await writeDeploySummary(
  {
    appliedChanges: builtArtifacts.map(artifact => `Built ${artifact.target} artifact ${artifact.artifactHash} at ${artifact.destinationDir}.`),
    artifactDir: requestedTarget ? builtArtifacts[0]?.destinationDir : undefined,
    artifactHash: requestedTarget ? builtArtifacts[0]?.artifactHash : undefined,
    command: commandName,
    discoveredRemoteState: {
      outputDir,
    },
    mode: "check",
    plannedChanges: {
      targets,
    },
    resultingUrls: builtArtifacts.map(artifact => getDeployTargetConfig(artifact.target).publicOrigin),
    skippedReasons: [],
    target: requestedTarget ?? "all",
    verificationResults: builtArtifacts.map(artifact => ({
      detail: `${artifact.target} artifact ${artifact.artifactHash} passed the target assertions.`,
      name: `${artifact.target} artifact`,
      status: "passed" as const,
    })),
  },
  { runDirectory: run.runDirectory }
);

console.log(`Deploy build complete. Summary: ${runDirectory}`);

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
