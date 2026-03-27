import { expect, test } from "bun:test";
import {
  calculateAlternativePressureScore,
  calculateDisruptionConceptScore,
  calculateResidualMarketCap,
  getAlternativeMetricAverages,
  getAlternativePressureDataset,
  getCapitalAtRiskDataset,
  getDisruptionConceptDataset,
  getDisruptionConceptMetricAverages,
  getMarketCapCoverageDataset,
  getPostBubbleDataset,
} from "~/lib/domain/insights";
import type {
  Alternative,
  AlternativeMetricId,
  Company,
  CompanyMetricId,
  ConceptMetricId,
  DisruptionConcept,
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

function makeProduct(slug: string, companySlug: string, overrides: Partial<Product> = {}): Product {
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
    disruptionConceptSlugs: [],
    maybeDisruptionException: null,
    implementationPrompt: {
      markdown: "Test prompt",
      generatedOn: "2026-03-24",
    },
    sourceIds: [],
    technologyWaveIds: [],
    ...overrides,
  };
}

function makeConceptMetricRecord(
  decentralizationFit: number,
  coordinationCredibility: number,
  implementationFeasibility: number,
  incumbentPressure: number,
): Record<ConceptMetricId, MetricAssessment> {
  return {
    decentralizationFit: makeAssessment(decentralizationFit),
    coordinationCredibility: makeAssessment(coordinationCredibility),
    implementationFeasibility: makeAssessment(implementationFeasibility),
    incumbentPressure: makeAssessment(incumbentPressure),
  };
}

function makeDisruptionConcept(
  slug: string,
  productSlug: string,
  metrics = makeConceptMetricRecord(8, 7, 6, 5),
): DisruptionConcept {
  return {
    slug,
    productSlug,
    name: slug,
    summary: "test",
    angleIds: ["lightning"],
    thesis: "test thesis",
    bitcoinOrDecentralizationRole: "test role",
    coordinationMechanism: "test coordination",
    verificationOrTrustModel: "test trust model",
    failureModes: ["test failure"],
    adoptionPath: ["test adoption"],
    confidence: "medium",
    problemSourceIds: ["test-source"],
    enablerSourceIds: ["test-source"],
    sourceIds: ["test-source"],
    metrics,
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
  const companies = [makeCompany("alpha", {}), makeCompany("beta", {})];
  const products = [
    makeProduct("alpha-doc", "alpha", { name: "Documented product" }),
    makeProduct("alpha-undoc", "alpha", { name: "Undocumented product" }),
    makeProduct("beta-doc", "beta", { name: "Runner-up product" }),
  ];
  const alternatives = [
    makeAlternative("alpha-alt-1", "alpha-doc", makeAlternativeMetricRecord(9, 8, 8.5, 8)),
    makeAlternative("alpha-alt-2", "alpha-doc", makeAlternativeMetricRecord(8.5, 8, 8, 8.5)),
    makeAlternative("beta-alt-1", "beta-doc", makeAlternativeMetricRecord(7, 7, 6.5, 6)),
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

test("getDisruptionConceptMetricAverages returns null for an empty concept set", () => {
  // Arrange
  const concepts: DisruptionConcept[] = [];

  // Act
  const averages = getDisruptionConceptMetricAverages(concepts);

  // Assert
  expect(averages).toBeNull();
});

test("getDisruptionConceptDataset ranks documented concepts ahead of exceptions", () => {
  // Arrange
  const companies = [makeCompany("alpha", {}), makeCompany("beta", {})];
  const products = [
    makeProduct("alpha-concept", "alpha", {
      name: "Concept product",
      disruptionConceptSlugs: ["alpha-concept-1", "alpha-concept-2"],
    }),
    makeProduct("alpha-exception", "alpha", {
      name: "Exception product",
      maybeDisruptionException: {
        reason: "Physical bottleneck",
        sourceIds: ["test-source"],
        lastReviewedOn: "2026-03-21",
      },
    }),
    makeProduct("beta-concept", "beta", {
      name: "Runner-up product",
      disruptionConceptSlugs: ["beta-concept-1"],
    }),
  ];
  const concepts = [
    makeDisruptionConcept(
      "alpha-concept-1",
      "alpha-concept",
      makeConceptMetricRecord(9, 8, 8.5, 8),
    ),
    makeDisruptionConcept(
      "alpha-concept-2",
      "alpha-concept",
      makeConceptMetricRecord(8.5, 8, 8, 8.5),
    ),
    makeDisruptionConcept("beta-concept-1", "beta-concept", makeConceptMetricRecord(7, 7, 6.5, 6)),
  ];

  // Act
  const dataset = getDisruptionConceptDataset(companies, products, concepts);

  // Assert
  expect(dataset.productRows.map((row) => row.product.slug)).toEqual([
    "alpha-concept",
    "beta-concept",
    "alpha-exception",
  ]);
  expect(dataset.companyRows.map((row) => row.company.slug)).toEqual(["alpha", "beta"]);
  expect(dataset.productsWithConcepts).toBe(2);
  expect(dataset.productsWithExceptions).toBe(1);
  expect(dataset.totalConceptCount).toBe(3);
  expect(dataset.companyRows[0]?.highestScoringProduct?.product.slug).toBe("alpha-concept");
});

test("calculateDisruptionConceptScore emphasizes feasibility and pressure", () => {
  // Arrange
  const score = calculateDisruptionConceptScore({
    decentralizationFit: 10,
    coordinationCredibility: 10,
    implementationFeasibility: 4,
    incumbentPressure: 4,
  });

  // Act
  const strongerExecutionScore = calculateDisruptionConceptScore({
    decentralizationFit: 8,
    coordinationCredibility: 8,
    implementationFeasibility: 9,
    incumbentPressure: 9,
  });

  // Assert
  expect(score).toBeLessThan(strongerExecutionScore);
});

test("getMarketCapCoverageDataset prefers live snapshot caps and dedupes S&P index membership", () => {
  // Arrange
  const sp500WithLiveSnapshot = makeCompany(
    "alpha",
    {
      moat: makeAssessment(6),
      decentralizability: makeAssessment(8),
      profitability: makeAssessment(7),
      marketCap: {
        ...makeAssessment(100),
        lastReviewedOn: "2026-03-10",
      },
    },
    {
      name: "Alpha",
      indexIds: ["sp500-top10", "sp500-top20"],
    },
  );
  const sp500WithFallback = makeCompany(
    "beta",
    {
      moat: {
        ...makeAssessment(5),
        lastReviewedOn: "2026-03-01",
      },
      decentralizability: {
        ...makeAssessment(7),
        lastReviewedOn: "2026-03-01",
      },
      profitability: {
        ...makeAssessment(6),
        lastReviewedOn: "2026-03-01",
      },
      marketCap: {
        ...makeAssessment(200),
        lastReviewedOn: "2026-03-12",
      },
    },
    {
      name: "Beta",
      indexIds: ["sp500-top35"],
    },
  );
  const nonSp500Company = makeCompany(
    "gamma",
    {
      moat: makeAssessment(7),
      decentralizability: makeAssessment(7),
      profitability: makeAssessment(7),
      marketCap: makeAssessment(300),
    },
    {
      name: "Gamma",
      indexIds: [],
    },
  );

  // Act
  const dataset = getMarketCapCoverageDataset(
    [sp500WithLiveSnapshot, sp500WithFallback, nonSp500Company],
    [
      {
        companySlug: "alpha",
        companyName: "Alpha",
        ticker: "ALPHA",
        companiesMarketCapUrl: "https://example.com/alpha",
        marketCapUsd: 150,
        marketCapDisplay: "$150",
        sourceKind: "live",
        sourceReportedAtLabel: "2026-03-20",
        fetchedAt: "2026-03-21T00:00:00.000Z",
        sourceNote: "Live row",
      },
    ],
  );

  // Assert
  expect(dataset.rows.map((row) => row.company.slug)).toEqual(["beta", "alpha"]);
  expect(dataset.analyzedCompanyCount).toBe(2);
  expect(dataset.rows[0]?.marketCapSourceKind).toBe("published");
  expect(dataset.rows[0]?.currentMarketCap).toBe(200);
  expect(dataset.rows[1]?.marketCapSourceKind).toBe("live");
  expect(dataset.rows[1]?.currentMarketCap).toBe(150);
  expect(dataset.totalCurrentMarketCap).toBe(350);
  expect(dataset.liveSnapshotCompanyCount).toBe(1);
  expect(dataset.fallbackSnapshotCompanyCount).toBe(0);
  expect(dataset.staleThesisCompanyCount).toBe(2);
  expect(dataset.latestMarketCapSnapshotAt).toBe("2026-03-21T00:00:00.000Z");
});

test("getMarketCapCoverageDataset uses published fallback snapshot rows when live fetches failed", () => {
  // Arrange
  const sp500Company = makeCompany(
    "delta",
    {
      moat: makeAssessment(4),
      decentralizability: makeAssessment(8),
      profitability: makeAssessment(5),
      marketCap: makeAssessment(250),
    },
    {
      name: "Delta",
      indexIds: ["sp500-top20"],
    },
  );

  // Act
  const dataset = getMarketCapCoverageDataset(
    [sp500Company],
    [
      {
        companySlug: "delta",
        companyName: "Delta",
        ticker: "DELTA",
        companiesMarketCapUrl: "https://example.com/delta",
        marketCapUsd: 240,
        marketCapDisplay: "$240",
        sourceKind: "published-fallback",
        sourceReportedAtLabel: "2026-03-18",
        fetchedAt: "2026-03-19T00:00:00.000Z",
        sourceNote: "Fallback row",
      },
    ],
  );

  // Assert
  expect(dataset.rows).toHaveLength(1);
  expect(dataset.rows[0]?.marketCapSourceKind).toBe("published-fallback");
  expect(dataset.rows[0]?.currentMarketCap).toBe(240);
  expect(dataset.fallbackSnapshotCompanyCount).toBe(1);
  expect(dataset.liveSnapshotCompanyCount).toBe(0);
});
