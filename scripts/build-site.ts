import {
  buildMetadataToEnv,
  readBuildMetadataFromEnv,
  resolveBuildMetadata,
} from "./lib/build-metadata";
import { runCommand } from "./lib/command";

if (process.env.SKIP_CONTENT_COMPILE !== "true") {
  runCommand("bun", ["run", "scripts/compile-content.ts"]);
}

const buildMetadata = readBuildMetadataFromEnv(process.env) ?? resolveBuildMetadata();
const buildEnv = buildMetadata ? buildMetadataToEnv(buildMetadata) : {};

runCommand("bun", ["x", "vinxi", "build"], {
  env: buildEnv,
});
runCommand("bun", ["run", "scripts/finalize-static-output.ts"]);
