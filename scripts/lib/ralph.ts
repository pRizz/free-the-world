import { access, appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { accessSync, constants as fsConstants } from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import type {
  CompanyManifest,
  ResearchLoopTarget,
  CompanySyncPayload,
  RalphProviderId,
  RalphProviderPreference,
  RalphProvidersFile,
  RalphSyncMode,
  ResearchRunManifest,
  ResearchTaskDefinition,
  ResearchTaskId,
  ResearchTaskResult,
} from "../../src/lib/domain/content-types";
import { type CompanyBundle } from "../../src/lib/domain/content-types";
import type { SourceCitation, TechnologyWave } from "../../src/lib/domain/types";
import {
  compileContent,
  contentDir,
  loadRawContent,
  rootDir,
  validateAndCompile,
  writeJsonFile,
} from "./content";
import { getManifestFile } from "./company-intake";

export const promptTasks: ResearchTaskDefinition[] = [
  {
    id: "company-overview",
    label: "Company overview synthesis",
    templateFile: "company-overview.md",
    outputSuffix: "overview",
  },
  {
    id: "moat-analysis",
    label: "Moat analysis",
    templateFile: "moat-analysis.md",
    outputSuffix: "moat",
  },
  {
    id: "decentralization-analysis",
    label: "Decentralization analysis",
    templateFile: "decentralization-analysis.md",
    outputSuffix: "decentralization",
  },
  {
    id: "product-alternatives",
    label: "Product alternatives scan",
    templateFile: "product-alternatives.md",
    outputSuffix: "alternatives",
  },
  {
    id: "source-gathering",
    label: "Source gathering",
    templateFile: "source-gathering.md",
    outputSuffix: "sources",
  },
  {
    id: "company-sync",
    label: "Full company bundle sync",
    templateFile: "company-sync.md",
    outputSuffix: "company-sync",
  },
];

const localProviderConfigFile = path.join(rootDir, ".codex", "ralph.providers.local.json");
const exampleProviderConfigFile = path.join(rootDir, "config", "ralph.providers.example.json");
const promptsDir = path.join(rootDir, "prompts");
const researchRunsDir = path.join(rootDir, "research", "runs");
const staleAfterDays = 30;
const providerHeartbeatIntervalMs = 15_000;

export interface ProviderExecutionResult {
  provider: RalphProviderId;
  rawOutput: string;
  stderr: string;
  exitCode: number;
}

export interface CompanyContext {
  manifest: CompanyManifest;
  currentBundle: CompanyBundle | null;
  currentSources: SourceCitation[];
  currentTechnologyWaves: TechnologyWave[];
  taxonomyJson: string;
}

export interface SyncCompanyOptions {
  companySlug: string;
  providerPreference: RalphProviderPreference;
  mode: RalphSyncMode;
  noCommit: boolean;
}

export interface SyncCompanyResult {
  runDir: string;
  runManifest: ResearchRunManifest;
}

type RalphTraceLogger = (event: string, details?: Record<string, unknown>) => Promise<void>;

interface LoopPromptContext {
  companyName: string;
  ticker: string;
  sectorId: string;
  industryId: string;
  description: string;
  snapshotNote: string;
  productNames: string;
  technologyWaves: string;
  companyDataJson: string;
  companyManifestJson: string;
  currentBundleJson: string;
  currentSourcesJson: string;
  taxonomyJson: string;
}

export function parseArgs(rawArgs: string[]) {
  const parsed: Record<string, string> = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const currentArg = rawArgs[index];
    if (!currentArg.startsWith("--")) {
      continue;
    }

    const trimmedArg = currentArg.slice(2);
    if (trimmedArg.includes("=")) {
      const separatorIndex = trimmedArg.indexOf("=");
      const key = trimmedArg.slice(0, separatorIndex);
      const value = trimmedArg.slice(separatorIndex + 1) || "true";
      parsed[key] = value;
      continue;
    }

    const maybeNext = rawArgs[index + 1];
    if (!maybeNext || maybeNext.startsWith("--")) {
      parsed[trimmedArg] = "true";
      continue;
    }

    parsed[trimmedArg] = maybeNext;
    index += 1;
  }

  return parsed;
}

export function parseList(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map(entry => entry.trim())
    .filter(Boolean);
}

export function createRunId() {
  return new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
}

export async function ensureRunDir(companySlug: string, runId = createRunId()) {
  const runDir = path.join(researchRunsDir, companySlug, runId);
  await mkdir(runDir, { recursive: true });
  return { runDir, runId };
}

function createTraceLogger(runDir: string, scope: string): RalphTraceLogger {
  const traceFile = path.join(runDir, "trace.log");

  return async (event, details = {}) => {
    const payload = {
      ts: new Date().toISOString(),
      scope,
      event,
      details,
    };
    const line = JSON.stringify(payload);
    console.log(`[ralph] ${scope} ${event}${Object.keys(details).length > 0 ? ` ${JSON.stringify(details)}` : ""}`);
    await appendFile(traceFile, `${line}\n`, "utf8");
  };
}

function tailPreview(value: string, maxLength = 240) {
  const compact = value.replaceAll(/\s+/g, " ").trim();
  if (compact.length <= maxLength) {
    return compact;
  }

  return compact.slice(-maxLength);
}

export async function loadProviderConfig(): Promise<RalphProvidersFile> {
  for (const providerConfigFile of [localProviderConfigFile, exampleProviderConfigFile]) {
    try {
      await access(providerConfigFile, fsConstants.F_OK);
      const rawText = await readFile(providerConfigFile, "utf8");
      return JSON.parse(rawText) as RalphProvidersFile;
    } catch {
      continue;
    }
  }

  throw new Error(
    [
      "No Ralph provider config found.",
      `Fix: copy ${path.relative(rootDir, exampleProviderConfigFile)} to ${path.relative(rootDir, localProviderConfigFile)} for local overrides, or add a provider config at one of those paths.`,
    ].join("\n")
  );
}

export function detectProviderAvailability(providerConfig: RalphProvidersFile) {
  return {
    claude: commandExists(providerConfig.providers.claude.command),
    codex: commandExists(providerConfig.providers.codex.command),
  } satisfies Record<RalphProviderId, boolean>;
}

export function resolveProviders(
  providerPreference: RalphProviderPreference,
  providerConfig: RalphProvidersFile
): RalphProviderId[] {
  const availability = detectProviderAvailability(providerConfig);
  const orderedProviders = providerConfig.defaultProviderOrder.filter(provider => availability[provider]);
  const configGuidance = `Check ${path.relative(rootDir, exampleProviderConfigFile)} and ${path.relative(rootDir, localProviderConfigFile)}.`;

  if (providerPreference === "auto") {
    if (orderedProviders.length === 0) {
      throw new Error(
        [
          "No configured Ralph providers are available.",
          `Configured commands: codex=${providerConfig.providers.codex.command} (available=${availability.codex}), claude=${providerConfig.providers.claude.command} (available=${availability.claude}).`,
          `Fix: install one of the configured provider commands or update the provider config. ${configGuidance}`,
        ].join("\n")
      );
    }

    return [orderedProviders[0]];
  }

  if (providerPreference === "both") {
    if (!availability.codex || !availability.claude) {
      throw new Error(
        [
          `Provider preference "both" requires both providers to be available. codex=${availability.codex}, claude=${availability.claude}.`,
          `Fix: install the missing provider command(s) or update the provider config. ${configGuidance}`,
        ].join("\n")
      );
    }

    return providerConfig.defaultProviderOrder;
  }

  if (!availability[providerPreference]) {
    throw new Error(
      [
        `Requested provider ${providerPreference} is not available.`,
        `Configured command: ${providerConfig.providers[providerPreference].command}.`,
        `Fix: install that command or point ${providerPreference} to an installed binary. ${configGuidance}`,
      ].join("\n")
    );
  }

  return [providerPreference];
}

export async function renderPrompt(templateFile: string, variables: Record<string, string>) {
  const template = await readFile(path.join(promptsDir, templateFile), "utf8");
  return applyTemplate(template, variables);
}

export async function buildCompanyContext(companySlug: string): Promise<CompanyContext> {
  const { raw } = await compileContent(contentDir);
  const maybeManifest = raw.manifests.find(manifest => manifest.slug === companySlug);
  if (!maybeManifest) {
    throw new Error(`Unknown company manifest: ${companySlug}`);
  }

  const currentBundle = raw.bundles.find(bundle => bundle.company.slug === companySlug) ?? null;
  const currentSources = currentBundle ? getReferencedSources(currentBundle, raw.sources) : [];
  const currentTechnologyWaves = raw.technologyWaves.filter(wave => maybeManifest.technologyWaveIds.includes(wave.id));

  return {
    manifest: maybeManifest,
    currentBundle,
    currentSources,
    currentTechnologyWaves,
    taxonomyJson: JSON.stringify(
      {
        regions: raw.regions,
        indices: raw.indices,
        sectors: raw.sectors,
        industries: raw.industries,
        technologyWaves: raw.technologyWaves,
      },
      null,
      2
    ),
  };
}

export async function executeProvider(
  provider: RalphProviderId,
  prompt: string,
  variables: Record<string, string>,
  providerConfig: RalphProvidersFile,
  trace?: RalphTraceLogger
): Promise<ProviderExecutionResult> {
  const config = providerConfig.providers[provider];
  const args = config.args.map(arg => applyTemplate(arg, variables));
  const startedAt = Date.now();
  await trace?.("provider:start", {
    provider,
    command: config.command,
    args,
  });

  return new Promise(resolve => {
    const child = spawn(config.command, args, {
      cwd: rootDir,
      stdio: ["pipe", "pipe", "pipe"],
      env: process.env,
    });

    let rawOutput = "";
    let stderr = "";
    let stdoutChunkCount = 0;
    let stderrChunkCount = 0;
    let settled = false;

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    child.stdout.on("data", chunk => {
      rawOutput += chunk;
      stdoutChunkCount += 1;
      if (stdoutChunkCount <= 3) {
        void trace?.("provider:stdout-chunk", {
          provider,
          chunkBytes: chunk.length,
          preview: tailPreview(chunk),
        });
      }
    });

    child.stderr.on("data", chunk => {
      stderr += chunk;
      stderrChunkCount += 1;
      if (stderrChunkCount <= 5) {
        void trace?.("provider:stderr-chunk", {
          provider,
          chunkBytes: chunk.length,
          preview: tailPreview(chunk),
        });
      }
    });

    const heartbeat = setInterval(() => {
      void trace?.("provider:heartbeat", {
        provider,
        pid: child.pid ?? null,
        elapsedMs: Date.now() - startedAt,
        stdoutBytes: rawOutput.length,
        stderrBytes: stderr.length,
        stdoutTail: tailPreview(rawOutput),
        stderrTail: tailPreview(stderr),
      });
    }, providerHeartbeatIntervalMs);

    const finish = async (exitCode: number) => {
      if (settled) {
        return;
      }
      settled = true;
      clearInterval(heartbeat);
      await trace?.("provider:finish", {
        provider,
        pid: child.pid ?? null,
        exitCode,
        elapsedMs: Date.now() - startedAt,
        stdoutBytes: rawOutput.length,
        stderrBytes: stderr.length,
      });
      resolve({
        provider,
        rawOutput,
        stderr,
        exitCode,
      });
    };

    child.on("error", error => {
      const nextStderr = `${stderr}${stderr ? "\n" : ""}${error instanceof Error ? error.message : String(error)}`;
      stderr = nextStderr;
      void trace?.("provider:error", {
        provider,
        pid: child.pid ?? null,
        elapsedMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
      void finish(1);
    });

    child.on("close", code => {
      void finish(code ?? 1);
    });

    child.stdin.on("error", error => {
      void trace?.("provider:stdin-error", {
        provider,
        pid: child.pid ?? null,
        elapsedMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      });
    });

    child.stdin.end(prompt);
  });
}

export function extractJsonPayload(rawOutput: string) {
  const trimmedOutput = rawOutput.trim();
  if (!trimmedOutput) {
    throw new Error("Provider returned empty output.");
  }

  const directParse = tryParseJson(trimmedOutput);
  if (directParse !== null) {
    return directParse;
  }

  const fencedMatch = trimmedOutput.match(/```json\s*([\s\S]*?)```/i) ?? trimmedOutput.match(/```\s*([\s\S]*?)```/);
  if (fencedMatch) {
    const fencedParse = tryParseJson(fencedMatch[1].trim());
    if (fencedParse !== null) {
      return fencedParse;
    }
  }

  const firstBrace = trimmedOutput.indexOf("{");
  const lastBrace = trimmedOutput.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const objectParse = tryParseJson(trimmedOutput.slice(firstBrace, lastBrace + 1));
    if (objectParse !== null) {
      return objectParse;
    }
  }

  throw new Error("Provider output did not contain valid JSON.");
}

export async function runLoopTask(options: {
  target: ResearchLoopTarget;
  taskId: ResearchTaskId;
  providerPreference: RalphProviderPreference;
  execute: boolean;
  runDir: string;
}) {
  const task = promptTasks.find(entry => entry.id === options.taskId);
  if (!task) {
    throw new Error(`Unknown Ralph task: ${options.taskId}`);
  }

  const trace = createTraceLogger(options.runDir, `loop:${options.target.companySlug}:${options.taskId}`);
  await trace("task:start", {
    execute: options.execute,
    providerPreference: options.providerPreference,
    targetSource: options.target.targetSource,
    batchId: options.target.batchId ?? null,
  });

  const { graph, raw } = await compileContent();
  const context = buildLoopPromptContext(options.target, raw, graph);
  const providerConfig = options.execute ? await loadProviderConfig() : null;
  const providers = providerConfig ? resolveProviders(options.providerPreference, providerConfig) : [];

  const prompt = await renderPrompt(task.templateFile, {
    companyName: context.companyName,
    companySlug: options.target.companySlug,
    ticker: context.ticker,
    sectorId: context.sectorId,
    industryId: context.industryId,
    description: context.description,
    snapshotNote: context.snapshotNote,
    productNames: context.productNames,
    technologyWaves: context.technologyWaves,
    companyDataJson: context.companyDataJson,
    companyManifestJson: context.companyManifestJson,
    currentBundleJson: context.currentBundleJson,
    currentSourcesJson: context.currentSourcesJson,
    taxonomyJson: context.taxonomyJson,
  });

  const promptFile = path.join(options.runDir, `${task.outputSuffix}.prompt.md`);
  await writeFile(promptFile, prompt, "utf8");
  await trace("prompt:written", {
    promptFile: path.relative(rootDir, promptFile),
    promptBytes: prompt.length,
  });
  await trace("providers:resolved", {
    providers,
  });

  const taskResults: ResearchTaskResult[] = [];
  if (!options.execute) {
    await trace("task:prepared-only", {
      provider: "codex",
    });
    taskResults.push({
      taskId: task.id,
      provider: "codex",
      promptFile: path.relative(rootDir, promptFile),
      rawOutputFile: "",
      exitCode: 0,
      success: true,
      generatedOn: new Date().toISOString(),
    });
    return taskResults;
  }

  for (const provider of providers) {
    const rawOutputFile = path.join(options.runDir, `${task.outputSuffix}.${provider}.raw.txt`);
    const normalizedFile = path.join(options.runDir, `${task.outputSuffix}.${provider}.normalized.json`);
    const validationFile = path.join(options.runDir, `${task.outputSuffix}.${provider}.validation.json`);

    const execution = await executeProvider(provider, prompt, {
      rootDir,
      companySlug: options.target.companySlug,
      taskId: task.id,
      runDir: options.runDir,
    }, providerConfig!, trace);

    await writeFile(rawOutputFile, execution.rawOutput, "utf8");
    if (execution.stderr) {
      await writeFile(path.join(options.runDir, `${task.outputSuffix}.${provider}.stderr.txt`), execution.stderr, "utf8");
    }

    let success = execution.exitCode === 0;
    let normalizedValue: unknown = null;
    let validationSummary: Record<string, unknown> = {
      exitCode: execution.exitCode,
      provider,
    };

    if (success) {
      try {
        normalizedValue = extractJsonPayload(execution.rawOutput);
        await writeJsonFile(normalizedFile, normalizedValue);
        validationSummary = {
          ...validationSummary,
          validJson: true,
        };
        await trace("validation:success", {
          provider,
          normalizedFile: path.relative(rootDir, normalizedFile),
        });
      } catch (error) {
        success = false;
        validationSummary = {
          ...validationSummary,
          validJson: false,
          error: error instanceof Error ? error.message : String(error),
        };
        await trace("validation:failure", {
          provider,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      validationSummary = {
        ...validationSummary,
        validJson: false,
        error: execution.stderr || "Provider command failed.",
      };
      await trace("provider:nonzero-exit", {
        provider,
        exitCode: execution.exitCode,
      });
    }

    await writeJsonFile(validationFile, validationSummary);
    taskResults.push({
      taskId: task.id,
      provider,
      promptFile: path.relative(rootDir, promptFile),
      rawOutputFile: path.relative(rootDir, rawOutputFile),
      normalizedFile: normalizedValue ? path.relative(rootDir, normalizedFile) : undefined,
      validationFile: path.relative(rootDir, validationFile),
      exitCode: execution.exitCode,
      success,
      generatedOn: new Date().toISOString(),
    });
  }

  return taskResults;
}

export async function syncCompany(options: SyncCompanyOptions): Promise<SyncCompanyResult> {
  const providerConfig = await loadProviderConfig();
  const providers = resolveProviders(options.providerPreference, providerConfig);
  const raw = await loadRawContent();
  const context = await buildCompanyContext(options.companySlug);
  const { runDir, runId } = await ensureRunDir(options.companySlug);
  const trace = createTraceLogger(runDir, `sync:${options.companySlug}`);
  await trace("sync:start", {
    mode: options.mode,
    providerPreference: options.providerPreference,
    noCommit: options.noCommit,
  });
  await trace("providers:resolved", {
    providers,
  });
  await trace("context:loaded", {
    hasCurrentBundle: Boolean(context.currentBundle),
    currentSourceCount: context.currentSources.length,
    technologyWaveCount: context.currentTechnologyWaves.length,
  });
  const taskResults: ResearchTaskResult[] = [];
  const candidatePayloads = new Map<RalphProviderId, CompanySyncPayload>();

  const prompt = await renderPrompt("company-sync.md", {
    companySlug: options.companySlug,
    companyManifestJson: JSON.stringify(context.manifest, null, 2),
    currentBundleJson: JSON.stringify(context.currentBundle, null, 2),
    currentSourcesJson: JSON.stringify(context.currentSources, null, 2),
    taxonomyJson: context.taxonomyJson,
  });

  const promptFile = path.join(runDir, "company-sync.prompt.md");
  await writeFile(promptFile, prompt, "utf8");
  await trace("prompt:written", {
    promptFile: path.relative(rootDir, promptFile),
    promptBytes: prompt.length,
  });

  for (const provider of providers) {
    const execution = await executeProvider(provider, prompt, {
      rootDir,
      companySlug: options.companySlug,
      taskId: "company-sync",
      runDir,
    }, providerConfig, trace);

    const rawOutputFile = path.join(runDir, `company-sync.${provider}.raw.txt`);
    const normalizedFile = path.join(runDir, `company-sync.${provider}.normalized.json`);
    const validationFile = path.join(runDir, `company-sync.${provider}.validation.json`);

    await writeFile(rawOutputFile, execution.rawOutput, "utf8");
    if (execution.stderr) {
      await writeFile(path.join(runDir, `company-sync.${provider}.stderr.txt`), execution.stderr, "utf8");
    }

    let success = execution.exitCode === 0;
    let validationSummary: Record<string, unknown> = { provider, exitCode: execution.exitCode };
    if (success) {
      try {
        const payload = extractJsonPayload(execution.rawOutput) as CompanySyncPayload;
        const validatedCandidate = validateSyncPayload(payload, raw, context.manifest);
        await writeJsonFile(normalizedFile, payload);
        await writeJsonFile(validationFile, {
          ...validationSummary,
          validJson: true,
          validContent: true,
          manifestFile: path.relative(rootDir, validatedCandidate.manifestFile),
          bundleFile: path.relative(rootDir, validatedCandidate.bundleFile),
        });
        candidatePayloads.set(provider, payload);
        await trace("validation:success", {
          provider,
          normalizedFile: path.relative(rootDir, normalizedFile),
          bundleFile: path.relative(rootDir, validatedCandidate.bundleFile),
        });
      } catch (error) {
        success = false;
        await writeJsonFile(validationFile, {
          ...validationSummary,
          validJson: false,
          validContent: false,
          error: error instanceof Error ? error.message : String(error),
        });
        await trace("validation:failure", {
          provider,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      await writeJsonFile(validationFile, {
        ...validationSummary,
        validJson: false,
        validContent: false,
        error: execution.stderr || "Provider command failed.",
      });
      await trace("provider:nonzero-exit", {
        provider,
        exitCode: execution.exitCode,
      });
    }

    taskResults.push({
      taskId: "company-sync",
      provider,
      promptFile: path.relative(rootDir, promptFile),
      rawOutputFile: path.relative(rootDir, rawOutputFile),
      normalizedFile: candidatePayloads.has(provider) ? path.relative(rootDir, normalizedFile) : undefined,
      validationFile: path.relative(rootDir, validationFile),
      notesFile: undefined,
      exitCode: execution.exitCode,
      success,
      generatedOn: new Date().toISOString(),
    });
  }

  const selectedProvider = providerConfig.defaultProviderOrder.find(provider => candidatePayloads.has(provider));
  if (!selectedProvider) {
    await trace("sync:no-valid-payload", {
      providers,
      taskResults: taskResults.map(result => ({
        provider: result.provider,
        exitCode: result.exitCode,
        success: result.success,
      })),
    });
    const runManifest: ResearchRunManifest = {
      schemaVersion: 1,
      runId,
      companySlug: options.companySlug,
      mode: options.mode,
      requestedProvider: options.providerPreference,
      resolvedProviders: providers,
      taskResults,
      generatedOn: new Date().toISOString(),
    };

    await writeJsonFile(path.join(runDir, "run.manifest.json"), runManifest);
    throw new Error(`No valid sync payload produced for company ${options.companySlug}.`);
  }

  const selectedPayload = candidatePayloads.get(selectedProvider)!;
  const validatedCandidate = validateSyncPayload(selectedPayload, raw, context.manifest);
  await trace("candidate:selected", {
    provider: selectedProvider,
    bundleFile: path.relative(rootDir, validatedCandidate.bundleFile),
  });
  await writeJsonFile(path.join(runDir, "candidate.bundle.json"), selectedPayload.bundle);
  await writeJsonFile(path.join(runDir, "candidate.manifest.json"), validatedCandidate.manifest);
  await writeJsonFile(path.join(runDir, "candidate.sources.json"), selectedPayload.sources);
  if (selectedPayload.summaryMarkdown) {
    await writeFile(path.join(runDir, "summary.md"), selectedPayload.summaryMarkdown, "utf8");
  }

  let commitSha: string | undefined;
  if (options.mode === "publish") {
    await trace("publish:persist:start");
    await persistCandidate(validatedCandidate);
    await trace("publish:persist:finish");
    await runPublishChecks(trace);

    if (!options.noCommit) {
      await trace("publish:git:start");
      commitSha = commitAndPush(options.companySlug);
      await trace("publish:git:finish", {
        commitSha,
      });
    }
  }

  const runManifest: ResearchRunManifest = {
    schemaVersion: 1,
    runId,
    companySlug: options.companySlug,
    mode: options.mode,
    requestedProvider: options.providerPreference,
    resolvedProviders: providers,
    taskResults,
    generatedOn: new Date().toISOString(),
    publishedBundleFile: options.mode === "publish" ? path.relative(rootDir, validatedCandidate.bundleFile) : undefined,
    publishedSourceIds: selectedPayload.sources.map(source => source.id),
    commitSha,
  };

  await writeJsonFile(path.join(runDir, "run.manifest.json"), runManifest);
  await trace("sync:complete", {
    runManifest: path.relative(rootDir, path.join(runDir, "run.manifest.json")),
    publishedBundleFile: runManifest.publishedBundleFile ?? null,
  });
  return { runDir, runManifest };
}

export function isBundleStale(bundle: CompanyBundle, now = new Date()) {
  const reviewDates = Object.values(bundle.company.inputMetrics).map(metric => metric.lastReviewedOn);
  const latestReviewDate = reviewDates.sort().at(-1);
  if (!latestReviewDate) {
    return true;
  }

  const latestReview = new Date(`${latestReviewDate}T00:00:00Z`);
  const ageInDays = (now.getTime() - latestReview.getTime()) / (24 * 60 * 60 * 1000);
  return ageInDays >= staleAfterDays;
}

export function collectSyncTargets(raw: Awaited<ReturnType<typeof loadRawContent>>, staleOnly: boolean) {
  if (!staleOnly) {
    return raw.manifests.map(manifest => manifest.slug);
  }

  const bundleBySlug = new Map(raw.bundles.map(bundle => [bundle.company.slug, bundle]));
  return raw.manifests
    .map(manifest => manifest.slug)
    .filter(slug => {
      const maybeBundle = bundleBySlug.get(slug);
      if (!maybeBundle) {
        return true;
      }

      return isBundleStale(maybeBundle);
    });
}

function buildLoopPromptContext(
  target: ResearchLoopTarget,
  raw: Awaited<ReturnType<typeof loadRawContent>>,
  graph: Awaited<ReturnType<typeof compileContent>>["graph"]
): LoopPromptContext {
  const company = graph.companies.find(entry => entry.slug === target.companySlug) ?? null;
  const currentBundle = raw.bundles.find(entry => entry.company.slug === target.companySlug) ?? null;
  const currentSources = currentBundle ? getReferencedSources(currentBundle, raw.sources) : [];
  const currentProducts = graph.products.filter(product => product.companySlug === target.companySlug);
  const currentTechnologyWaves = graph.technologyWaves.filter(wave =>
    target.manifest.technologyWaveIds.includes(wave.id)
  );
  const knownProductNames =
    currentProducts.length > 0 ? currentProducts.map(product => product.name) : target.manifest.seedProductNames ?? [];

  return {
    companyName: company?.name ?? target.manifest.name,
    ticker: company?.ticker ?? target.manifest.ticker,
    sectorId: company?.sectorId ?? target.manifest.sectorId,
    industryId: company?.industryId ?? target.manifest.industryId,
    description: company?.description ?? target.manifest.description,
    snapshotNote: company?.snapshotNote ?? "Pending first structured sync.",
    productNames: formatPromptList(knownProductNames, "None yet in repo context."),
    technologyWaves: formatPromptBulletList(
      currentTechnologyWaves.map(wave => `${wave.label}: ${wave.summary}`),
      "None mapped yet in repo context."
    ),
    companyDataJson: JSON.stringify(
      {
        target: {
          source: target.targetSource,
          batchId: target.batchId ?? null,
          createdOn: target.queueEntry?.createdOn ?? null,
          groupLabel: target.queueEntry?.groupLabel ?? null,
          requestNotes: target.queueEntry?.requestNotes ?? null,
        },
        manifest: target.manifest,
        company,
        currentBundle,
        currentSources,
        knownProducts: knownProductNames.map(name => ({ name })),
        knownSourceUrls: target.manifest.seedSourceUrls ?? [],
        technologyWaves: currentTechnologyWaves,
      },
      null,
      2
    ),
    companyManifestJson: JSON.stringify(target.manifest, null, 2),
    currentBundleJson: JSON.stringify(currentBundle, null, 2),
    currentSourcesJson: JSON.stringify(currentSources, null, 2),
    taxonomyJson: JSON.stringify(
      {
        regions: raw.regions,
        indices: raw.indices,
        sectors: raw.sectors,
        industries: raw.industries,
        technologyWaves: raw.technologyWaves,
      },
      null,
      2
    ),
  };
}

export function deriveManifestFromBundle(
  bundle: CompanyBundle,
  sources: SourceCitation[],
  existingManifest: CompanyManifest | null
): CompanyManifest {
  const sourceById = new Map(sources.map(source => [source.id, source]));
  return {
    schemaVersion: 1,
    slug: bundle.company.slug,
    name: bundle.company.name,
    ticker: bundle.company.ticker,
    regionId: bundle.company.regionId,
    indexIds: bundle.company.indexIds,
    sectorId: bundle.company.sectorId,
    industryId: bundle.company.industryId,
    companiesMarketCapUrl: bundle.company.companiesMarketCapUrl,
    description: bundle.company.description,
    technologyWaveIds: bundle.company.technologyWaveIds,
    maybeIpo: bundle.company.maybeIpo,
    seedProductNames: bundle.products.map(product => product.name),
    seedSourceUrls: bundle.company.sourceIds
      .map(sourceId => sourceById.get(sourceId)?.url)
      .filter((url): url is string => Boolean(url)),
    notes: existingManifest?.notes ?? "Managed by the Ralph sync pipeline.",
  };
}

function validateSyncPayload(
  payload: CompanySyncPayload,
  raw: Awaited<ReturnType<typeof loadRawContent>>,
  existingManifest: CompanyManifest
) {
  if (payload.schemaVersion !== 1) {
    throw new Error(`Unsupported payload schemaVersion ${String(payload.schemaVersion)}.`);
  }

  if (payload.bundle.schemaVersion !== 1) {
    throw new Error(`Unsupported bundle schemaVersion ${String(payload.bundle.schemaVersion)}.`);
  }

  if (payload.bundle.company.slug !== existingManifest.slug) {
    throw new Error(`Payload company slug ${payload.bundle.company.slug} does not match manifest ${existingManifest.slug}.`);
  }

  const manifest = deriveManifestFromBundle(payload.bundle, payload.sources, existingManifest);
  const mergedSources = mergeSources(raw.sources, payload.sources);
  const nextRaw = {
    ...raw,
    manifests: [...raw.manifests.filter(manifestEntry => manifestEntry.slug !== manifest.slug), manifest],
    bundles: [...raw.bundles.filter(bundle => bundle.company.slug !== payload.bundle.company.slug), payload.bundle],
    sources: mergedSources,
  };
  validateAndCompile(nextRaw);

  return {
    manifest,
    manifestFile: getManifestFile(manifest.slug),
    bundleFile: path.join(contentDir, "companies", payload.bundle.company.slug, "bundle.json"),
    sourcesDir: path.join(contentDir, "sources"),
    payload,
  };
}

async function persistCandidate(candidate: ReturnType<typeof validateSyncPayload>) {
  await writeJsonFile(candidate.manifestFile, candidate.manifest);
  await writeJsonFile(candidate.bundleFile, candidate.payload.bundle);

  for (const source of candidate.payload.sources) {
    await writeJsonFile(path.join(candidate.sourcesDir, `${source.id}.json`), source);
  }
}

async function runPublishChecks(trace?: RalphTraceLogger) {
  const checks: Array<[string, string[]]> = [
    ["bun", ["run", "content:validate"]],
    ["bun", ["run", "typecheck"]],
    ["bun", ["run", "test"]],
    ["bun", ["run", "build"]],
    ["bun", ["run", "test:e2e"]],
  ];

  for (const [command, args] of checks) {
    const startedAt = Date.now();
    await trace?.("publish-check:start", {
      command,
      args,
    });
    runCommand(command, args);
    await trace?.("publish-check:finish", {
      command,
      args,
      elapsedMs: Date.now() - startedAt,
    });
  }
}

function commitAndPush(companySlug: string) {
  const defaultBranch = getDefaultBranch();
  const currentBranch = runGit(["rev-parse", "--abbrev-ref", "HEAD"]).trim();
  if (currentBranch !== defaultBranch) {
    throw new Error(`Publish mode requires the default branch ${defaultBranch}, but current branch is ${currentBranch}.`);
  }

  runGit(["add", "content", "research/runs", "src/lib/generated/content-graph.ts"]);
  const hasStagedChanges = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: rootDir });
  if (hasStagedChanges.status === 0) {
    return runGit(["rev-parse", "HEAD"]).trim();
  }

  runGit(["commit", "-m", `content(sync): refresh ${companySlug}`], true);
  const commitSha = runGit(["rev-parse", "HEAD"]).trim();
  runGit(["push", "origin", defaultBranch], true);
  return commitSha;
}

function getDefaultBranch() {
  const maybeRemoteHead = spawnSync("git", ["symbolic-ref", "refs/remotes/origin/HEAD"], {
    cwd: rootDir,
    encoding: "utf8",
  });
  if (maybeRemoteHead.status === 0) {
    return maybeRemoteHead.stdout.trim().split("/").at(-1) ?? "main";
  }

  return "main";
}

function runGit(args: string[], inherit = false) {
  const result = spawnSync("git", args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed.`);
  }

  return result.stdout ?? "";
}

function runCommand(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: "utf8",
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed.`);
  }
}

function mergeSources(existingSources: SourceCitation[], nextSources: SourceCitation[]) {
  const sourceById = new Map(existingSources.map(source => [source.id, source]));
  for (const source of nextSources) {
    sourceById.set(source.id, source);
  }
  return [...sourceById.values()].sort((left, right) => left.id.localeCompare(right.id));
}

function getReferencedSources(bundle: CompanyBundle, allSources: SourceCitation[]) {
  const referencedIds = collectBundleSourceIds(bundle);
  const sourceById = new Map(allSources.map(source => [source.id, source]));
  return referencedIds.map(sourceId => sourceById.get(sourceId)).filter((source): source is SourceCitation => Boolean(source));
}

function collectBundleSourceIds(bundle: CompanyBundle) {
  const collectedIds = new Set<string>();

  for (const sourceId of bundle.company.sourceIds) {
    collectedIds.add(sourceId);
  }

  for (const metric of Object.values(bundle.company.inputMetrics)) {
    for (const sourceId of metric.sourceIds) {
      collectedIds.add(sourceId);
    }
  }

  if (bundle.company.maybeIpo) {
    for (const sourceId of bundle.company.maybeIpo.dateSourceIds) {
      collectedIds.add(sourceId);
    }
    for (const sourceId of bundle.company.maybeIpo.marketCap.sourceIds) {
      collectedIds.add(sourceId);
    }
  }

  for (const product of bundle.products) {
    for (const sourceId of product.sourceIds) {
      collectedIds.add(sourceId);
    }

    for (const alternative of product.alternatives) {
      for (const sourceId of alternative.sourceIds) {
        collectedIds.add(sourceId);
      }
      for (const metric of Object.values(alternative.metrics)) {
        for (const sourceId of metric.sourceIds) {
          collectedIds.add(sourceId);
        }
      }
    }
  }

  return [...collectedIds].sort((left, right) => left.localeCompare(right));
}

function commandExists(commandName: string) {
  if (!commandName.trim()) {
    return false;
  }

  if (commandName.includes(path.sep)) {
    return isExecutableFile(commandName);
  }

  const searchPath = process.env.PATH;
  if (!searchPath) {
    return false;
  }

  return searchPath
    .split(path.delimiter)
    .filter(Boolean)
    .some(entry => isExecutableFile(path.join(entry, commandName)));
}

function formatPromptList(values: string[], fallback: string) {
  return values.length > 0 ? values.join(", ") : fallback;
}

function formatPromptBulletList(values: string[], fallback: string) {
  return values.length > 0 ? values.map(value => `- ${value}`).join("\n") : fallback;
}

function applyTemplate(template: string, variables: Record<string, string>) {
  return Object.entries(variables).reduce((resolvedTemplate, [key, value]) => {
    return resolvedTemplate.replaceAll(`{{${key}}}`, value);
  }, template);
}

function tryParseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isExecutableFile(targetFile: string) {
  try {
    accessSync(targetFile, fsConstants.X_OK);
    return true;
  } catch {
    return false;
  }
}
