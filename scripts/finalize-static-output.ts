import path from "node:path";
import { finalizeArtifact } from "./lib/deploy-artifact";

const outputDir = path.resolve(".output/public");

await finalizeArtifact(outputDir, process.env.SITE_DEPLOY_TARGET);
