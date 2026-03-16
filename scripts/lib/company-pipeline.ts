import path from "node:path";
import type {
  ManifestQueueEntry,
  RalphProviderPreference,
  RalphSyncMode,
  ResearchRunManifest,
  ResearchTaskId,
} from "../../src/lib/domain/content-types";
import { promoteQueuedManifest, queueManifestFromFile } from "./company-intake";
import { loadManifestQueueEntries, rootDir, writeJsonFile } from "./content";
import {
  ensureRunDir,
  parseList,
  promptTasks,
  runLoopTask,
  type SyncCompanyResult,
  syncCompany,
} from "./ralph";
import { collectLoopTargets } from "./ralph-loop-targets";

const defaultLoopTaskIds: ResearchTaskId[] = ["company-overview"];
const loopableTaskIds = promptTasks
  .filter((task) => task.id !== "company-sync")
  .map((task) => task.id);

export interface CompanyPipelineOptions {
  manifestPaths: string[];
  queuedSlugs: string[];
  companySlugs: string[];
  batchId?: string;
  groupLabel?: string;
  requestNotes?: string;
  providerPreference: RalphProviderPreference;
  mode: RalphSyncMode;
  noCommit: boolean;
  skipLoop: boolean;
  skipSync: boolean;
  executeLoop: boolean;
  loopTaskIds: ResearchTaskId[];
  onProgress?: (message: string) => void;
}

export interface CompanyPipelineResult {
  queuedEntries: ManifestQueueEntry[];
  promotedSlugs: string[];
  companySlugs: string[];
  loopRunDirs: string[];
  syncRuns: SyncCompanyResult[];
}

export function resolvePipelineLoopTaskIds(rawValue?: string): ResearchTaskId[] {
  const requestedTaskIds = parseList(rawValue);
  if (requestedTaskIds.length === 0) {
    return [...defaultLoopTaskIds];
  }

  if (requestedTaskIds.length === 1 && requestedTaskIds[0] === "all") {
    return [...loopableTaskIds];
  }

  const invalidTaskIds = requestedTaskIds.filter(
    (taskId): taskId is string => !loopableTaskIds.includes(taskId as ResearchTaskId),
  );
  if (invalidTaskIds.length > 0) {
    throw new Error(
      [
        `Unsupported loop task id(s): ${invalidTaskIds.join(", ")}.`,
        `Fix: use one or more of ${loopableTaskIds.join(", ")}, or --loop-tasks=all.`,
      ].join("\n"),
    );
  }

  return requestedTaskIds as ResearchTaskId[];
}

export async function runCompanyPipeline(
  options: CompanyPipelineOptions,
): Promise<CompanyPipelineResult> {
  const manifestPaths = dedupe(options.manifestPaths);
  const queuedSlugs = dedupe(options.queuedSlugs);
  const companySlugs = dedupe(options.companySlugs);

  if (
    manifestPaths.length === 0 &&
    queuedSlugs.length === 0 &&
    companySlugs.length === 0 &&
    !options.batchId
  ) {
    throw new Error(
      "Usage requires at least one selector: --manifest=..., --queued=..., --company=..., or --batch-id=....",
    );
  }

  if (
    options.skipLoop &&
    options.skipSync &&
    manifestPaths.length === 0 &&
    queuedSlugs.length === 0 &&
    !options.batchId
  ) {
    throw new Error(
      "Nothing to do: both --skip-loop and --skip-sync are enabled, and no manifests or queued slugs were provided for queue/promotion.",
    );
  }

  const queuedEntries: ManifestQueueEntry[] = [];
  const queuedThisRunSlugs: string[] = [];

  for (const manifestPath of manifestPaths) {
    const resolvedManifestPath = path.resolve(rootDir, manifestPath);
    options.onProgress?.(`Queueing ${path.relative(rootDir, resolvedManifestPath)}`);
    const queueEntry = await queueManifestFromFile(resolvedManifestPath, {
      batchId: options.batchId,
      groupLabel: options.groupLabel,
      requestNotes: options.requestNotes,
    });
    queuedEntries.push(queueEntry);
    queuedThisRunSlugs.push(queueEntry.manifest.slug);
  }

  const queuedPromotionSlugs = await resolveQueuedPromotionSlugs({
    batchId: options.batchId,
    queuedSlugs,
    queuedThisRunSlugs,
    companySlugs,
  });

  const promotedSlugs: string[] = [];
  for (const slug of queuedPromotionSlugs) {
    options.onProgress?.(`Promoting queued manifest ${slug}`);
    await promoteQueuedManifest(slug);
    promotedSlugs.push(slug);
  }

  const canonicalCompanySlugs = dedupe([...promotedSlugs, ...companySlugs]);
  if (canonicalCompanySlugs.length === 0) {
    return {
      queuedEntries,
      promotedSlugs,
      companySlugs: canonicalCompanySlugs,
      loopRunDirs: [],
      syncRuns: [],
    };
  }

  const loopRunDirs: string[] = [];
  if (!options.skipLoop) {
    const targets = await collectLoopTargets({
      requestedCompanySlugs: canonicalCompanySlugs,
    });

    for (const target of targets) {
      options.onProgress?.(
        `Running Ralph loop for ${target.companySlug} (${options.loopTaskIds.join(", ")})`,
      );
      const { runDir, runId } = await ensureRunDir(target.companySlug);
      const taskResults = [];

      for (const taskId of options.loopTaskIds) {
        const results = await runLoopTask({
          target,
          taskId,
          providerPreference: options.providerPreference,
          execute: options.executeLoop,
          runDir,
        });
        taskResults.push(...results);
      }

      const runManifest: ResearchRunManifest = {
        schemaVersion: 1,
        runId,
        companySlug: target.companySlug,
        targetSource: target.targetSource,
        batchId: target.batchId,
        mode: "dry-run",
        requestedProvider: options.providerPreference,
        resolvedProviders: options.executeLoop
          ? [...new Set(taskResults.map((result) => result.provider))]
          : [],
        taskResults,
        generatedOn: new Date().toISOString(),
      };

      await writeJsonFile(path.join(runDir, "run.manifest.json"), runManifest);
      loopRunDirs.push(runDir);
    }
  }

  const syncRuns: SyncCompanyResult[] = [];
  if (!options.skipSync) {
    for (const companySlug of canonicalCompanySlugs) {
      options.onProgress?.(`Syncing ${companySlug} in ${options.mode} mode`);
      const result = await syncCompany({
        companySlug,
        providerPreference: options.providerPreference,
        mode: options.mode,
        noCommit: options.noCommit,
      });
      syncRuns.push(result);
    }
  }

  return {
    queuedEntries,
    promotedSlugs,
    companySlugs: canonicalCompanySlugs,
    loopRunDirs,
    syncRuns,
  };
}

async function resolveQueuedPromotionSlugs(options: {
  batchId?: string;
  queuedSlugs: string[];
  queuedThisRunSlugs: string[];
  companySlugs: string[];
}) {
  const explicitQueuedSlugs = dedupe([...options.queuedThisRunSlugs, ...options.queuedSlugs]);

  if (options.batchId) {
    if (explicitQueuedSlugs.length > 0) {
      const batchTargets = await collectLoopTargets({
        requestedCompanySlugs: explicitQueuedSlugs,
        batchId: options.batchId,
      });
      return batchTargets.map((target) => target.companySlug);
    }

    if (options.companySlugs.length === 0) {
      const batchTargets = await collectLoopTargets({
        requestedCompanySlugs: [],
        batchId: options.batchId,
      });
      return batchTargets.map((target) => target.companySlug);
    }

    return [];
  }

  if (explicitQueuedSlugs.length === 0) {
    return [];
  }

  const queueEntries = await loadManifestQueueEntries();
  const queuedEntryBySlug = new Map(queueEntries.map((entry) => [entry.manifest.slug, entry]));

  for (const slug of explicitQueuedSlugs) {
    if (!queuedEntryBySlug.has(slug)) {
      throw new Error(
        [
          `Queued manifest ${slug} was not found.`,
          "Fix: queue it first with bun run company:queue --manifest=..., or pass --company=<slug> if it is already canonical.",
        ].join("\n"),
      );
    }
  }

  return explicitQueuedSlugs;
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}
