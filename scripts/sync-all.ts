import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CompanyBundle,
  RalphProviderPreference,
  RalphSyncMode,
  SyncBatchTargetId,
} from "../src/lib/domain/content-types";
import { syncBatchTargetIds } from "../src/lib/domain/content-types";
import { loadRawContent, readJsonFile, rootDir, writeJsonFile } from "./lib/content";
import { collectSyncTargets, createRunId, parseArgs, parseList, syncCompany } from "./lib/ralph";

interface BatchSummaryEntry {
  companySlug: string;
  status: "success" | "failed";
  runDir?: string;
  summaryFile?: string;
  productCount?: number;
  conceptCount?: number;
  completeProductCount?: number;
  productsNeedingSecondConceptCount?: number;
  exceptionCount?: number;
  error?: string;
}

const args = parseArgs(process.argv.slice(2));

if (args.help === "true") {
  console.log(
    "Usage: bun run sync:all [--provider=auto|codex|claude|both] [--mode=dry-run|publish] [--target=published|all|stale] [--company=<slug[,slug]>] [--no-commit=true]",
  );
  process.exit(0);
}

const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const mode = (args.mode ?? "dry-run") as RalphSyncMode;
const target = resolveSyncTarget(args.target, args["stale-only"]);
const noCommit = args["no-commit"] === "true" || args["no-commit"] === "1";
const requestedCompanies = new Set(parseList(args.company));

const raw = await loadRawContent();
const unfilteredTargets = collectSyncTargets(raw, target);
const targets =
  requestedCompanies.size === 0
    ? unfilteredTargets
    : unfilteredTargets.filter((companySlug) => requestedCompanies.has(companySlug));
const runId = createRunId();
const batchRunDir = path.join(rootDir, "research", "runs", "_batches", "sync-all", runId);
const summaryEntries: BatchSummaryEntry[] = [];

await mkdir(batchRunDir, { recursive: true });

for (const companySlug of targets) {
  try {
    const result = await syncCompany({
      companySlug,
      providerPreference,
      mode,
      noCommit,
    });
    const bundle = await readJsonFile<CompanyBundle>(
      path.join(result.runDir, "candidate.bundle.json"),
    );
    summaryEntries.push({
      companySlug,
      status: "success",
      runDir: path.relative(rootDir, result.runDir),
      summaryFile: path.relative(rootDir, path.join(result.runDir, "summary.md")),
      productCount: bundle.products.length,
      conceptCount: bundle.products.reduce(
        (total, product) => total + product.disruptionConcepts.length,
        0,
      ),
      completeProductCount: bundle.products.filter(
        (product) => !product.maybeDisruptionException && product.disruptionConcepts.length === 2,
      ).length,
      productsNeedingSecondConceptCount: bundle.products.filter(
        (product) => !product.maybeDisruptionException && product.disruptionConcepts.length < 2,
      ).length,
      exceptionCount: bundle.products.filter((product) => product.maybeDisruptionException).length,
    });
  } catch (error) {
    summaryEntries.push({
      companySlug,
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const summary = {
  runId,
  generatedOn: new Date().toISOString(),
  mode,
  providerPreference,
  target,
  requestedCompanies: [...requestedCompanies],
  companyCount: targets.length,
  successCount: summaryEntries.filter((entry) => entry.status === "success").length,
  failureCount: summaryEntries.filter((entry) => entry.status === "failed").length,
  totalConceptCount: summaryEntries.reduce((total, entry) => total + (entry.conceptCount ?? 0), 0),
  totalCompleteProductCount: summaryEntries.reduce(
    (total, entry) => total + (entry.completeProductCount ?? 0),
    0,
  ),
  totalProductsNeedingSecondConceptCount: summaryEntries.reduce(
    (total, entry) => total + (entry.productsNeedingSecondConceptCount ?? 0),
    0,
  ),
  totalExceptionCount: summaryEntries.reduce(
    (total, entry) => total + (entry.exceptionCount ?? 0),
    0,
  ),
  entries: summaryEntries,
};

await writeJsonFile(path.join(batchRunDir, "summary.json"), summary);
await writeFile(path.join(batchRunDir, "summary.md"), renderBatchSummaryMarkdown(summary), "utf8");

if (summary.failureCount > 0) {
  console.error(`Sync failures recorded in ${path.relative(rootDir, batchRunDir)}.`);
  process.exit(1);
}

console.log(
  `Completed sync for ${targets.length} companies. Batch summary: ${path.relative(rootDir, path.join(batchRunDir, "summary.md"))}`,
);

function resolveSyncTarget(
  maybeTarget: string | undefined,
  maybeStaleOnly: string | undefined,
): SyncBatchTargetId {
  if (maybeTarget) {
    if (syncBatchTargetIds.includes(maybeTarget as SyncBatchTargetId)) {
      return maybeTarget as SyncBatchTargetId;
    }

    throw new Error(
      `Unsupported --target value ${maybeTarget}. Use one of: ${syncBatchTargetIds.join(", ")}.`,
    );
  }

  if (maybeStaleOnly === "true" || maybeStaleOnly === "1") {
    return "stale";
  }

  return "published";
}

function renderBatchSummaryMarkdown(summary: {
  runId: string;
  mode: RalphSyncMode;
  target: SyncBatchTargetId;
  companyCount: number;
  successCount: number;
  failureCount: number;
  totalConceptCount: number;
  totalCompleteProductCount: number;
  totalProductsNeedingSecondConceptCount: number;
  totalExceptionCount: number;
  entries: BatchSummaryEntry[];
}) {
  return [
    "# Sync Batch Summary",
    "",
    `- Run id: ${summary.runId}`,
    `- Mode: ${summary.mode}`,
    `- Target: ${summary.target}`,
    `- Companies selected: ${summary.companyCount}`,
    `- Successful companies: ${summary.successCount}`,
    `- Failed companies: ${summary.failureCount}`,
    `- Total disruption concepts: ${summary.totalConceptCount}`,
    `- Products at two concepts: ${summary.totalCompleteProductCount}`,
    `- Products still needing a second concept: ${summary.totalProductsNeedingSecondConceptCount}`,
    `- Total documented exceptions: ${summary.totalExceptionCount}`,
    "",
    "## Company results",
    ...summary.entries.map((entry) =>
      entry.status === "success"
        ? `- ${entry.companySlug}: ${entry.conceptCount ?? 0} concepts across ${entry.productCount ?? 0} products, ${entry.completeProductCount ?? 0} products at two concepts, ${entry.productsNeedingSecondConceptCount ?? 0} still needing a second concept, ${entry.exceptionCount ?? 0} exceptions · run ${entry.runDir ?? "n/a"}`
        : `- ${entry.companySlug}: FAILED · ${entry.error ?? "Unknown error"}`,
    ),
  ].join("\n");
}
