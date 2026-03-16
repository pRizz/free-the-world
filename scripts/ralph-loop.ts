import type {
  RalphProviderPreference,
  ResearchRunManifest,
  ResearchTaskId,
} from "../src/lib/domain/content-types";
import { writeJsonFile } from "./lib/content";
import { ensureRunDir, parseArgs, parseList, promptTasks, runLoopTask } from "./lib/ralph";
import { collectLoopTargets } from "./lib/ralph-loop-targets";

const args = parseArgs(process.argv.slice(2));

if (args.help === "true") {
  console.log(
    "Usage: bun run loop [--company=<slug>[,<slug>]] [--task=<task-id>[,<task-id>]] [--batch-id=<id>] [--provider=auto|codex|claude|both] [--execute=true]",
  );
  process.exit(0);
}

const requestedCompanySlugs = parseList(args.company ?? args.companies);
const requestedTaskIds = parseList(args.task ?? args.tasks) as ResearchTaskId[];
const batchId = args["batch-id"]?.trim() || undefined;
const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const shouldExecute = args.execute === "true" || args.execute === "1";
const taskIds =
  requestedTaskIds.length > 0
    ? requestedTaskIds
    : promptTasks.filter((task) => task.id !== "company-sync").map((task) => task.id);
const targets = await collectLoopTargets({
  requestedCompanySlugs,
  batchId,
});

if (batchId && taskIds.includes("company-sync")) {
  throw new Error(
    [
      "Queued batch runs only support low-level Ralph loop tasks.",
      "Fix: remove --task=company-sync from the batch run, or promote the manifest first and use bun run sync:company --company=<slug>.",
    ].join("\n"),
  );
}

for (const target of targets) {
  const { runDir, runId } = await ensureRunDir(target.companySlug);
  const taskResults = [];

  for (const taskId of taskIds) {
    const results = await runLoopTask({
      target,
      taskId,
      providerPreference,
      execute: shouldExecute,
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
    requestedProvider: providerPreference,
    resolvedProviders: shouldExecute
      ? [...new Set(taskResults.map((result) => result.provider))]
      : [],
    taskResults,
    generatedOn: new Date().toISOString(),
  };

  await writeJsonFile(`${runDir}/run.manifest.json`, runManifest);
}

console.log(`Prepared ${targets.length * taskIds.length} Ralph loop job(s) in research/runs.`);
