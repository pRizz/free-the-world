import path from "node:path";
import type { CompanyManifest } from "../src/lib/domain/content-types";
import { promoteManifest, promoteQueuedManifest } from "./lib/company-intake";
import { readJsonFile, rootDir } from "./lib/content";
import { parseArgs } from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

const usage =
  "Usage: bun run company:init (--manifest=/absolute/or/relative/path/to/company-manifest.json | --queued=<slug>)";

if (args.help === "true") {
  console.log(usage);
  process.exit(0);
}

if (Boolean(args.manifest) === Boolean(args.queued)) {
  console.log(usage);
  process.exit(1);
}

if (args.manifest) {
  const manifestPath = path.resolve(rootDir, args.manifest);
  const manifest = await readJsonFile<CompanyManifest>(manifestPath);
  const result = await promoteManifest(manifest);

  console.log(`Wrote company manifest to ${path.relative(rootDir, result.targetFile)}`);
  process.exit(0);
}

const result = await promoteQueuedManifest(args.queued);

console.log(
  `Promoted queued manifest ${result.manifest.slug} to ${path.relative(rootDir, result.targetFile)} and removed ${path.relative(rootDir, result.queueFile)}`,
);
