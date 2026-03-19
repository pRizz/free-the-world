import { expect, test } from "bun:test";
import {
  calculateAlternativePressureScore,
  calculateResidualMarketCap,
  getAlternativeMetricAverages,
  getAlternativePressureDataset,
  getCapitalAtRiskDataset,
  getPostBubbleDataset,
} from "~/lib/domain/insights";
import type {
  Alternative,
  AlternativeMetricId,
  Company,
  CompanyMetricId,
  MetricAssessment,
  Product,
} from "~/lib/domain/types";

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
  overrides: Partial<Company> = {},
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
    ...overrides,
  };
}

function makeProduct(
  slug: string,
  companySlug: string,
  overrides: Partial<Product> = {},
): Product {
  return {
    slug,
    companySlug,
    name: slug,
    category: "test-category",
    homepageUrl: "https://example.com",
    summary: "test",
    whyItMatters: "test",
    replacementSketch: [],
    alternativeSlugs: [],
    sourceIds: [],
    technologyWaveIds: [],
    ...overrides,
  };
}

function makeAlternativeMetricRecord(
  openness: number,
  decentralizationFit: number,
  readiness: number,
  costLeverage: number,
): Record<AlternativeMetricId, MetricAssessment> {
  return {
    openness: makeAssessment(openness),
    decentralizationFit: makeAssessment(decentralizationFit),
    readiness: makeAssessment(readiness),
    costLeverage: makeAssessment(costLeverage),
  };
}

function makeAlternative(
  slug: string,
  productSlug: string,
  metrics = makeAlternativeMetricRecord(8, 7, 6, 5),
): Alternative {
  return {
    slug,
    productSlug,
    name: slug,
    kind: "open-source",
    homepageUrl: "https://example.com",
    summary: "test",
    metrics,
    sourceIds: [],
  };
}

test("calculateResidualMarketCap never drops below zero", () => {
  // Arrange
  const currentMarketCap = 100;
  const freedCapitalPotential = 140;

  // Act
  const residualMarketCap = calculateResidualMarketCap(currentMarketCap, freedCapitalPotential);

  // Assert
  expect(residualMarketCap).toBe(0);
});

test("getPostBubbleDataset excludes companies without IPO metrics and sorts by current cap", () => {
  // Arrange
  const companies = [
    makeCompany("excluded", {
      marketCap: makeAssessment(150),
      freedCapitalPotential: makeAssessment(30),
    }),
    makeCompany("smaller", {
      marketCap: makeAssessment(200),
      freedCapitalPotential: makeAssessment(40),
      ipoMarketCap: makeAssessment(50),
      ipoReturnMultiplier: makeAssessment(4),
      ipoAnnualizedGrowthRate: makeAssessment(0.12),
    }),
    makeCompany("larger", {
      marketCap: makeAssessment(500),
      freedCapitalPotential: makeAssessment(100),
      ipoMarketCap: makeAssessment(80),
      ipoReturnMultiplier: makeAssessment(6.25),
      ipoAnnualizedGrowthRate: makeAssessment(0.18),
    }),
  ];

  // Act
  const dataset = getPostBubbleDataset(companies);

  // Assert
  expect(dataset.rows.map((row) => row.company.slug)).toEqual(["larger", "smaller"]);
  expect(dataset.excludedCompanies.map((company) => company.slug)).toEqual(["excluded"]);
  expect(dataset.totalCurrentMarketCap).toBe(700);
  expect(dataset.totalFreedCapitalPotential).toBe(140);
  expect(dataset.totalResidualMarketCap).toBe(560);
  expect(dataset.averageIpoReturnMultiplier).toBeCloseTo(5.125, 5);
});

test("getCapitalAtRiskDataset ranks companies by freed-capital potential", () => {
  // Arrange
  const companies = [
    makeCompany("moderate", {
      moat: makeAssessment(6),
      decentralizability: makeAssessment(7),
      profitability: makeAssessment(6),
      peRatio: makeAssessment(20),
      marketCap: makeAssessment(200),
      freedCapitalPotential: makeAssessment(80),
    }),
    makeCompany("largest", {
      moat: makeAssessment(8),
      decentralizability: makeAssessment(6),
      profitability: makeAssessment(7),
      peRatio: makeAssessment(30),
      marketCap: makeAssessment(400),
      freedCapitalPotential: makeAssessment(120),
    }),
  ];

  // Act
  const dataset = getCapitalAtRiskDataset(companies);

  // Assert
  expect(dataset.points.map((point) => point.company.slug)).toEqual(["largest", "moderate"]);
  expect(dataset.points[0]?.capitalAtRiskShare).toBeCloseTo(0.3, 5);
  expect(dataset.totalCurrentMarketCap).toBe(600);
  expect(dataset.totalFreedCapitalPotential).toBe(200);
});

test("getAlternativeMetricAverages returns null for an empty alternative set", () => {
  // Arrange
  const alternatives: Alternative[] = [];

  // Act
  const averages = getAlternativeMetricAverages(alternatives);

  // Assert
  expect(averages).toBeNull();
});

test("getAlternativePressureDataset ranks documented products ahead of undocumented ones", () => {
  // Arrange
  const companies = [
    makeCompany("alpha", {}),
    makeCompany("beta", {}),
  ];
  const products = [
    makeProduct("alpha-doc", "alpha", { name: "Documented product" }),
    makeProduct("alpha-undoc", "alpha", { name: "Undocumented product" }),
    makeProduct("beta-doc", "beta", { name: "Runner-up product" }),
  ];
  const alternatives = [
    makeAlternative(
      "alpha-alt-1",
      "alpha-doc",
      makeAlternativeMetricRecord(9, 8, 8.5, 8),
    ),
    makeAlternative(
      "alpha-alt-2",
      "alpha-doc",
      makeAlternativeMetricRecord(8.5, 8, 8, 8.5),
    ),
    makeAlternative(
      "beta-alt-1",
      "beta-doc",
      makeAlternativeMetricRecord(7, 7, 6.5, 6),
    ),
  ];

  // Act
  const dataset = getAlternativePressureDataset(companies, products, alternatives);

  // Assert
  expect(dataset.productRows.map((row) => row.product.slug)).toEqual([
    "alpha-doc",
    "beta-doc",
    "alpha-undoc",
  ]);
  expect(dataset.companyRows.map((row) => row.company.slug)).toEqual(["alpha", "beta"]);
  expect(dataset.documentedProductCount).toBe(2);
  expect(dataset.undocumentedProductCount).toBe(1);
  expect(dataset.totalAlternativeCount).toBe(3);
  expect(dataset.companyRows[0]?.highestPressureProduct?.product.slug).toBe("alpha-doc");
});

test("calculateAlternativePressureScore emphasizes readiness and cost leverage", () => {
  // Arrange
  const score = calculateAlternativePressureScore({
    openness: 10,
    decentralizationFit: 10,
    readiness: 4,
    costLeverage: 4,
  });

  // Act
  const strongerExecutionScore = calculateAlternativePressureScore({
    openness: 8,
    decentralizationFit: 8,
    readiness: 9,
    costLeverage: 9,
  });

  // Assert
  expect(score).toBeLessThan(strongerExecutionScore);
});
