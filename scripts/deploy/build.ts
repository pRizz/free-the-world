import path from "node:path";
import { cp, mkdir, rm } from "node:fs/promises";
import { getDeployTargetConfig, parseDeployTarget, type DeployTarget } from "../../src/lib/deployment-config";
import { assertArtifactMatchesTarget, readDeployManifest } from "../lib/deploy-artifact";
import { runCommand } from "../lib/command";

const args = parseArgs(process.argv.slice(2));
const requestedTarget = args.target;
const targets = requestedTarget ? [parseDeployTarget(requestedTarget)] : (["aws", "github-pages"] as const);
const outputDir = path.resolve(".output/public");
const deployArtifactsDir = path.resolve(".artifacts/deploy");

runCommand("bun", ["run", "scripts/compile-content.ts"]);

for (const target of targets) {
  const targetConfig = getDeployTargetConfig(target);
  const destinationDir = path.join(deployArtifactsDir, target);

  runCommand("bun", ["run", "scripts/build-site.ts"], {
    env: {
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
  console.log(`Built ${target} artifact at ${destinationDir} (${manifest.artifactHash}).`);
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
