import { alternatives, products } from "~/lib/content/products";
import { companies } from "~/lib/content/companies";
import { industries, indices, regions, sectors } from "~/lib/content/sectors";
import { sources } from "~/lib/content/sources";
import { technologyWaves } from "~/lib/content/technology-waves";

export function getCompanyBySlug(companySlug: string) {
  return companies.find(company => company.slug === companySlug);
}

export function getProductBySlug(productSlug: string) {
  return products.find(product => product.slug === productSlug);
}

export function getProductsForCompany(companySlug: string) {
  return products.filter(product => product.companySlug === companySlug);
}

export function getAlternativesForProduct(productSlug: string) {
  return alternatives.filter(alternative => alternative.productSlug === productSlug);
}

export function getSourcesByIds(sourceIds: string[]) {
  return sourceIds
    .map(sourceId => sources.find(source => source.id === sourceId))
    .filter((source): source is (typeof sources)[number] => Boolean(source));
}

export function getTechnologyWavesByIds(waveIds: string[]) {
  return waveIds
    .map(waveId => technologyWaves.find(wave => wave.id === waveId))
    .filter((wave): wave is (typeof technologyWaves)[number] => Boolean(wave));
}

export function getSectorLabel(sectorId: string) {
  return sectors.find(sector => sector.id === sectorId)?.label ?? sectorId;
}

export function getIndustryLabel(industryId: string) {
  return industries.find(industry => industry.id === industryId)?.label ?? industryId;
}

export function getRegionLabel(regionId: string) {
  return regions.find(region => region.id === regionId)?.label ?? regionId;
}

export function getIndexLabels(indexIds: string[]) {
  return indexIds
    .map(indexId => indices.find(index => index.id === indexId)?.label)
    .filter((label): label is string => Boolean(label));
}
