import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { companies as legacyCompanies } from "../src/lib/content/companies";
import { alternatives as legacyAlternatives, products as legacyProducts } from "../src/lib/content/products";
import { industries, indices, regions, sectors } from "../src/lib/content/sectors";
import { sources as legacySources } from "../src/lib/content/sources";
import { technologyWaves } from "../src/lib/content/technology-waves";
import type { Alternative, Company, Product, SourceCitation } from "../src/lib/domain/types";
import {
  companyInputMetricIds,
  type CompanyBundle,
  type CompanyInputMetricId,
  type CompanyManifest,
} from "../src/lib/domain/content-types";
import { companiesDir, contentDir, manifestsDir, sourcesDir, taxonomyDir, writeJsonFile } from "./lib/content";

await rm(contentDir, { recursive: true, force: true });
await mkdir(taxonomyDir, { recursive: true });
await mkdir(manifestsDir, { recursive: true });
await mkdir(companiesDir, { recursive: true });
await mkdir(sourcesDir, { recursive: true });

await Promise.all([
  writeJsonFile(path.join(taxonomyDir, "regions.json"), regions),
  writeJsonFile(path.join(taxonomyDir, "indices.json"), indices),
  writeJsonFile(path.join(taxonomyDir, "sectors.json"), sectors),
  writeJsonFile(path.join(taxonomyDir, "industries.json"), industries),
  writeJsonFile(path.join(taxonomyDir, "technology-waves.json"), technologyWaves),
]);

const sourceById = new Map(legacySources.map(source => [source.id, source]));
for (const source of legacySources) {
  await writeJsonFile(path.join(sourcesDir, `${source.id}.json`), source);
}

for (const company of legacyCompanies) {
  const manifest = buildManifest(company, sourceById);
  const bundle = buildBundle(company, legacyProducts, legacyAlternatives);

  await writeJsonFile(path.join(manifestsDir, `${company.slug}.json`), manifest);
  await writeJsonFile(path.join(companiesDir, company.slug, "bundle.json"), bundle);
}

console.log(`Migrated ${legacyCompanies.length} companies into ${contentDir}`);

function buildManifest(company: Company, sourceById: Map<string, SourceCitation>): CompanyManifest {
  return {
    schemaVersion: 1,
    slug: company.slug,
    name: company.name,
    ticker: company.ticker,
    regionId: company.regionId,
    indexIds: company.indexIds,
    sectorId: company.sectorId,
    industryId: company.industryId,
    companiesMarketCapUrl: company.companiesMarketCapUrl,
    description: company.description,
    technologyWaveIds: company.technologyWaveIds,
    maybeIpo: company.maybeIpo,
    seedProductNames: legacyProducts.filter(product => product.companySlug === company.slug).map(product => product.name),
    seedSourceUrls: company.sourceIds.map(sourceId => sourceById.get(sourceId)?.url).filter((url): url is string => Boolean(url)),
    notes: "Migrated from the legacy TypeScript content snapshot.",
  };
}

function buildBundle(company: Company, products: Product[], alternatives: Alternative[]): CompanyBundle {
  const companyProducts = products
    .filter(product => product.companySlug === company.slug)
    .map(product => {
      const productAlternatives = alternatives
        .filter(alternative => alternative.productSlug === product.slug)
        .map(alternative => {
          const { productSlug: _productSlug, ...alternativeFields } = alternative;
          return alternativeFields;
        });

      const { companySlug: _companySlug, alternativeSlugs: _alternativeSlugs, ...productFields } = product;
      return {
        ...productFields,
        alternatives: productAlternatives,
      };
    });

  const inputMetrics = Object.fromEntries(
    companyInputMetricIds.map(metricId => [metricId, company.metrics[metricId]])
  ) as Record<CompanyInputMetricId, NonNullable<Company["metrics"][CompanyInputMetricId]>>;
  const { productSlugs: _productSlugs, metrics: _metrics, baseMetrics: _baseMetrics, ...companyFields } = company as Company & {
    baseMetrics?: unknown;
  };
  void _baseMetrics;

  return {
    schemaVersion: 1,
    company: {
      ...companyFields,
      inputMetrics,
    },
    products: companyProducts,
  };
}
