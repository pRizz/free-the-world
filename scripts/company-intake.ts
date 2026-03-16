import path from "node:path";
import type { RalphProviderPreference, RalphSyncMode } from "../src/lib/domain/content-types";
import { parseRawCompanyItems, runCompanyIntake } from "./lib/company-intake-funnel";
import { resolvePipelineLoopTaskIds } from "./lib/company-pipeline";
import { rootDir } from "./lib/content";
import { parseArgs } from "./lib/ralph";
import { parseLoopConcurrencyLimit } from "./lib/ralph-loop-runner";

const args = parseArgs(process.argv.slice(2));

const usage =
  "Usage: bun run company:intake [--raw=<text> | --items-file=<path> | --request=<id>] [--mode=prepare|dry-run|publish] [--batch-id=<id>] [--group-label=<label>] [--request-notes=<text>] [--loop-tasks=<task[,task]>|all] [--concurrency=<n>] [--provider=auto|codex|claude|both] [--no-commit=true|false]";

if (args.help === "true") {
  console.log(usage);
  process.exit(0);
}

const mode = (args.mode ?? "prepare") as "prepare" | RalphSyncMode;
const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const noCommit = args["no-commit"] !== "false" && args["no-commit"] !== "0";
const concurrencyLimit = parseLoopConcurrencyLimit(args.concurrency);
const requestId = normalizeOptional(args.request);

const rawInput =
  normalizeOptional(args.raw) ?? (await maybeReadItemsFile(args["items-file"] ?? args.items));

if (!requestId && !rawInput) {
  console.log(usage);
  process.exit(1);
}

if (requestId && rawInput) {
  throw new Error("Use either a new raw request or --request=<id>, not both in the same command.");
}

const result = await runCompanyIntake({
  mode,
  rawInput,
  requestId,
  batchId: normalizeOptional(args["batch-id"]),
  groupLabel: normalizeOptional(args["group-label"]),
  requestNotes: normalizeOptional(args["request-notes"]),
  providerPreference,
  concurrencyLimit,
  noCommit,
  loopTaskIds: resolvePipelineLoopTaskIds(args["loop-tasks"] ?? args["loop-task"]),
  onProgress: (message) => console.log(`[company:intake] ${message}`),
});

if (mode === "prepare") {
  console.log(
    [
      `Prepared request ${result.request.requestId}.`,
      `Queued ${result.request.queuedSlugs.length} manifest(s) and skipped ${result.request.skippedItems.length} item(s).`,
      `Summary: ${result.summaryMarkdown}`,
      `Recommended next step: bun run company:intake --request=${result.request.requestId} --mode=dry-run`,
    ].join("\n"),
  );
} else {
  console.log(
    [
      `Completed request ${result.request.requestId} in ${mode} mode.`,
      `Prepared ${result.request.preparedCandidates.length} candidate(s), promoted ${result.pipelineResult?.promotedSlugs.length ?? 0}, looped ${result.pipelineResult?.loopRunDirs.length ?? 0}, synced ${result.pipelineResult?.syncRuns.length ?? 0}.`,
      `Summary: ${result.summaryMarkdown}`,
    ].join("\n"),
  );
}

function normalizeOptional(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

async function maybeReadItemsFile(maybeFile: string | undefined) {
  const filePath = normalizeOptional(maybeFile);
  if (!filePath) {
    return undefined;
  }

  const resolvedFilePath = path.resolve(rootDir, filePath);
  const rawText = await Bun.file(resolvedFilePath).text();
  const trimmedText = rawText.trim();
  if (!trimmedText) {
    throw new Error(`Items file ${resolvedFilePath} is empty.`);
  }

  try {
    const parsed = JSON.parse(trimmedText) as unknown;
    if (Array.isArray(parsed) && parsed.every((entry) => typeof entry === "string")) {
      return parsed.join("\n");
    }
  } catch {}

  if (trimmedText.startsWith("[") && parseRawCompanyItems(trimmedText).length === 0) {
    throw new Error(
      `Items file ${resolvedFilePath} looks like JSON but is not a valid string list.`,
    );
  }

  return trimmedText;
}
