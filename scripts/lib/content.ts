import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  type CompanyBundle,
  type CompanyInputMetricId,
  type CompanyManifest,
  type ContentGraph,
  companyInputMetricIds,
  type LoadedImplementationPromptArtifact,
  type ManifestQueueEntry,
  type UnverifiedCompanyRequest,
} from "../../src/lib/domain/content-types";
import { deriveIpoMetrics } from "../../src/lib/domain/ipo";
import { calculateFreedCapitalPotential } from "../../src/lib/domain/scoring";
import type {
  Alternative,
  Company,
  ConceptAngle,
  ConceptMetricId,
  DisruptionConcept,
  IndexDefinition,
  Industry,
  MetricAssessment,
  Product,
  Region,
  Sector,
  SourceCitation,
  TechnologyWave,
} from "../../src/lib/domain/types";
import {
  alternativeKinds,
  alternativeMetricIds,
  conceptMetricIds,
  evidenceKinds,
} from "../../src/lib/domain/types";
import { readImplementationPromptArtifacts } from "./implementation-prompts";

const defaultRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const rootDir = process.env.FTW_ROOT_DIR
  ? path.resolve(process.env.FTW_ROOT_DIR)
  : defaultRootDir;
export const contentDir = process.env.FTW_CONTENT_DIR
  ? path.resolve(process.env.FTW_CONTENT_DIR)
  : path.join(rootDir, "content");
export const taxonomyDir = path.join(contentDir, "taxonomy");
export const manifestsDir = path.join(contentDir, "manifests", "companies");
export const queueManifestsDir = path.join(contentDir, "manifests", "queue");
export const unverifiedManifestsDir = path.join(contentDir, "manifests", "unverified");
export const companiesDir = path.join(contentDir, "companies");
export const implementationPromptsDir = path.join(contentDir, "implementation-prompts");
export const sourcesDir = path.join(contentDir, "sources");
export const generatedGraphFile = path.join(rootDir, "src", "lib", "generated", "content-graph.ts");

export interface LoadedRawContent {
  regions: Region[];
  indices: IndexDefinition[];
  sectors: Sector[];
  industries: Industry[];
  technologyWaves: TechnologyWave[];
  conceptAngles: ConceptAngle[];
  manifests: CompanyManifest[];
  bundles: CompanyBundle[];
  implementationPrompts: LoadedImplementationPromptArtifact[];
  sources: SourceCitation[];
}

export interface CompiledContentResult {
  graph: ContentGraph;
  raw: LoadedRawContent;
}

export class ContentValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Content validation failed with ${issues.length} issue(s).`);
    this.issues = issues;
  }
}

export async function loadRawContent(contentRoot = contentDir): Promise<LoadedRawContent> {
  const taxonomyRoot = path.join(contentRoot, "taxonomy");
  const manifestsRoot = path.join(contentRoot, "manifests", "companies");
  const companiesRoot = path.join(contentRoot, "companies");
  const sourcesRoot = path.join(contentRoot, "sources");

  const [
    regions,
    indices,
    sectors,
    industries,
    technologyWaves,
    conceptAngles,
    manifests,
    sources,
    bundles,
    implementationPromptArtifacts,
  ] = await Promise.all([
    readJsonFile<Region[]>(path.join(taxonomyRoot, "regions.json")),
    readJsonFile<IndexDefinition[]>(path.join(taxonomyRoot, "indices.json")),
    readJsonFile<Sector[]>(path.join(taxonomyRoot, "sectors.json")),
    readJsonFile<Industry[]>(path.join(taxonomyRoot, "industries.json")),
    readJsonFile<TechnologyWave[]>(path.join(taxonomyRoot, "technology-waves.json")),
    readJsonFile<ConceptAngle[]>(path.join(taxonomyRoot, "concept-angles.json")),
    readJsonDirectory<CompanyManifest>(manifestsRoot),
    readJsonDirectory<SourceCitation>(sourcesRoot),
    readCompanyBundles(companiesRoot),
    readImplementationPromptArtifacts(path.join(contentRoot, "implementation-prompts")),
  ]);

  return {
    regions,
    indices,
    sectors,
    industries,
    technologyWaves,
    conceptAngles,
    manifests,
    bundles,
    implementationPrompts: implementationPromptArtifacts,
    sources,
  };
}

export async function loadManifestQueueEntries(
  contentRoot = contentDir,
): Promise<ManifestQueueEntry[]> {
  return readJsonDirectoryIfExists<ManifestQueueEntry>(
    path.join(contentRoot, "manifests", "queue"),
  );
}

export async function loadUnverifiedCompanyRequests(
  contentRoot = contentDir,
): Promise<UnverifiedCompanyRequest[]> {
  return readJsonDirectoryIfExists<UnverifiedCompanyRequest>(
    path.join(contentRoot, "manifests", "unverified"),
  );
}

export async function compileContent(contentRoot = contentDir): Promise<CompiledContentResult> {
  const raw = await loadRawContent(contentRoot);
  const graph = validateAndCompile(raw);
  return { raw, graph };
}

export function validateAndCompile(raw: LoadedRawContent): ContentGraph {
  const issues: string[] = [];

  assertUnique(
    raw.regions.map((region) => region.id),
    "region",
    issues,
  );
  assertUnique(
    raw.indices.map((index) => index.id),
    "index",
    issues,
  );
  assertUnique(
    raw.sectors.map((sector) => sector.id),
    "sector",
    issues,
  );
  assertUnique(
    raw.industries.map((industry) => industry.id),
    "industry",
    issues,
  );
  assertUnique(
    raw.technologyWaves.map((wave) => wave.id),
    "technology wave",
    issues,
  );
  assertUnique(
    raw.conceptAngles.map((conceptAngle) => conceptAngle.id),
    "concept angle",
    issues,
  );
  assertUnique(
    raw.manifests.map((manifest) => manifest.slug),
    "company manifest",
    issues,
  );
  assertUnique(
    raw.sources.map((source) => source.id),
    "source",
    issues,
  );
  assertUnique(
    raw.bundles.map((bundle) => bundle.company.slug),
    "company bundle",
    issues,
  );
  assertUnique(
    raw.implementationPrompts.map((prompt) => prompt.productSlug),
    "implementation prompt",
    issues,
  );

  const regionIds = new Set(raw.regions.map((region) => region.id));
  const indexById = new Map(raw.indices.map((index) => [index.id, index]));
  const sectorIds = new Set(raw.sectors.map((sector) => sector.id));
  const industryById = new Map(raw.industries.map((industry) => [industry.id, industry]));
  const waveIds = new Set(raw.technologyWaves.map((wave) => wave.id));
  const conceptAngleIds = new Set(raw.conceptAngles.map((conceptAngle) => conceptAngle.id));
  const sourceById = new Map(raw.sources.map((source) => [source.id, source]));
  const manifestBySlug = new Map(raw.manifests.map((manifest) => [manifest.slug, manifest]));

  for (const source of raw.sources) {
    validateSourceCitation(source, issues);
  }

  for (const manifest of raw.manifests) {
    validateManifest(
      manifest,
      {
        regionIds,
        indexById,
        sectorIds,
        industryById,
        waveIds,
      },
      issues,
    );
  }

  const companies: Company[] = [];
  const productsWithoutPrompts: Array<Omit<Product, "implementationPrompt">> = [];
  const alternatives: Alternative[] = [];
  const disruptionConcepts: DisruptionConcept[] = [];
  const productSlugSet = new Set<string>();
  const alternativeSlugSet = new Set<string>();
  const disruptionConceptSlugSet = new Set<string>();

  for (const bundle of raw.bundles) {
    if (bundle.schemaVersion !== 1) {
      issues.push(
        `Company bundle ${bundle.company.slug} has unsupported schemaVersion ${String(bundle.schemaVersion)}.`,
      );
    }

    const maybeManifest = manifestBySlug.get(bundle.company.slug);
    if (!maybeManifest) {
      issues.push(`Company bundle ${bundle.company.slug} is missing a matching manifest.`);
    } else {
      validateManifestAlignment(maybeManifest, bundle.company, issues);
    }

    validateCompanyRecord(
      bundle.company,
      {
        regionIds,
        indexById,
        sectorIds,
        industryById,
        waveIds,
        sourceById,
      },
      issues,
    );

    const companyProductSlugs: string[] = [];
    for (const productRecord of bundle.products) {
      validateProductRecord(
        bundle.company.slug,
        productRecord,
        {
          waveIds,
          conceptAngleIds,
          sourceById,
        },
        issues,
      );

      if (productSlugSet.has(productRecord.slug)) {
        issues.push(`Duplicate product slug ${productRecord.slug}.`);
      }
      productSlugSet.add(productRecord.slug);
      companyProductSlugs.push(productRecord.slug);

      const productAlternativeSlugs: string[] = [];
      const productDisruptionConceptSlugs: string[] = [];
      for (const alternativeRecord of productRecord.alternatives) {
        validateAlternativeRecord(productRecord.slug, alternativeRecord, { sourceById }, issues);

        if (alternativeSlugSet.has(alternativeRecord.slug)) {
          issues.push(`Duplicate alternative slug ${alternativeRecord.slug}.`);
        }
        alternativeSlugSet.add(alternativeRecord.slug);
        productAlternativeSlugs.push(alternativeRecord.slug);

        alternatives.push({
          ...alternativeRecord,
          productSlug: productRecord.slug,
        });
      }

      for (const disruptionConceptRecord of productRecord.disruptionConcepts) {
        validateDisruptionConceptRecord(
          productRecord.slug,
          disruptionConceptRecord,
          { conceptAngleIds, sourceById },
          issues,
        );

        if (disruptionConceptSlugSet.has(disruptionConceptRecord.slug)) {
          issues.push(`Duplicate disruption concept slug ${disruptionConceptRecord.slug}.`);
        }
        disruptionConceptSlugSet.add(disruptionConceptRecord.slug);
        productDisruptionConceptSlugs.push(disruptionConceptRecord.slug);

        disruptionConcepts.push({
          ...disruptionConceptRecord,
          productSlug: productRecord.slug,
          sourceIds: uniqueSourceIds(
            disruptionConceptRecord.problemSourceIds,
            disruptionConceptRecord.enablerSourceIds,
            ...Object.values(disruptionConceptRecord.metrics).map((metric) => metric.sourceIds),
          ),
        });
      }

      const {
        alternatives: nestedAlternatives,
        disruptionConcepts: nestedDisruptionConcepts,
        maybeDisruptionException,
        ...productFields
      } = productRecord;
      void nestedAlternatives;
      void nestedDisruptionConcepts;
      productsWithoutPrompts.push({
        ...productFields,
        companySlug: bundle.company.slug,
        alternativeSlugs: productAlternativeSlugs,
        disruptionConceptSlugs: productDisruptionConceptSlugs,
        maybeDisruptionException: maybeDisruptionException ?? null,
      });
    }

    const compiledMetrics = compileCompanyMetrics(bundle.company);
    const { inputMetrics, ...companyFields } = bundle.company;
    void inputMetrics;
    companies.push({
      ...companyFields,
      productSlugs: companyProductSlugs,
      metrics: compiledMetrics,
    });
  }

  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }

  const companyBySlug = new Map(companies.map((company) => [company.slug, company]));
  const productBySlug = new Map(productsWithoutPrompts.map((product) => [product.slug, product]));
  const promptByProductSlug = new Map<
    string,
    {
      markdown: string;
      generatedOn: string;
    }
  >();

  for (const prompt of raw.implementationPrompts) {
    for (const issue of prompt.issues) {
      issues.push(issue);
    }

    const maybeProduct = productBySlug.get(prompt.productSlug);
    if (!maybeProduct) {
      issues.push(
        `Implementation prompt ${prompt.productSlug} does not match any published product.`,
      );
      continue;
    }

    const maybeCompany = companyBySlug.get(maybeProduct.companySlug);
    if (!maybeCompany) {
      issues.push(
        `Implementation prompt ${prompt.productSlug} points to company ${maybeProduct.companySlug}, which is not published.`,
      );
      continue;
    }

    if (prompt.companySlug !== maybeCompany.slug) {
      issues.push(
        `Implementation prompt ${prompt.productSlug} references company ${prompt.companySlug}, but product belongs to ${maybeCompany.slug}.`,
      );
      continue;
    }

    promptByProductSlug.set(prompt.productSlug, {
      markdown: prompt.markdown,
      generatedOn: prompt.generatedOn,
    });
  }

  for (const product of productsWithoutPrompts) {
    if (!promptByProductSlug.has(product.slug)) {
      issues.push(`Product ${product.slug} is missing a canonical implementation prompt.`);
    }
  }

  if (issues.length > 0) {
    throw new ContentValidationError(issues);
  }

  const products: Product[] = productsWithoutPrompts.map((product) => {
    const implementationPrompt = promptByProductSlug.get(product.slug);
    if (!implementationPrompt) {
      throw new Error(`Expected implementation prompt for ${product.slug}.`);
    }

    return {
      ...product,
      implementationPrompt,
    };
  });

  return {
    regions: raw.regions,
    indices: raw.indices,
    sectors: raw.sectors,
    industries: raw.industries,
    technologyWaves: raw.technologyWaves,
    conceptAngles: raw.conceptAngles,
    companies: companies.sort(
      (left, right) => left.rankApprox - right.rankApprox || left.name.localeCompare(right.name),
    ),
    products,
    alternatives,
    disruptionConcepts,
    sources: [...raw.sources].sort((left, right) => left.id.localeCompare(right.id)),
  };
}

export async function writeGeneratedContentGraph(
  graph: ContentGraph,
  outputFile = generatedGraphFile,
) {
  await mkdir(path.dirname(outputFile), { recursive: true });

  const moduleSource = [
    "/* eslint-disable */",
    "// This file is auto-generated by scripts/compile-content.ts. Do not edit by hand.",
    'import type { ContentGraph } from "~/lib/domain/content-types";',
    "",
    `export const contentGraph: ContentGraph = ${JSON.stringify(graph, null, 2)};`,
    "",
    "export const regions = contentGraph.regions;",
    "export const indices = contentGraph.indices;",
    "export const sectors = contentGraph.sectors;",
    "export const industries = contentGraph.industries;",
    "export const technologyWaves = contentGraph.technologyWaves;",
    "export const conceptAngles = contentGraph.conceptAngles;",
    "export const companies = contentGraph.companies;",
    "export const products = contentGraph.products;",
    "export const alternatives = contentGraph.alternatives;",
    "export const disruptionConcepts = contentGraph.disruptionConcepts;",
    "export const sources = contentGraph.sources;",
    "",
  ].join("\n");

  await writeFile(outputFile, moduleSource, "utf8");
}

export async function writeJsonFile(targetFile: string, value: unknown) {
  await mkdir(path.dirname(targetFile), { recursive: true });
  await writeFile(targetFile, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJsonFile<T>(targetFile: string): Promise<T> {
  const rawText = await readFile(targetFile, "utf8");
  return JSON.parse(rawText) as T;
}

async function readJsonDirectory<T>(targetDir: string): Promise<T[]> {
  const entries = (await readdir(targetDir, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((left, right) => left.name.localeCompare(right.name));

  return Promise.all(entries.map((entry) => readJsonFile<T>(path.join(targetDir, entry.name))));
}

async function readJsonDirectoryIfExists<T>(targetDir: string): Promise<T[]> {
  try {
    return await readJsonDirectory<T>(targetDir);
  } catch (error) {
    if (isMissingDirectoryError(error)) {
      return [];
    }
    throw error;
  }
}

async function readCompanyBundles(targetDir: string): Promise<CompanyBundle[]> {
  const entries = (await readdir(targetDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name));

  return Promise.all(
    entries.map((entry) =>
      readJsonFile<CompanyBundle>(path.join(targetDir, entry.name, "bundle.json")),
    ),
  );
}

function validateManifest(
  manifest: CompanyManifest,
  lookup: {
    regionIds: Set<string>;
    indexById: Map<string, IndexDefinition>;
    sectorIds: Set<string>;
    industryById: Map<string, Industry>;
    waveIds: Set<string>;
  },
  issues: string[],
) {
  if (manifest.schemaVersion !== 1) {
    issues.push(
      `Manifest ${manifest.slug} has unsupported schemaVersion ${String(manifest.schemaVersion)}.`,
    );
  }

  if (!lookup.regionIds.has(manifest.regionId)) {
    issues.push(`Manifest ${manifest.slug} references unknown region ${manifest.regionId}.`);
  }

  for (const indexId of manifest.indexIds) {
    if (!lookup.indexById.has(indexId)) {
      issues.push(`Manifest ${manifest.slug} references unknown index ${indexId}.`);
    }
  }

  if (!lookup.sectorIds.has(manifest.sectorId)) {
    issues.push(`Manifest ${manifest.slug} references unknown sector ${manifest.sectorId}.`);
  }

  const maybeIndustry = lookup.industryById.get(manifest.industryId);
  if (!maybeIndustry) {
    issues.push(`Manifest ${manifest.slug} references unknown industry ${manifest.industryId}.`);
  } else if (maybeIndustry.sectorId !== manifest.sectorId) {
    issues.push(
      `Manifest ${manifest.slug} uses industry ${manifest.industryId} outside sector ${manifest.sectorId}.`,
    );
  }

  for (const waveId of manifest.technologyWaveIds) {
    if (!lookup.waveIds.has(waveId)) {
      issues.push(`Manifest ${manifest.slug} references unknown technology wave ${waveId}.`);
    }
  }
}

function validateManifestAlignment(
  manifest: CompanyManifest,
  company: CompanyBundle["company"],
  issues: string[],
) {
  const alignedFields: Array<keyof CompanyManifest & keyof CompanyBundle["company"]> = [
    "slug",
    "name",
    "ticker",
    "regionId",
    "sectorId",
    "industryId",
    "companiesMarketCapUrl",
    "description",
  ];

  for (const field of alignedFields) {
    if (manifest[field] !== company[field]) {
      issues.push(`Bundle ${company.slug} field ${field} does not match manifest ${company.slug}.`);
    }
  }
}

function validateCompanyRecord(
  company: CompanyBundle["company"],
  lookup: {
    regionIds: Set<string>;
    indexById: Map<string, IndexDefinition>;
    sectorIds: Set<string>;
    industryById: Map<string, Industry>;
    waveIds: Set<string>;
    sourceById: Map<string, SourceCitation>;
  },
  issues: string[],
) {
  if (!lookup.regionIds.has(company.regionId)) {
    issues.push(`Company ${company.slug} references unknown region ${company.regionId}.`);
  }

  for (const indexId of company.indexIds) {
    if (!lookup.indexById.has(indexId)) {
      issues.push(`Company ${company.slug} references unknown index ${indexId}.`);
    }
  }

  if (!lookup.sectorIds.has(company.sectorId)) {
    issues.push(`Company ${company.slug} references unknown sector ${company.sectorId}.`);
  }

  const maybeIndustry = lookup.industryById.get(company.industryId);
  if (!maybeIndustry) {
    issues.push(`Company ${company.slug} references unknown industry ${company.industryId}.`);
  } else if (maybeIndustry.sectorId !== company.sectorId) {
    issues.push(
      `Company ${company.slug} uses industry ${company.industryId} outside sector ${company.sectorId}.`,
    );
  }

  for (const waveId of company.technologyWaveIds) {
    if (!lookup.waveIds.has(waveId)) {
      issues.push(`Company ${company.slug} references unknown technology wave ${waveId}.`);
    }
  }

  validateSourceReferences(`Company ${company.slug}`, company.sourceIds, lookup.sourceById, issues);
  validateCompanyInputMetrics(company, lookup.sourceById, issues);
}

function validateCompanyInputMetrics(
  company: CompanyBundle["company"],
  sourceById: Map<string, SourceCitation>,
  issues: string[],
) {
  const metricIds = new Set(Object.keys(company.inputMetrics));

  for (const metricId of companyInputMetricIds) {
    if (!metricIds.has(metricId)) {
      issues.push(`Company ${company.slug} is missing input metric ${metricId}.`);
      continue;
    }

    validateMetricAssessment(
      `Company ${company.slug} metric ${metricId}`,
      company.inputMetrics[metricId],
      sourceById,
      issues,
    );
  }

  for (const metricId of metricIds) {
    if (!companyInputMetricIds.includes(metricId as CompanyInputMetricId)) {
      issues.push(`Company ${company.slug} has unsupported input metric ${metricId}.`);
    }
  }

  if (company.maybeIpo) {
    validateSourceReferences(
      `Company ${company.slug} IPO date`,
      company.maybeIpo.dateSourceIds,
      sourceById,
      issues,
    );
    validateMetricAssessment(
      `Company ${company.slug} IPO market cap`,
      company.maybeIpo.marketCap,
      sourceById,
      issues,
    );
  }
}

function validateProductRecord(
  companySlug: string,
  product: CompanyBundle["products"][number],
  lookup: {
    waveIds: Set<string>;
    conceptAngleIds: Set<string>;
    sourceById: Map<string, SourceCitation>;
  },
  issues: string[],
) {
  validateSourceReferences(`Product ${product.slug}`, product.sourceIds, lookup.sourceById, issues);

  for (const waveId of product.technologyWaveIds) {
    if (!lookup.waveIds.has(waveId)) {
      issues.push(`Product ${product.slug} references unknown technology wave ${waveId}.`);
    }
  }

  if (!product.slug || !product.name) {
    issues.push(`Company ${companySlug} has a product with missing slug or name.`);
  }

  if (product.disruptionConcepts.length === 0 && !product.maybeDisruptionException) {
    issues.push(
      `Product ${product.slug} must define 1-2 disruption concepts or a documented exception.`,
    );
  }

  if (product.disruptionConcepts.length > 2) {
    issues.push(`Product ${product.slug} exceeds the maximum of 2 disruption concepts.`);
  }

  if (product.disruptionConcepts.length > 0 && product.maybeDisruptionException) {
    issues.push(
      `Product ${product.slug} cannot define disruption concepts and a disruption exception together.`,
    );
  }

  if (product.maybeDisruptionException) {
    validateDisruptionException(
      `Product ${product.slug}`,
      product.maybeDisruptionException,
      lookup.sourceById,
      issues,
    );
  }
}

function validateAlternativeRecord(
  productSlug: string,
  alternative: CompanyBundle["products"][number]["alternatives"][number],
  lookup: {
    sourceById: Map<string, SourceCitation>;
  },
  issues: string[],
) {
  if (!alternative.slug || !alternative.name) {
    issues.push(`Product ${productSlug} has an alternative with missing slug or name.`);
  }

  if (!alternativeKinds.includes(alternative.kind)) {
    issues.push(
      `Alternative ${alternative.slug} has unsupported kind ${String(alternative.kind)}.`,
    );
  }

  if ("repoUrl" in alternative && alternative.repoUrl === null) {
    issues.push(`Alternative ${alternative.slug} must omit repoUrl instead of setting it to null.`);
  }

  validateSourceReferences(
    `Alternative ${alternative.slug}`,
    alternative.sourceIds,
    lookup.sourceById,
    issues,
  );
  const metricIds = new Set(Object.keys(alternative.metrics));
  for (const metricId of alternativeMetricIds) {
    if (!metricIds.has(metricId)) {
      issues.push(`Alternative ${alternative.slug} is missing metric ${metricId}.`);
    }
  }
  for (const [metricId, metric] of Object.entries(alternative.metrics)) {
    validateMetricAssessment(
      `Alternative ${alternative.slug} metric ${metricId}`,
      metric,
      lookup.sourceById,
      issues,
    );
  }
}

function validateDisruptionException(
  label: string,
  disruptionException: NonNullable<CompanyBundle["products"][number]["maybeDisruptionException"]>,
  sourceById: Map<string, SourceCitation>,
  issues: string[],
) {
  if (!disruptionException.reason.trim()) {
    issues.push(`${label} disruption exception is missing a reason.`);
  }

  if (!disruptionException.lastReviewedOn) {
    issues.push(`${label} disruption exception is missing lastReviewedOn.`);
  }

  validateSourceReferences(
    `${label} disruption exception`,
    disruptionException.sourceIds,
    sourceById,
    issues,
  );
}

function validateDisruptionConceptRecord(
  productSlug: string,
  disruptionConcept: CompanyBundle["products"][number]["disruptionConcepts"][number],
  lookup: {
    conceptAngleIds: Set<string>;
    sourceById: Map<string, SourceCitation>;
  },
  issues: string[],
) {
  if (!disruptionConcept.slug || !disruptionConcept.name) {
    issues.push(`Product ${productSlug} has a disruption concept with missing slug or name.`);
  }

  if (disruptionConcept.angleIds.length === 0) {
    issues.push(
      `Disruption concept ${disruptionConcept.slug} must reference at least one concept angle.`,
    );
  }

  for (const angleId of disruptionConcept.angleIds) {
    if (!lookup.conceptAngleIds.has(angleId)) {
      issues.push(
        `Disruption concept ${disruptionConcept.slug} references unknown concept angle ${angleId}.`,
      );
    }
  }

  validateSourceReferences(
    `Disruption concept ${disruptionConcept.slug} problem sources`,
    disruptionConcept.problemSourceIds,
    lookup.sourceById,
    issues,
  );
  validateSourceReferences(
    `Disruption concept ${disruptionConcept.slug} enabler sources`,
    disruptionConcept.enablerSourceIds,
    lookup.sourceById,
    issues,
  );

  if (disruptionConcept.problemSourceIds.length === 0) {
    issues.push(
      `Disruption concept ${disruptionConcept.slug} must reference at least one problem source.`,
    );
  }

  if (disruptionConcept.enablerSourceIds.length === 0) {
    issues.push(
      `Disruption concept ${disruptionConcept.slug} must reference at least one enabler source.`,
    );
  }

  const metricIds = new Set(Object.keys(disruptionConcept.metrics));
  for (const metricId of conceptMetricIds) {
    if (!metricIds.has(metricId)) {
      issues.push(`Disruption concept ${disruptionConcept.slug} is missing metric ${metricId}.`);
    }
  }

  for (const [metricId, metric] of Object.entries(disruptionConcept.metrics) as Array<
    [ConceptMetricId, MetricAssessment]
  >) {
    validateMetricAssessment(
      `Disruption concept ${disruptionConcept.slug} metric ${metricId}`,
      metric,
      lookup.sourceById,
      issues,
    );
  }
}

function validateSourceCitation(source: SourceCitation, issues: string[]) {
  if (!evidenceKinds.includes(source.kind)) {
    issues.push(`Source ${source.id} has unsupported kind ${String(source.kind)}.`);
  }
}

function validateMetricAssessment(
  label: string,
  metric: MetricAssessment,
  sourceById: Map<string, SourceCitation>,
  issues: string[],
) {
  if (!Number.isFinite(metric.value)) {
    issues.push(`${label} has a non-finite value.`);
  }

  if (!metric.lastReviewedOn) {
    issues.push(`${label} is missing lastReviewedOn.`);
  }

  if (metric.sourceIds.length === 0) {
    issues.push(`${label} must reference at least one source.`);
  }

  validateSourceReferences(label, metric.sourceIds, sourceById, issues);
}

function validateSourceReferences(
  label: string,
  sourceIds: string[],
  sourceById: Map<string, SourceCitation>,
  issues: string[],
) {
  assertUnique(sourceIds, `${label} source reference`, issues);

  if (sourceById.size === 0) {
    return;
  }

  for (const sourceId of sourceIds) {
    if (!sourceById.has(sourceId)) {
      issues.push(`${label} references unknown source ${sourceId}.`);
    }
  }
}

function compileCompanyMetrics(company: CompanyBundle["company"]) {
  const marketCap = company.inputMetrics.marketCap;

  const freedCapitalPotential = calculateFreedCapitalPotential(
    marketCap.value,
    company.inputMetrics.moat.value,
    company.inputMetrics.decentralizability.value,
    company.inputMetrics.profitability.value,
  );

  return {
    ...company.inputMetrics,
    freedCapitalPotential: {
      value: freedCapitalPotential,
      rationale:
        "Derived from market cap, moat resistance, decentralizability, and profitability. It is a directional estimate of value capture that could come under pressure if open alternatives compound.",
      sourceIds: uniqueSourceIds(
        company.inputMetrics.marketCap.sourceIds,
        company.inputMetrics.decentralizability.sourceIds,
      ),
      confidence: "speculative" as const,
      lastReviewedOn: marketCap.lastReviewedOn,
    },
    ...deriveIpoMetrics(company.maybeIpo, marketCap),
  };
}

function uniqueSourceIds(...sourceIdLists: string[][]) {
  return [...new Set(sourceIdLists.flat())];
}

function assertUnique(values: string[], label: string, issues: string[]) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      issues.push(`Duplicate ${label} id ${value}.`);
      continue;
    }
    seen.add(value);
  }
}

function isMissingDirectoryError(error: unknown) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
