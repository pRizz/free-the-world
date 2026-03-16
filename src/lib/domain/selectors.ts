import {
  alternatives,
  companies,
  indices,
  industries,
  products,
  regions,
  sectors,
  sources,
  technologyWaves,
} from "~/lib/content-graph";

export function getCompanyBySlug(companySlug: string) {
  return companies.find((company) => company.slug === companySlug);
}

export function getProductBySlug(productSlug: string) {
  return products.find((product) => product.slug === productSlug);
}

export function getProductsForCompany(companySlug: string) {
  return products.filter((product) => product.companySlug === companySlug);
}

export function getAlternativesForProduct(productSlug: string) {
  return alternatives.filter((alternative) => alternative.productSlug === productSlug);
}

export function getSourcesByIds(sourceIds: string[]) {
  return sourceIds.map((sourceId) => {
    const maybeSource = sources.find((source) => source.id === sourceId);
    if (!maybeSource) {
      throw new Error(`Unknown source id: ${sourceId}`);
    }
    return maybeSource;
  });
}

export function getTechnologyWavesByIds(waveIds: string[]) {
  return waveIds.map((waveId) => {
    const maybeWave = technologyWaves.find((wave) => wave.id === waveId);
    if (!maybeWave) {
      throw new Error(`Unknown technology wave id: ${waveId}`);
    }
    return maybeWave;
  });
}

export function getSectorLabel(sectorId: string) {
  return sectors.find((sector) => sector.id === sectorId)?.label ?? sectorId;
}

export function getIndustryLabel(industryId: string) {
  return industries.find((industry) => industry.id === industryId)?.label ?? industryId;
}

export function getRegionLabel(regionId: string) {
  return regions.find((region) => region.id === regionId)?.label ?? regionId;
}

export function getIndexLabels(indexIds: string[]) {
  return indexIds
    .map((indexId) => indices.find((index) => index.id === indexId)?.label)
    .filter((label): label is string => Boolean(label));
}
