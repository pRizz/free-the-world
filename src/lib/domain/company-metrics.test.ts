import { expect, test } from "bun:test";
import { sortCompaniesByMetric } from "~/lib/domain/company-metrics";
import type { Company, CompanyMetricId, MetricAssessment } from "~/lib/domain/types";

function makeAssessment(value: number): MetricAssessment {
  return {
    value,
    rationale: "test",
    sourceIds: ["test-source"],
    confidence: "high",
    lastReviewedOn: "2026-03-14",
  };
}

function makeCompany(
  slug: string,
  metrics: Partial<Record<CompanyMetricId, MetricAssessment>>,
): Company {
  return {
    slug,
    name: slug,
    ticker: slug.toUpperCase(),
    rankApprox: 1,
    snapshotNote: "test",
    maybeIpo: null,
    regionId: "us",
    indexIds: [],
    sectorId: "test-sector",
    industryId: "test-industry",
    companiesMarketCapUrl: "https://example.com",
    description: "test",
    overview: [],
    moatNarrative: [],
    decentralizationNarrative: [],
    productSlugs: [],
    sourceIds: [],
    technologyWaveIds: [],
    metrics,
  };
}

test("sortCompaniesByMetric keeps missing values at the bottom when sorting descending", () => {
  // Arrange
  const companies = [
    makeCompany("missing", {}),
    makeCompany("low", { ipoAnnualizedGrowthRate: makeAssessment(0.1) }),
    makeCompany("high", { ipoAnnualizedGrowthRate: makeAssessment(0.3) }),
  ];

  // Act
  const sortedCompanies = sortCompaniesByMetric(companies, "ipoAnnualizedGrowthRate", "desc");

  // Assert
  expect(sortedCompanies.map((company) => company.slug)).toEqual(["high", "low", "missing"]);
});

test("sortCompaniesByMetric keeps missing values at the bottom when sorting ascending", () => {
  // Arrange
  const companies = [
    makeCompany("missing", {}),
    makeCompany("high", { ipoAnnualizedGrowthRate: makeAssessment(0.3) }),
    makeCompany("low", { ipoAnnualizedGrowthRate: makeAssessment(0.1) }),
  ];

  // Act
  const sortedCompanies = sortCompaniesByMetric(companies, "ipoAnnualizedGrowthRate", "asc");

  // Assert
  expect(sortedCompanies.map((company) => company.slug)).toEqual(["low", "high", "missing"]);
});
