import path from "node:path";
import { rootDir } from "./lib/content";
import { queueManifestFromFile } from "./lib/company-intake";
import { parseArgs } from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

const usage =
  "Usage: bun run company:queue --manifest=/absolute/or/relative/path/to/company-manifest.json [--batch-id=<id>] [--group-label=<label>] [--request-notes=<text>]";

if (args.help === "true") {
  console.log(usage);
  process.exit(0);
}

if (!args.manifest) {
  console.log(usage);
  process.exit(1);
}

const manifestPath = path.resolve(rootDir, args.manifest);
const queueEntry = await queueManifestFromFile(manifestPath, {
  batchId: normalizeOptional(args["batch-id"]),
  groupLabel: normalizeOptional(args["group-label"]),
  requestNotes: normalizeOptional(args["request-notes"]),
});

console.log(
  `Queued manifest ${queueEntry.manifest.slug} at content/manifests/queue/${queueEntry.manifest.slug}.json`
);

function normalizeOptional(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}
