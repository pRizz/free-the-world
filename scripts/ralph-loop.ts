import type { RalphProviderPreference, ResearchRunManifest, ResearchTaskId } from "../src/lib/domain/content-types";
import { loadRawContent, writeJsonFile } from "./lib/content";
import { ensureRunDir, parseArgs, parseList, promptTasks, runLoopTask } from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

if (args.help === "true") {
  console.log(
    "Usage: bun run loop [--company=<slug>[,<slug>]] [--task=<task-id>[,<task-id>]] [--provider=auto|codex|claude|both] [--execute=true]"
  );
  process.exit(0);
}

const requestedCompanySlugs = parseList(args.company ?? args.companies);
const requestedTaskIds = parseList(args.task ?? args.tasks) as ResearchTaskId[];
const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const shouldExecute = args.execute === "true" || args.execute === "1";

const raw = await loadRawContent();
const companySlugs =
  requestedCompanySlugs.length > 0 ? requestedCompanySlugs : raw.bundles.map(bundle => bundle.company.slug);
const taskIds =
  requestedTaskIds.length > 0 ? requestedTaskIds : promptTasks.filter(task => task.id !== "company-sync").map(task => task.id);

for (const companySlug of companySlugs) {
  const { runDir, runId } = await ensureRunDir(companySlug);
  const taskResults = [];

  for (const taskId of taskIds) {
    const results = await runLoopTask({
      companySlug,
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
    companySlug,
    mode: "dry-run",
    requestedProvider: providerPreference,
    resolvedProviders: shouldExecute ? [...new Set(taskResults.map(result => result.provider))] : [],
    taskResults,
    generatedOn: new Date().toISOString(),
  };

  await writeJsonFile(`${runDir}/run.manifest.json`, runManifest);
}

console.log(`Prepared ${companySlugs.length * taskIds.length} Ralph loop job(s) in research/runs.`);
