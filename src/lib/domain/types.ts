export const companyMetricIds = [
  "moat",
  "decentralizability",
  "profitability",
  "peRatio",
  "marketCap",
  "ipoMarketCap",
  "ipoReturnMultiplier",
  "ipoAnnualizedGrowthRate",
  "freedCapitalPotential",
] as const;

export type CompanyMetricId = (typeof companyMetricIds)[number];

export const alternativeMetricIds = [
  "openness",
  "decentralizationFit",
  "readiness",
  "costLeverage",
] as const;

export type AlternativeMetricId = (typeof alternativeMetricIds)[number];

export type MetricValueType = "score" | "currency" | "ratio" | "percentage";
export const evidenceKinds = [
  "investor-relations",
  "annual-report",
  "product-page",
  "market-data",
  "regulatory-filing",
  "open-source-project",
  "technical-docs",
  "analysis",
] as const;

export type EvidenceKind = (typeof evidenceKinds)[number];
export type ConfidenceLevel = "high" | "medium" | "speculative";
export const alternativeKinds = [
  "open-source",
  "decentralized",
  "cooperative",
  "protocol",
  "hybrid",
] as const;
export type AlternativeKind = (typeof alternativeKinds)[number];

export interface NarrativeSection {
  title: string;
  paragraphs: string[];
}

export interface SourceCitation {
  id: string;
  title: string;
  url: string;
  kind: EvidenceKind;
  publisher: string;
  note: string;
  accessedOn: string;
}

export interface MetricAssessment {
  value: number;
  rationale: string;
  sourceIds: string[];
  confidence: ConfidenceLevel;
  lastReviewedOn: string;
}

export interface CompanyIpo {
  date: string;
  dateSourceIds: string[];
  marketCap: MetricAssessment;
}

export interface MetricDefinition<TMetricId extends string> {
  id: TMetricId;
  label: string;
  shortLabel: string;
  description: string;
  valueType: MetricValueType;
  precision?: number;
  lowerIsBetter?: boolean;
  defaultVisible: boolean;
  category: "scores" | "finance" | "derived" | "alternatives";
}

export interface Region {
  id: string;
  label: string;
}

export interface IndexDefinition {
  id: string;
  label: string;
  regionId: string;
  description: string;
}

export interface Sector {
  id: string;
  label: string;
}

export interface Industry {
  id: string;
  sectorId: string;
  label: string;
}

export interface TechnologyWave {
  id: string;
  label: string;
  summary: string;
  implications: string[];
}

export interface Company {
  slug: string;
  name: string;
  ticker: string;
  rankApprox: number;
  snapshotNote: string;
  maybeIpo: CompanyIpo | null;
  regionId: string;
  indexIds: string[];
  sectorId: string;
  industryId: string;
  companiesMarketCapUrl: string;
  description: string;
  overview: NarrativeSection[];
  moatNarrative: string[];
  decentralizationNarrative: string[];
  productSlugs: string[];
  sourceIds: string[];
  technologyWaveIds: string[];
  metrics: Partial<Record<CompanyMetricId, MetricAssessment>>;
}

export interface Product {
  slug: string;
  companySlug: string;
  name: string;
  category: string;
  homepageUrl: string;
  summary: string;
  whyItMatters: string;
  replacementSketch: string[];
  alternativeSlugs: string[];
  sourceIds: string[];
  technologyWaveIds: string[];
}

export interface Alternative {
  slug: string;
  productSlug: string;
  name: string;
  kind: AlternativeKind;
  homepageUrl?: string;
  repoUrl?: string;
  summary: string;
  metrics: Record<AlternativeMetricId, MetricAssessment>;
  sourceIds: string[];
}

export interface PromptTaskDefinition {
  id: string;
  label: string;
  templateFile: string;
  outputSuffix: string;
}
