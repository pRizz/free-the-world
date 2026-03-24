import path from "node:path";
import type {
  RalphProviderPreference,
  RalphSyncMode,
  ResearchRunManifest,
} from "../src/lib/domain/content-types";
import {
  compileContent,
  contentDir,
  generatedGraphFile,
  implementationPromptsDir,
  loadRawContent,
  rootDir,
  writeGeneratedContentGraph,
  writeJsonFile,
} from "./lib/content";
import { writeImplementationPromptPayload } from "./lib/implementation-prompts";
import {
  buildImplementationPromptPayload,
  ensureRunDir,
  parseArgs,
  parseList,
  writeImplementationPromptTaskArtifacts,
} from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

const usage =
  "Usage: bun run company:prompts [--company=<slug[,slug]>|--all=true] [--provider=auto|codex|claude|both] [--mode=dry-run|publish]";

if (args.help === "true") {
  console.log(usage);
  process.exit(0);
}

const requestedCompanySlugs = parseList(args.company ?? args.companies);
const includeAllCompanies = args.all === "true" || args.all === "1";
const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const mode = (args.mode ?? "dry-run") as RalphSyncMode;
const raw = await loadRawContent(contentDir);
const companySlugs = resolveRequestedCompanySlugs({
  requestedCompanySlugs,
  includeAllCompanies,
  rawBundleSlugs: raw.bundles.map((bundle) => bundle.company.slug),
});

for (const companySlug of companySlugs) {
  const bundle = raw.bundles.find((entry) => entry.company.slug === companySlug);
  if (!bundle) {
    throw new Error(`No published bundle exists for ${companySlug}.`);
  }

  const { runDir, runId } = await ensureRunDir(companySlug);
  const payload = await buildImplementationPromptPayload({
    bundle,
    sources: raw.sources,
    allTechnologyWaves: raw.technologyWaves,
  });
  const files = await writeImplementationPromptTaskArtifacts({
    runDir,
    payload,
    companyName: bundle.company.name,
  });

  if (mode === "publish") {
    const obsoleteProductSlugs = raw.implementationPrompts
      .filter(
        (prompt) =>
          prompt.companySlug === companySlug &&
          !bundle.products.some((product) => product.slug === prompt.productSlug),
      )
      .map((prompt) => prompt.productSlug);

    await writeImplementationPromptPayload(implementationPromptsDir, payload, {
      obsoleteProductSlugs,
    });
  }

  const runManifest: ResearchRunManifest = {
    schemaVersion: 1,
    runId,
    companySlug,
    mode,
    requestedProvider: providerPreference,
    resolvedProviders: [],
    taskResults: [
      {
        taskId: "implementation-prompts",
        provider: "local",
        promptFile: relativeToRepo(files.promptFile),
        rawOutputFile: relativeToRepo(files.rawOutputFile),
        normalizedFile: relativeToRepo(files.normalizedFile),
        validationFile: relativeToRepo(files.validationFile),
        exitCode: 0,
        success: true,
        generatedOn: new Date().toISOString(),
      },
    ],
    generatedOn: new Date().toISOString(),
  };
  await writeJsonFile(path.join(runDir, "run.manifest.json"), runManifest);
}

if (mode === "publish") {
  const { graph } = await compileContent(contentDir);
  await writeGeneratedContentGraph(graph, generatedGraphFile);
}

console.log(
  `Generated implementation prompts for ${companySlugs.length} compan${companySlugs.length === 1 ? "y" : "ies"} in ${mode} mode.`,
);

function relativeToRepo(targetPath: string) {
  return path.relative(rootDir, targetPath);
}

function resolveRequestedCompanySlugs(options: {
  requestedCompanySlugs: string[];
  includeAllCompanies: boolean;
  rawBundleSlugs: string[];
}) {
  if (options.includeAllCompanies) {
    return [...new Set(options.rawBundleSlugs)].sort();
  }

  const uniqueSlugs = [...new Set(options.requestedCompanySlugs)];
  if (uniqueSlugs.length === 0) {
    throw new Error(
      "Usage requires --company=<slug[,slug]> or --all=true so the command knows which published bundles to target.",
    );
  }

  return uniqueSlugs;
}
