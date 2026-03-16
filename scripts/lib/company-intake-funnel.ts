import { appendFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CompanyIntakeAlreadyResearchedMode,
  CompanyManifest,
  PreparedCompanyCandidate,
  RalphProviderId,
  RalphProviderPreference,
  RalphSyncMode,
  ResearchTaskId,
  UnverifiedCompanyIssue,
  UnverifiedCompanyIssueCode,
  UnverifiedCompanyRequest,
  UnverifiedCompanyRequestStatus,
} from "../../src/lib/domain/content-types";
import { queueManifest } from "./company-intake";
import { createCompanyIntakeRun, writeCompanyIntakeSummary } from "./company-intake-log";
import { createUnverifiedCompanyRequest, parseRawCompanyItems } from "./company-intake-model";
import {
  getUnverifiedRequestFile,
  readUnverifiedCompanyRequest,
  writeUnverifiedCompanyRequest,
} from "./company-intake-store";
import { type CompanyPipelineResult, runCompanyPipeline } from "./company-pipeline";
import {
  contentDir,
  type LoadedRawContent,
  loadManifestQueueEntries,
  loadRawContent,
  rootDir,
  writeJsonFile,
} from "./content";
import {
  executeProvider,
  extractJsonPayload,
  loadProviderConfig,
  renderPrompt,
  resolveProviders,
} from "./ralph";

const companyIntakeCommand = "company:intake";

export interface CompanyIntakeOptions {
  mode: "prepare" | RalphSyncMode;
  rawInput?: string;
  requestId?: string;
  batchId?: string;
  groupLabel?: string;
  alreadyResearchedMode?: CompanyIntakeAlreadyResearchedMode;
  requestNotes?: string;
  providerPreference: RalphProviderPreference;
  concurrencyLimit: number;
  noCommit: boolean;
  loopTaskIds: ResearchTaskId[];
  onProgress?: (message: string) => void;
}

export interface CompanyIntakeResult {
  request: UnverifiedCompanyRequest;
  requestFile: string;
  logDir: string;
  pipelineResult?: CompanyPipelineResult;
  summaryJson: string;
  summaryMarkdown: string;
}

interface ExistingCompanyMatch {
  name: string;
  ticker: string;
  slug: string;
  state: "canonical-unpublished" | "published" | "queued";
}

interface ExistingCompanyLookup {
  byName: Map<string, ExistingCompanyMatch>;
  bySlug: Map<string, ExistingCompanyMatch>;
  byTicker: Map<string, ExistingCompanyMatch>;
}

interface IntakeStageResolutionCandidate {
  sourceItem: string;
  slug: string;
  name: string;
  ticker: string;
}

interface IntakeCandidateStageOutput {
  resolved: IntakeStageResolutionCandidate[];
  issues: UnverifiedCompanyIssue[];
}

interface IntakeManifestDraft {
  sourceItem: string;
  manifest: CompanyManifest;
}

interface IntakeManifestStageOutput {
  drafts: IntakeManifestDraft[];
  issues: UnverifiedCompanyIssue[];
}

interface ProviderStageResult<T> {
  output: T;
  provider: RalphProviderId;
}

interface UpdateRequestOptions {
  status?: UnverifiedCompanyRequestStatus;
  preparedCandidates?: PreparedCompanyCandidate[];
  skippedItems?: UnverifiedCompanyIssue[];
  queuedSlugs?: string[];
  promotedSlugs?: string[];
  completedCompanySlugs?: string[];
  lastLoopRunDirs?: string[];
  lastSyncRunDirs?: string[];
  lastSummaryJson?: string;
  lastSummaryMarkdown?: string;
}

export { createUnverifiedCompanyRequest, parseRawCompanyItems } from "./company-intake-model";
export {
  getUnverifiedRequestFile,
  readUnverifiedCompanyRequest,
  writeUnverifiedCompanyRequest,
} from "./company-intake-store";

export async function runCompanyIntake(
  options: CompanyIntakeOptions,
): Promise<CompanyIntakeResult> {
  const request = await resolveRequest(options);
  const requestFile = getUnverifiedRequestFile(request.requestId);
  const run = await createCompanyIntakeRun({
    command: companyIntakeCommand,
    mode: options.mode,
    requestId: request.requestId,
  });

  await run.addBreadcrumb({
    step: "request",
    status: "info",
    detail: "Loaded intake request",
    data: {
      requestId: request.requestId,
      mode: options.mode,
      status: request.status,
      batchId: request.batchId,
    },
  });

  let currentRequest = request;
  let maybePipelineResult: CompanyPipelineResult | undefined;

  try {
    if (currentRequest.status === "pending" || currentRequest.status === "failed") {
      currentRequest = await prepareUnverifiedRequest(
        currentRequest,
        options,
        run.runDirectory,
        run,
      );
    } else {
      await run.addBreadcrumb({
        step: "prepare",
        status: "skipped",
        detail: `Request already ${currentRequest.status}; skipping prepare stage`,
      });
    }

    if (options.mode !== "prepare") {
      maybePipelineResult = await continuePreparedRequest(
        currentRequest,
        {
          ...options,
          mode: options.mode,
        },
        run.runDirectory,
        run,
      );
      currentRequest = await updateRequest(currentRequest, {
        status: "completed",
        queuedSlugs: currentRequest.queuedSlugs.filter(
          (slug) => !maybePipelineResult?.promotedSlugs.includes(slug),
        ),
        promotedSlugs: dedupe([
          ...currentRequest.promotedSlugs,
          ...(maybePipelineResult?.promotedSlugs ?? []),
        ]),
        completedCompanySlugs: dedupe([
          ...currentRequest.completedCompanySlugs,
          ...(maybePipelineResult?.companySlugs ?? []),
        ]),
        lastLoopRunDirs: maybePipelineResult?.loopRunDirs ?? [],
        lastSyncRunDirs: maybePipelineResult?.syncRuns.map((syncRun) => syncRun.runDir) ?? [],
      });
    }

    const summaryFiles = await persistSummary(currentRequest, options.mode, run.runDirectory);
    currentRequest = await updateRequest(currentRequest, {
      lastSummaryJson: path.relative(rootDir, summaryFiles.jsonPath),
      lastSummaryMarkdown: path.relative(rootDir, summaryFiles.markdownPath),
    });

    return {
      request: currentRequest,
      requestFile,
      logDir: run.runDirectory,
      pipelineResult: maybePipelineResult,
      summaryJson: path.relative(rootDir, summaryFiles.jsonPath),
      summaryMarkdown: path.relative(rootDir, summaryFiles.markdownPath),
    };
  } catch (error) {
    const failedRequest = await updateRequest(currentRequest, {
      status: "failed",
    });
    await run.addBreadcrumb({
      step: "failure",
      status: "failed",
      detail: error instanceof Error ? error.message : String(error),
    });
    const summaryFiles = await persistSummary(failedRequest, options.mode, run.runDirectory);
    await updateRequest(failedRequest, {
      lastSummaryJson: path.relative(rootDir, summaryFiles.jsonPath),
      lastSummaryMarkdown: path.relative(rootDir, summaryFiles.markdownPath),
    });
    throw error;
  }
}

function normalizeOptional(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

async function resolveRequest(options: CompanyIntakeOptions) {
  if (options.requestId) {
    return readUnverifiedCompanyRequest(options.requestId);
  }

  const rawInput = normalizeOptional(options.rawInput);
  if (!rawInput) {
    throw new Error(
      "Usage requires either --request=<id> or fresh raw input via --raw=<text> or --items-file=<path>.",
    );
  }

  const rawItems = parseRawCompanyItems(rawInput);
  if (rawItems.length === 0) {
    throw new Error("Raw intake input did not contain any company items.");
  }

  const request = createUnverifiedCompanyRequest({
    rawInput,
    rawItems,
    batchId: options.batchId,
    groupLabel: options.groupLabel,
    alreadyResearchedMode: options.alreadyResearchedMode,
    requestNotes: options.requestNotes,
  });
  await writeUnverifiedCompanyRequest(request);
  return request;
}

async function prepareUnverifiedRequest(
  request: UnverifiedCompanyRequest,
  options: CompanyIntakeOptions,
  runDirectory: string,
  run: Awaited<ReturnType<typeof createCompanyIntakeRun>>,
) {
  options.onProgress?.(`Preparing intake request ${request.requestId}`);
  await run.addBreadcrumb({
    step: "prepare",
    status: "planned",
    detail: "Resolving raw intake items into queued manifests",
    data: {
      rawItemCount: request.rawItems.length,
      batchId: request.batchId,
    },
  });

  const raw = await loadRawContent(contentDir);
  const queueEntries = await loadManifestQueueEntries(contentDir);
  const existingLookup = buildExistingCompanyLookup(raw, queueEntries);
  const unresolvedItems: string[] = [];
  const directCandidates: PreparedCompanyCandidate[] = [];
  const skippedItems: UnverifiedCompanyIssue[] = [];
  const seenInputs = new Set<string>();

  for (const rawItem of request.rawItems) {
    const normalizedItem = normalizeCompanyText(rawItem);
    if (!normalizedItem) {
      continue;
    }

    if (seenInputs.has(normalizedItem)) {
      skippedItems.push(
        buildIssue(rawItem, "duplicate-input", "Duplicate raw input item in the same request."),
      );
      continue;
    }
    seenInputs.add(normalizedItem);

    const maybeExisting = findExistingCompanyMatch(rawItem, existingLookup);
    if (maybeExisting) {
      handleExistingMatch({
        sourceItem: rawItem,
        match: maybeExisting,
        alreadyResearchedMode: request.alreadyResearchedMode,
        directCandidates,
        skippedItems,
      });
      continue;
    }

    unresolvedItems.push(rawItem);
  }

  if (unresolvedItems.length === 0) {
    const preparedCandidates = dedupePreparedCandidates(directCandidates);
    await run.addBreadcrumb({
      step: "prepare",
      status: preparedCandidates.length > 0 ? "passed" : "failed",
      detail:
        preparedCandidates.length > 0
          ? "All intake items mapped to already-known companies without requiring new manifests"
          : "No unresolved intake items remained after duplicate/existing-company filtering",
      data: {
        skippedCount: skippedItems.length,
        directCompanySlugs: preparedCandidates.map((candidate) => candidate.slug),
      },
    });
    return updateRequest(request, {
      status: preparedCandidates.length > 0 ? "prepared" : "failed",
      skippedItems,
      preparedCandidates,
      queuedSlugs: [],
      lastLoopRunDirs: [],
      lastSyncRunDirs: [],
    });
  }

  let candidateStage: ProviderStageResult<IntakeCandidateStageOutput>;
  try {
    candidateStage = await runProviderStage<IntakeCandidateStageOutput>({
      request,
      stageId: "company-intake-candidates",
      templateFile: "company-intake-candidates.md",
      providerPreference: options.providerPreference,
      runDirectory,
      run,
      variables: {
        requestId: request.requestId,
        rawInput: request.rawInput,
        rawItemsJson: JSON.stringify(unresolvedItems, null, 2),
        batchId: request.batchId,
        groupLabel: request.groupLabel,
        requestNotes: request.requestNotes ?? "",
        canonicalCompaniesJson: JSON.stringify(
          raw.manifests.map((manifest) => ({
            slug: manifest.slug,
            name: manifest.name,
            ticker: manifest.ticker,
          })),
          null,
          2,
        ),
        queuedCompaniesJson: JSON.stringify(
          queueEntries.map((entry) => ({
            slug: entry.manifest.slug,
            name: entry.manifest.name,
            ticker: entry.manifest.ticker,
            batchId: entry.batchId ?? null,
          })),
          null,
          2,
        ),
      },
      validate: validateCandidateStageOutput,
    });
  } catch (error) {
    skippedItems.push(
      ...buildProviderFailureIssues(
        unresolvedItems,
        error instanceof Error ? error.message : String(error),
      ),
    );
    return updateRequest(request, {
      status: "failed",
      skippedItems,
      preparedCandidates: [],
      queuedSlugs: [],
      lastLoopRunDirs: [],
      lastSyncRunDirs: [],
    });
  }

  skippedItems.push(...candidateStage.output.issues);
  const dedupedCandidates = dedupeResolvedCandidates(candidateStage.output.resolved, skippedItems);
  const { draftCandidates, directCandidates: resolvedDirectCandidates } =
    partitionCandidatesAgainstExisting(
      dedupedCandidates,
      existingLookup,
      request.alreadyResearchedMode,
      skippedItems,
    );
  directCandidates.push(...resolvedDirectCandidates);

  if (draftCandidates.length === 0 && directCandidates.length === 0) {
    await run.addBreadcrumb({
      step: "candidate-resolution",
      status: "failed",
      detail: "Provider did not produce any new queueable candidates",
      data: {
        skippedCount: skippedItems.length,
      },
    });
    return updateRequest(request, {
      status: "failed",
      skippedItems,
      preparedCandidates: [],
      queuedSlugs: [],
      lastLoopRunDirs: [],
      lastSyncRunDirs: [],
    });
  }

  let queuedPreparedCandidates: PreparedCompanyCandidate[] = [];
  let queuedSlugs: string[] = [];
  let selectedManifestProvider: RalphProviderId | null = null;

  if (draftCandidates.length > 0) {
    let manifestStage: ProviderStageResult<IntakeManifestStageOutput>;
    try {
      manifestStage = await runProviderStage<IntakeManifestStageOutput>({
        request,
        stageId: "company-intake-manifests",
        templateFile: "company-intake-manifests.md",
        providerPreference: options.providerPreference,
        runDirectory,
        run,
        variables: {
          requestId: request.requestId,
          batchId: request.batchId,
          groupLabel: request.groupLabel,
          requestNotes: request.requestNotes ?? "",
          resolvedCandidatesJson: JSON.stringify(draftCandidates, null, 2),
          taxonomyJson: JSON.stringify(
            {
              regions: raw.regions,
              indices: raw.indices,
              sectors: raw.sectors,
              industries: raw.industries,
              technologyWaves: raw.technologyWaves,
            },
            null,
            2,
          ),
          manifestExamplesJson: JSON.stringify(raw.manifests.slice(0, 3), null, 2),
        },
        validate: validateManifestStageOutput,
      });
      selectedManifestProvider = manifestStage.provider;
    } catch (error) {
      skippedItems.push(
        ...buildProviderFailureIssues(
          draftCandidates.map((candidate) => candidate.sourceItem),
          error instanceof Error ? error.message : String(error),
        ),
      );
      const preparedCandidates = dedupePreparedCandidates(directCandidates);
      return updateRequest(request, {
        status: preparedCandidates.length > 0 ? "prepared" : "failed",
        skippedItems,
        preparedCandidates,
        queuedSlugs: [],
        lastLoopRunDirs: [],
        lastSyncRunDirs: [],
      });
    }

    skippedItems.push(...manifestStage.output.issues);
    const queuedResult = await queueDraftedManifests({
      candidateLookup: draftCandidates,
      drafts: manifestStage.output.drafts,
      request,
      skippedItems,
    });
    queuedPreparedCandidates = queuedResult.preparedCandidates;
    queuedSlugs = queuedResult.queuedSlugs;
  } else {
    await run.addBreadcrumb({
      step: "company-intake-manifests",
      status: "skipped",
      detail: "All resolved candidates already had canonical manifests; skipping manifest drafting",
      data: {
        directCompanySlugs: directCandidates.map((candidate) => candidate.slug),
      },
    });
  }

  const preparedCandidates = dedupePreparedCandidates([
    ...directCandidates,
    ...queuedPreparedCandidates,
  ]);
  const nextStatus: UnverifiedCompanyRequestStatus =
    preparedCandidates.length > 0 ? "prepared" : "failed";

  await run.addBreadcrumb({
    step: "prepare",
    status: nextStatus === "prepared" ? "passed" : "failed",
    detail:
      nextStatus === "prepared"
        ? `Queued ${queuedSlugs.length} manifest(s) from intake request`
        : "Manifest drafting did not yield any queueable manifests",
    data: {
      selectedProvider: {
        candidates: candidateStage.provider,
        manifests: selectedManifestProvider,
      },
      directCompanySlugs: directCandidates.map((candidate) => candidate.slug),
      queuedSlugs,
      skippedCount: skippedItems.length,
    },
  });

  return updateRequest(request, {
    status: nextStatus,
    preparedCandidates,
    skippedItems,
    queuedSlugs,
    lastLoopRunDirs: [],
    lastSyncRunDirs: [],
  });
}

async function continuePreparedRequest(
  request: UnverifiedCompanyRequest,
  options: CompanyIntakeOptions & { mode: RalphSyncMode },
  runDirectory: string,
  run: Awaited<ReturnType<typeof createCompanyIntakeRun>>,
) {
  const pipelineSelectors = buildPipelineSelectors(request);
  if (pipelineSelectors.queuedSlugs.length === 0 && pipelineSelectors.companySlugs.length === 0) {
    throw new Error(`Request ${request.requestId} does not have any prepared companies to run.`);
  }

  await run.addBreadcrumb({
    step: "pipeline",
    status: "planned",
    detail: `Handing request ${request.requestId} off to company:pipeline`,
    data: {
      mode: options.mode,
      queuedSlugs: pipelineSelectors.queuedSlugs,
      companySlugs: pipelineSelectors.companySlugs,
      concurrencyLimit: options.concurrencyLimit,
    },
  });
  options.onProgress?.(
    `Running company pipeline for request ${request.requestId} in ${options.mode}`,
  );

  const pipelineResult = await runCompanyPipeline({
    manifestPaths: [],
    queuedSlugs: pipelineSelectors.queuedSlugs,
    companySlugs: pipelineSelectors.companySlugs,
    batchId: undefined,
    groupLabel: request.groupLabel,
    requestNotes: request.requestNotes,
    providerPreference: options.providerPreference,
    mode: options.mode,
    noCommit: options.noCommit,
    skipLoop: false,
    skipSync: false,
    executeLoop: true,
    concurrencyLimit: options.concurrencyLimit,
    loopTaskIds: options.loopTaskIds,
    onProgress: options.onProgress,
  });

  await run.addBreadcrumb({
    step: "pipeline",
    status: "passed",
    detail: `company:pipeline completed in ${options.mode} mode`,
    data: {
      promotedSlugs: pipelineResult.promotedSlugs,
      companySlugs: pipelineResult.companySlugs,
      loopRunCount: pipelineResult.loopRunDirs.length,
      syncRunCount: pipelineResult.syncRuns.length,
      runDirectory,
    },
  });

  return pipelineResult;
}

async function queueDraftedManifests(options: {
  candidateLookup: PreparedCompanyCandidate[];
  drafts: IntakeManifestDraft[];
  request: UnverifiedCompanyRequest;
  skippedItems: UnverifiedCompanyIssue[];
}) {
  const candidateBySource = new Map(
    options.candidateLookup.map((candidate) => [
      normalizeCompanyText(candidate.sourceItem),
      candidate,
    ]),
  );
  const handledSourceItems = new Set<string>();
  const preparedCandidates: PreparedCompanyCandidate[] = [];
  const queuedSlugs: string[] = [];

  for (const draft of options.drafts) {
    const sourceKey = normalizeCompanyText(draft.sourceItem);
    const maybeCandidate =
      candidateBySource.get(sourceKey) ??
      options.candidateLookup.find(
        (candidate) =>
          candidate.slug === draft.manifest.slug ||
          normalizeTicker(candidate.ticker) === normalizeTicker(draft.manifest.ticker),
      );

    if (!maybeCandidate) {
      options.skippedItems.push(
        buildIssue(
          draft.sourceItem,
          "invalid",
          "Manifest draft did not map back to a resolved candidate.",
          draft.manifest.slug,
        ),
      );
      continue;
    }

    handledSourceItems.add(normalizeCompanyText(maybeCandidate.sourceItem));

    try {
      const queueEntry = await queueManifest({
        manifest: draft.manifest,
        batchId: options.request.batchId,
        groupLabel: options.request.groupLabel,
        requestNotes: options.request.requestNotes,
      });
      queuedSlugs.push(queueEntry.manifest.slug);
      preparedCandidates.push({
        sourceItem: maybeCandidate.sourceItem,
        slug: queueEntry.manifest.slug,
        name: queueEntry.manifest.name,
        ticker: queueEntry.manifest.ticker,
      });
    } catch (error) {
      options.skippedItems.push(
        buildIssue(
          maybeCandidate.sourceItem,
          "draft-validation-failed",
          error instanceof Error ? error.message : String(error),
          draft.manifest.slug,
        ),
      );
    }
  }

  for (const candidate of options.candidateLookup) {
    if (handledSourceItems.has(normalizeCompanyText(candidate.sourceItem))) {
      continue;
    }

    options.skippedItems.push(
      buildIssue(
        candidate.sourceItem,
        "invalid",
        "Manifest drafting did not return a manifest for this resolved candidate.",
        candidate.slug,
      ),
    );
  }

  return {
    preparedCandidates,
    queuedSlugs,
  };
}

function buildPipelineSelectors(request: UnverifiedCompanyRequest) {
  const queuedSlugs = dedupe(request.queuedSlugs);
  const companySlugs = dedupe(
    request.completedCompanySlugs.length > 0
      ? request.completedCompanySlugs
      : request.preparedCandidates
          .map((candidate) => candidate.slug)
          .filter((slug) => !queuedSlugs.includes(slug)),
  );

  return {
    queuedSlugs,
    companySlugs,
  };
}

async function persistSummary(
  request: UnverifiedCompanyRequest,
  mode: "prepare" | RalphSyncMode,
  runDirectory: string,
) {
  return writeCompanyIntakeSummary(
    {
      command: companyIntakeCommand,
      mode,
      requestId: request.requestId,
      status: request.status,
      rawInput: request.rawInput,
      rawItems: request.rawItems,
      batchId: request.batchId,
      groupLabel: request.groupLabel,
      alreadyResearchedMode: request.alreadyResearchedMode,
      requestNotes: request.requestNotes,
      preparedCandidates: request.preparedCandidates,
      skippedItems: request.skippedItems,
      queuedSlugs: request.queuedSlugs,
      promotedSlugs: request.promotedSlugs,
      completedCompanySlugs: request.completedCompanySlugs,
      loopRunDirs: request.lastLoopRunDirs,
      syncRunDirs: request.lastSyncRunDirs,
    },
    { runDirectory },
  );
}

async function updateRequest(request: UnverifiedCompanyRequest, updates: UpdateRequestOptions) {
  const nextRequest: UnverifiedCompanyRequest = {
    ...request,
    ...updates,
    updatedOn: new Date().toISOString(),
  };
  await writeUnverifiedCompanyRequest(nextRequest);
  return nextRequest;
}

function dedupeResolvedCandidates(
  resolved: IntakeStageResolutionCandidate[],
  skippedItems: UnverifiedCompanyIssue[],
) {
  const seenSlugs = new Set<string>();
  const seenNames = new Set<string>();
  const seenTickers = new Set<string>();
  const deduped: PreparedCompanyCandidate[] = [];

  for (const candidate of resolved) {
    const normalizedSlug = slugifyCompanyText(candidate.slug || candidate.name);
    const normalizedName = normalizeCompanyText(candidate.name);
    const normalizedTicker = normalizeTicker(candidate.ticker);

    if (!normalizedSlug || !normalizedName || !normalizedTicker) {
      skippedItems.push(
        buildIssue(
          candidate.sourceItem,
          "invalid",
          "Candidate resolution returned incomplete company fields.",
        ),
      );
      continue;
    }

    if (
      seenSlugs.has(normalizedSlug) ||
      seenNames.has(normalizedName) ||
      seenTickers.has(normalizedTicker)
    ) {
      skippedItems.push(
        buildIssue(
          candidate.sourceItem,
          "duplicate-candidate",
          "Candidate resolution returned a duplicate company.",
          normalizedSlug,
        ),
      );
      continue;
    }

    seenSlugs.add(normalizedSlug);
    seenNames.add(normalizedName);
    seenTickers.add(normalizedTicker);
    deduped.push({
      sourceItem: candidate.sourceItem,
      slug: normalizedSlug,
      name: candidate.name.trim(),
      ticker: normalizedTicker,
    });
  }

  return deduped;
}

function partitionCandidatesAgainstExisting(
  candidates: PreparedCompanyCandidate[],
  existingLookup: ExistingCompanyLookup,
  alreadyResearchedMode: CompanyIntakeAlreadyResearchedMode,
  skippedItems: UnverifiedCompanyIssue[],
) {
  const draftCandidates: PreparedCompanyCandidate[] = [];
  const directCandidates: PreparedCompanyCandidate[] = [];

  for (const candidate of candidates) {
    const maybeExisting = findExistingCompanyMatch(candidate.slug, existingLookup, candidate);
    if (!maybeExisting) {
      draftCandidates.push(candidate);
      continue;
    }

    handleExistingMatch({
      sourceItem: candidate.sourceItem,
      match: maybeExisting,
      alreadyResearchedMode,
      directCandidates,
      skippedItems,
    });
  }

  return {
    draftCandidates,
    directCandidates: dedupePreparedCandidates(directCandidates),
  };
}

async function runProviderStage<T>(options: {
  request: UnverifiedCompanyRequest;
  stageId: string;
  templateFile: string;
  providerPreference: RalphProviderPreference;
  runDirectory: string;
  run: Awaited<ReturnType<typeof createCompanyIntakeRun>>;
  variables: Record<string, string>;
  validate: (value: unknown) => T;
}): Promise<ProviderStageResult<T>> {
  const trace = createStageTraceLogger(options.runDirectory, options.stageId);
  const providerConfig = await loadProviderConfig();
  const providers = resolveProviders(options.providerPreference, providerConfig);
  const prompt = await renderPrompt(options.templateFile, options.variables);
  const promptFile = path.join(options.runDirectory, `${options.stageId}.prompt.md`);

  await writeFile(promptFile, prompt, "utf8");
  await options.run.addBreadcrumb({
    step: options.stageId,
    status: "planned",
    detail: `Prepared ${options.stageId} prompt`,
    data: {
      providers,
      promptFile: path.relative(rootDir, promptFile),
    },
  });

  let lastErrorMessage = "Provider command failed.";

  for (const provider of providers) {
    const rawOutputFile = path.join(options.runDirectory, `${options.stageId}.${provider}.raw.txt`);
    const normalizedFile = path.join(
      options.runDirectory,
      `${options.stageId}.${provider}.normalized.json`,
    );
    const validationFile = path.join(
      options.runDirectory,
      `${options.stageId}.${provider}.validation.json`,
    );

    const execution = await executeProvider(
      provider,
      prompt,
      {
        rootDir,
        companySlug: options.request.requestId,
        taskId: options.stageId,
        runDir: options.runDirectory,
      },
      providerConfig,
      trace,
    );

    await writeFile(rawOutputFile, execution.rawOutput, "utf8");
    if (execution.stderr) {
      await writeFile(
        path.join(options.runDirectory, `${options.stageId}.${provider}.stderr.txt`),
        execution.stderr,
        "utf8",
      );
    }

    if (execution.exitCode !== 0) {
      lastErrorMessage = execution.stderr || "Provider command failed.";
      await writeJsonFile(validationFile, {
        provider,
        exitCode: execution.exitCode,
        timedOut: execution.timedOut,
        validJson: false,
        error: lastErrorMessage,
      });
      await options.run.addBreadcrumb({
        step: options.stageId,
        status: "failed",
        detail: `${provider} exited with code ${execution.exitCode}`,
        data: {
          validationFile: path.relative(rootDir, validationFile),
        },
      });
      continue;
    }

    try {
      const normalizedOutput = options.validate(extractJsonPayload(execution.rawOutput));
      await writeJsonFile(normalizedFile, normalizedOutput);
      await writeJsonFile(validationFile, {
        provider,
        exitCode: execution.exitCode,
        timedOut: execution.timedOut,
        validJson: true,
        validContent: true,
      });
      await options.run.addBreadcrumb({
        step: options.stageId,
        status: "passed",
        detail: `${provider} produced a valid ${options.stageId} payload`,
        data: {
          normalizedFile: path.relative(rootDir, normalizedFile),
        },
      });
      return {
        output: normalizedOutput,
        provider,
      };
    } catch (error) {
      lastErrorMessage = error instanceof Error ? error.message : String(error);
      await writeJsonFile(validationFile, {
        provider,
        exitCode: execution.exitCode,
        timedOut: execution.timedOut,
        validJson: false,
        validContent: false,
        error: lastErrorMessage,
      });
      await options.run.addBreadcrumb({
        step: options.stageId,
        status: "failed",
        detail: `${provider} returned invalid ${options.stageId} content`,
        data: {
          error: lastErrorMessage,
          validationFile: path.relative(rootDir, validationFile),
        },
      });
    }
  }

  throw new Error(
    `No valid ${options.stageId} payload produced for request ${options.request.requestId}. ${lastErrorMessage}`,
  );
}

function buildExistingCompanyLookup(
  raw: LoadedRawContent,
  queueEntries: Awaited<ReturnType<typeof loadManifestQueueEntries>>,
): ExistingCompanyLookup {
  const lookup: ExistingCompanyLookup = {
    byName: new Map(),
    bySlug: new Map(),
    byTicker: new Map(),
  };

  const addEntry = (
    state: ExistingCompanyMatch["state"],
    manifest: Pick<CompanyManifest, "slug" | "name" | "ticker">,
  ) => {
    const entry = {
      name: manifest.name,
      ticker: manifest.ticker,
      slug: manifest.slug,
      state,
    } satisfies ExistingCompanyMatch;
    lookup.bySlug.set(slugifyCompanyText(manifest.slug), entry);
    lookup.bySlug.set(slugifyCompanyText(manifest.name), entry);
    lookup.byName.set(normalizeCompanyText(manifest.name), entry);
    lookup.byTicker.set(normalizeTicker(manifest.ticker), entry);
  };

  const publishedSlugs = new Set(raw.bundles.map((bundle) => bundle.company.slug));
  for (const manifest of raw.manifests) {
    addEntry(publishedSlugs.has(manifest.slug) ? "published" : "canonical-unpublished", manifest);
  }

  for (const queueEntry of queueEntries) {
    addEntry("queued", queueEntry.manifest);
  }

  return lookup;
}

function findExistingCompanyMatch(
  rawItem: string,
  existingLookup: ExistingCompanyLookup,
  maybeCandidate?: PreparedCompanyCandidate,
) {
  const slugValue = maybeCandidate ? maybeCandidate.slug : slugifyCompanyText(rawItem);
  const nameValue = maybeCandidate ? maybeCandidate.name : rawItem;
  const tickerValue = maybeCandidate?.ticker ?? rawItem;

  return (
    existingLookup.byTicker.get(normalizeTicker(tickerValue)) ??
    existingLookup.bySlug.get(slugValue) ??
    existingLookup.byName.get(normalizeCompanyText(nameValue)) ??
    existingLookup.byName.get(normalizeCompanyText(rawItem))
  );
}

function validateCandidateStageOutput(value: unknown): IntakeCandidateStageOutput {
  const parsed = asObject(value, "Candidate stage output");
  const resolved = asArray(parsed.resolved, "Candidate stage resolved");
  const issues =
    parsed.issues === undefined ? [] : asArray(parsed.issues, "Candidate stage issues");

  return {
    resolved: resolved.map((entry, index) => {
      const candidate = asObject(entry, `Candidate stage resolved[${index}]`);
      return {
        sourceItem: asString(candidate.sourceItem, `Candidate stage resolved[${index}].sourceItem`),
        slug: asString(candidate.slug, `Candidate stage resolved[${index}].slug`),
        name: asString(candidate.name, `Candidate stage resolved[${index}].name`),
        ticker: asString(candidate.ticker, `Candidate stage resolved[${index}].ticker`),
      };
    }),
    issues: issues.map((entry, index) =>
      validateIssue(entry, `Candidate stage issues[${index}]`, ["ambiguous", "invalid"]),
    ),
  };
}

function validateManifestStageOutput(value: unknown): IntakeManifestStageOutput {
  const parsed = asObject(value, "Manifest stage output");
  const drafts = asArray(parsed.drafts, "Manifest stage drafts");
  const issues = parsed.issues === undefined ? [] : asArray(parsed.issues, "Manifest stage issues");

  return {
    drafts: drafts.map((entry, index) => {
      const draft = asObject(entry, `Manifest stage drafts[${index}]`);
      const manifest = asObject(draft.manifest, `Manifest stage drafts[${index}].manifest`);
      return {
        sourceItem: asString(draft.sourceItem, `Manifest stage drafts[${index}].sourceItem`),
        manifest: validateCompanyManifestShape(
          manifest,
          `Manifest stage drafts[${index}].manifest`,
        ),
      };
    }),
    issues: issues.map((entry, index) =>
      validateIssue(entry, `Manifest stage issues[${index}]`, ["ambiguous", "invalid"]),
    ),
  };
}

function validateIssue(
  value: unknown,
  label: string,
  supportedCodes: UnverifiedCompanyIssueCode[],
): UnverifiedCompanyIssue {
  const issue = asObject(value, label);
  const code = asString(issue.code, `${label}.code`) as UnverifiedCompanyIssueCode;
  if (!supportedCodes.includes(code)) {
    throw new Error(`${label}.code must be one of ${supportedCodes.join(", ")}.`);
  }

  return {
    sourceItem: asString(issue.sourceItem, `${label}.sourceItem`),
    code,
    detail: asString(issue.detail, `${label}.detail`),
    maybeCandidateSlug:
      issue.maybeCandidateSlug === undefined
        ? undefined
        : asString(issue.maybeCandidateSlug, `${label}.maybeCandidateSlug`),
  };
}

function validateCompanyManifestShape(
  manifest: Record<string, unknown>,
  label: string,
): CompanyManifest {
  const schemaVersion = asNumber(manifest.schemaVersion, `${label}.schemaVersion`);
  if (schemaVersion !== 1) {
    throw new Error(`${label}.schemaVersion must be 1.`);
  }

  return {
    schemaVersion,
    slug: asString(manifest.slug, `${label}.slug`),
    name: asString(manifest.name, `${label}.name`),
    ticker: asString(manifest.ticker, `${label}.ticker`),
    regionId: asString(manifest.regionId, `${label}.regionId`),
    indexIds: asStringArray(manifest.indexIds, `${label}.indexIds`),
    sectorId: asString(manifest.sectorId, `${label}.sectorId`),
    industryId: asString(manifest.industryId, `${label}.industryId`),
    companiesMarketCapUrl: asString(
      manifest.companiesMarketCapUrl,
      `${label}.companiesMarketCapUrl`,
    ),
    description: asString(manifest.description, `${label}.description`),
    technologyWaveIds: asStringArray(manifest.technologyWaveIds, `${label}.technologyWaveIds`),
    maybeIpo:
      manifest.maybeIpo === undefined
        ? undefined
        : (manifest.maybeIpo as CompanyManifest["maybeIpo"]),
    seedProductNames:
      manifest.seedProductNames === undefined
        ? undefined
        : asStringArray(manifest.seedProductNames, `${label}.seedProductNames`),
    seedSourceUrls:
      manifest.seedSourceUrls === undefined
        ? undefined
        : asStringArray(manifest.seedSourceUrls, `${label}.seedSourceUrls`),
    notes: manifest.notes === undefined ? undefined : asString(manifest.notes, `${label}.notes`),
  };
}

function buildIssue(
  sourceItem: string,
  code: UnverifiedCompanyIssueCode,
  detail: string,
  maybeCandidateSlug?: string,
): UnverifiedCompanyIssue {
  return {
    sourceItem,
    code,
    detail,
    maybeCandidateSlug,
  };
}

function handleExistingMatch(options: {
  sourceItem: string;
  match: ExistingCompanyMatch;
  alreadyResearchedMode: CompanyIntakeAlreadyResearchedMode;
  directCandidates: PreparedCompanyCandidate[];
  skippedItems: UnverifiedCompanyIssue[];
}) {
  if (options.match.state === "queued") {
    options.skippedItems.push(
      buildIssue(
        options.sourceItem,
        "already-queued",
        `${options.match.name} is already queued as ${options.match.slug}.`,
        options.match.slug,
      ),
    );
    return;
  }

  if (options.match.state === "published" && options.alreadyResearchedMode === "skip") {
    options.skippedItems.push(
      buildIssue(
        options.sourceItem,
        "already-researched",
        `${options.match.name} already has published research as ${options.match.slug}.`,
        options.match.slug,
      ),
    );
    return;
  }

  options.directCandidates.push({
    sourceItem: options.sourceItem,
    slug: options.match.slug,
    name: options.match.name,
    ticker: options.match.ticker,
  });
}

function dedupePreparedCandidates(candidates: PreparedCompanyCandidate[]) {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    if (seen.has(candidate.slug)) {
      return false;
    }
    seen.add(candidate.slug);
    return true;
  });
}

function buildProviderFailureIssues(sourceItems: string[], detail: string) {
  return sourceItems.map((sourceItem) => buildIssue(sourceItem, "provider-failure", detail));
}

function asObject(value: unknown, label: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function asArray(value: unknown, label: string) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array.`);
  }

  return value;
}

function asString(value: unknown, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value.trim();
}

function asNumber(value: unknown, label: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${label} must be a number.`);
  }

  return value;
}

function asStringArray(value: unknown, label: string) {
  const entries = asArray(value, label);
  return entries.map((entry, index) => asString(entry, `${label}[${index}]`));
}

function normalizeCompanyText(value: string) {
  return value
    .toLowerCase()
    .replaceAll("&", " and ")
    .replaceAll(/[^a-z0-9]+/g, " ")
    .trim()
    .replaceAll(/\s+/g, " ");
}

function slugifyCompanyText(value: string) {
  return normalizeCompanyText(value).replaceAll(" ", "-");
}

function normalizeTicker(value: string) {
  return value.toUpperCase().replaceAll(/[^A-Z0-9]+/g, "");
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function createStageTraceLogger(runDirectory: string, scope: string) {
  const traceFile = path.join(runDirectory, "trace.log");
  return async (event: string, details: Record<string, unknown> = {}) => {
    const payload = {
      ts: new Date().toISOString(),
      scope,
      event,
      details,
    };
    await appendFile(traceFile, `${JSON.stringify(payload)}\n`, "utf8");
  };
}
