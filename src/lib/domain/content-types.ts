import type {
  Alternative,
  Company,
  CompanyIpo,
  ConceptAngle,
  DisruptionConcept,
  DisruptionException,
  IndexDefinition,
  Industry,
  MetricAssessment,
  Product,
  Region,
  Sector,
  SourceCitation,
  TechnologyWave,
} from "~/lib/domain/types";

export const companyInputMetricIds = [
  "moat",
  "decentralizability",
  "profitability",
  "peRatio",
  "marketCap",
] as const;

export type CompanyInputMetricId = (typeof companyInputMetricIds)[number];

export const researchTaskIds = [
  "company-overview",
  "moat-analysis",
  "decentralization-analysis",
  "product-alternatives",
  "implementation-prompts",
  "source-gathering",
  "company-sync",
] as const;

export type ResearchTaskId = (typeof researchTaskIds)[number];
export type RalphProviderId = "claude" | "codex";
export type RalphProviderPreference = RalphProviderId | "auto" | "both";
export type RalphSyncMode = "dry-run" | "publish";
export const syncBatchTargetIds = ["published", "all", "stale"] as const;
export type SyncBatchTargetId = (typeof syncBatchTargetIds)[number];
export type ManifestQueueStatus = "queued";
export type ResearchTargetSource = "canonical" | "queued";
export type UnverifiedCompanyRequestStatus = "pending" | "prepared" | "completed" | "failed";
export type CompanyIntakeAlreadyResearchedMode = "skip" | "refresh";
export type UnverifiedCompanyIssueCode =
  | "already-queued"
  | "already-researched"
  | "ambiguous"
  | "draft-validation-failed"
  | "duplicate-candidate"
  | "duplicate-input"
  | "invalid"
  | "provider-failure";

export interface CompanyManifest {
  schemaVersion: 1;
  slug: string;
  name: string;
  ticker: string;
  regionId: string;
  indexIds: string[];
  sectorId: string;
  industryId: string;
  companiesMarketCapUrl: string;
  description: string;
  technologyWaveIds: string[];
  maybeIpo?: CompanyIpo | null;
  seedProductNames?: string[];
  seedSourceUrls?: string[];
  notes?: string;
}

export interface ManifestQueueEntry {
  schemaVersion: 1;
  status: ManifestQueueStatus;
  createdOn: string;
  batchId?: string;
  groupLabel?: string;
  requestNotes?: string;
  manifest: CompanyManifest;
}

export interface UnverifiedCompanyIssue {
  sourceItem: string;
  code: UnverifiedCompanyIssueCode;
  detail: string;
  maybeCandidateSlug?: string;
}

export interface PreparedCompanyCandidate {
  sourceItem: string;
  slug: string;
  name: string;
  ticker: string;
}

export interface UnverifiedCompanyRequest {
  schemaVersion: 1;
  requestId: string;
  status: UnverifiedCompanyRequestStatus;
  createdOn: string;
  updatedOn: string;
  rawInput: string;
  rawItems: string[];
  batchId: string;
  groupLabel: string;
  alreadyResearchedMode: CompanyIntakeAlreadyResearchedMode;
  requestNotes?: string;
  preparedCandidates: PreparedCompanyCandidate[];
  skippedItems: UnverifiedCompanyIssue[];
  queuedSlugs: string[];
  promotedSlugs: string[];
  completedCompanySlugs: string[];
  lastSummaryJson?: string;
  lastSummaryMarkdown?: string;
  lastLoopRunDirs: string[];
  lastSyncRunDirs: string[];
}

export interface ResearchLoopTarget {
  companySlug: string;
  targetSource: ResearchTargetSource;
  batchId?: string;
  manifest: CompanyManifest;
  queueEntry?: ManifestQueueEntry;
}

export interface RawAlternativeRecord extends Omit<Alternative, "productSlug"> {}

export interface RawDisruptionConceptRecord
  extends Omit<DisruptionConcept, "productSlug" | "sourceIds"> {}

export interface RawProductRecord {
  slug: string;
  name: string;
  category: string;
  homepageUrl: string;
  summary: string;
  whyItMatters: string;
  replacementSketch: string[];
  maybeDisruptionException?: DisruptionException;
  sourceIds: string[];
  technologyWaveIds: string[];
  alternatives: RawAlternativeRecord[];
  disruptionConcepts: RawDisruptionConceptRecord[];
}

export interface RawCompanyRecord extends Omit<Company, "productSlugs" | "metrics"> {
  inputMetrics: Record<CompanyInputMetricId, MetricAssessment>;
}

export interface CompanyBundle {
  schemaVersion: 1;
  company: RawCompanyRecord;
  products: RawProductRecord[];
}

export interface ContentGraph {
  regions: Region[];
  indices: IndexDefinition[];
  sectors: Sector[];
  industries: Industry[];
  technologyWaves: TechnologyWave[];
  conceptAngles: ConceptAngle[];
  companies: Company[];
  products: Product[];
  alternatives: Alternative[];
  disruptionConcepts: DisruptionConcept[];
  sources: SourceCitation[];
}

export interface ImplementationPromptArtifact {
  productSlug: string;
  companySlug: string;
  generatedOn: string;
  markdown: string;
}

export interface LoadedImplementationPromptArtifact extends ImplementationPromptArtifact {
  sourceFile: string;
  issues: string[];
}

export interface ImplementationPromptsPayload {
  schemaVersion: 1;
  companySlug: string;
  prompts: ImplementationPromptArtifact[];
}

export interface ResearchTaskDefinition {
  id: ResearchTaskId;
  label: string;
  templateFile: string;
  outputSuffix: string;
}

export interface ResearchTaskResult {
  taskId: ResearchTaskId;
  provider: RalphProviderId | "local";
  promptFile: string;
  rawOutputFile: string;
  normalizedFile?: string;
  validationFile?: string;
  notesFile?: string;
  exitCode: number;
  success: boolean;
  timedOut?: boolean;
  generatedOn: string;
}

export interface ResearchRunManifest {
  schemaVersion: 1;
  runId: string;
  companySlug: string;
  targetSource?: ResearchTargetSource;
  batchId?: string;
  mode: RalphSyncMode;
  requestedProvider: RalphProviderPreference;
  resolvedProviders: RalphProviderId[];
  taskResults: ResearchTaskResult[];
  generatedOn: string;
  publishedBundleFile?: string;
  publishedSourceIds?: string[];
  commitSha?: string;
}

export interface RalphProviderConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
  timeoutMs?: number;
}

export interface RalphProvidersFile {
  schemaVersion: 1;
  defaultProviderOrder: RalphProviderId[];
  providers: Record<RalphProviderId, RalphProviderConfig>;
}

export interface CompanySyncPayload {
  schemaVersion: 1;
  bundle: CompanyBundle;
  sources: SourceCitation[];
  summaryMarkdown?: string;
}
