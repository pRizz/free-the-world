import type { RalphProviderPreference, RalphSyncMode } from "../src/lib/domain/content-types";
import { resolvePipelineLoopTaskIds, runCompanyPipeline } from "./lib/company-pipeline";
import { parseArgs, parseList } from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

const usage =
  "Usage: bun run company:pipeline [--manifest=<path[,path]>] [--queued=<slug[,slug]>] [--company=<slug[,slug]>] [--batch-id=<id>] [--group-label=<label>] [--request-notes=<text>] [--loop-tasks=<task[,task]>|all] [--skip-loop=true] [--skip-sync=true] [--execute-loop=false] [--provider=auto|codex|claude|both] [--mode=dry-run|publish] [--no-commit=true|false]";

if (args.help === "true") {
  console.log(usage);
  process.exit(0);
}

const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const mode = (args.mode ?? "dry-run") as RalphSyncMode;
const noCommit = args["no-commit"] !== "false" && args["no-commit"] !== "0";
const skipLoop = args["skip-loop"] === "true" || args["skip-loop"] === "1";
const skipSync = args["skip-sync"] === "true" || args["skip-sync"] === "1";
const executeLoop = args["execute-loop"] !== "false" && args["execute-loop"] !== "0";

const result = await runCompanyPipeline({
  manifestPaths: parseList(args.manifest ?? args.manifests),
  queuedSlugs: parseList(args.queued),
  companySlugs: parseList(args.company ?? args.companies),
  batchId: normalizeOptional(args["batch-id"]),
  groupLabel: normalizeOptional(args["group-label"]),
  requestNotes: normalizeOptional(args["request-notes"]),
  providerPreference,
  mode,
  noCommit,
  skipLoop,
  skipSync,
  executeLoop,
  loopTaskIds: resolvePipelineLoopTaskIds(args["loop-tasks"] ?? args["loop-task"]),
  onProgress: (message) => console.log(`[company:pipeline] ${message}`),
});

console.log(
  [
    `Queued ${result.queuedEntries.length} manifest(s)`,
    `promoted ${result.promotedSlugs.length}`,
    `looped ${result.loopRunDirs.length}`,
    `synced ${result.syncRuns.length}.`,
  ].join(", "),
);

function normalizeOptional(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}
