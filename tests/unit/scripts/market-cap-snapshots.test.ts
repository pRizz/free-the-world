import { expect, test } from "bun:test";
import {
  assertMarketCapSnapshotCoverage,
  buildFallbackMarketCapSnapshotRow,
  calculateMarketCapSnapshotCoverage,
  generateMarketCapSnapshot,
  hasSubstantiveMarketCapSnapshotChange,
  parseCompaniesMarketCapPage,
  parseMarketCapDisplayToUsd,
  selectMarketCapSnapshotCompanies,
  serializeMarketCapSnapshotCsv,
} from "../../../scripts/lib/market-cap-snapshots";
import type { MarketCapSnapshot } from "../../../src/lib/domain/market-cap-snapshots";
import type { Company, CompanyMetricId, MetricAssessment } from "../../../src/lib/domain/types";

function makeAssessment(value: number, lastReviewedOn = "2026-03-14"): MetricAssessment {
  return {
    value,
    rationale: "test",
    sourceIds: ["test-source"],
    confidence: "high",
    lastReviewedOn,
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
    snapshotNote: "test snapshot",
    maybeIpo: null,
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "test-sector",
    industryId: "test-industry",
    companiesMarketCapUrl: `https://example.com/${slug}/marketcap/`,
    description: "test company",
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

test("parseMarketCapDisplayToUsd converts compact trillions and billions", () => {
  expect(parseMarketCapDisplayToUsd("$4.161 T")).toBe(4_161_000_000_000);
  expect(parseMarketCapDisplayToUsd("$987.4 Billion USD")).toBe(987_400_000_000);
});

test("parseCompaniesMarketCapPage extracts the current market cap and reported date", () => {
  const html = [
    '<meta property="og:description" content="As of March 2026 NVIDIA has a market cap of $4.161 Trillion USD.">',
    '<div class="info-box"><div class="line1">$4.161 T</div><div class="line2">Marketcap</div></div>',
    "<p>On <strong>Mar 26th, 2026</strong> the market cap of NVIDIA was reported to be:</p>",
    '<div>by <a href="https://companiesmarketcap.com/">CompaniesMarketCap</a><img tooltip-title="retrieved from website (26-03-2026 22:01 UTC)" /></div>',
  ].join("");

  const parsed = parseCompaniesMarketCapPage(html);

  expect(parsed.marketCapDisplay).toBe("$4.161 T");
  expect(parsed.marketCapUsd).toBe(4_161_000_000_000);
  expect(parsed.sourceReportedAtLabel).toBe("Mar 26th, 2026");
  expect(parsed.sourceNote).toContain("retrieved from website");
});

test("buildFallbackMarketCapSnapshotRow uses the published company metric when available", () => {
  const company = makeCompany("alpha", {
    marketCap: makeAssessment(123_000_000_000, "2026-03-17"),
  });

  const row = buildFallbackMarketCapSnapshotRow(company, "2026-03-20T00:00:00.000Z");

  expect(row).not.toBeNull();
  expect(row?.sourceKind).toBe("published-fallback");
  expect(row?.marketCapUsd).toBe(123_000_000_000);
  expect(row?.sourceReportedAtLabel).toBe("2026-03-17");
});

test("generateMarketCapSnapshot falls back cleanly when live fetch fails", async () => {
  const company = makeCompany("alpha", {
    marketCap: makeAssessment(321_000_000_000, "2026-03-17"),
  });

  const snapshot = await generateMarketCapSnapshot([company], {
    fetchedAt: "2026-03-20T00:00:00.000Z",
    fetchImpl: (async () =>
      new Response("boom", {
        status: 500,
        statusText: "Server Error",
      })) as unknown as typeof fetch,
  });

  expect(snapshot.rows).toHaveLength(1);
  expect(snapshot.rows[0]?.sourceKind).toBe("published-fallback");
  expect(snapshot.rows[0]?.marketCapUsd).toBe(321_000_000_000);
});

test("selectMarketCapSnapshotCompanies supports all-published and S&P-only targets", () => {
  const companies = [
    makeCompany("sp500", {}, { indexIds: ["sp500-top10"] }),
    makeCompany("nonsp500", {}, { indexIds: ["nasdaq-100"] }),
    makeCompany("missing-url", {}, { companiesMarketCapUrl: "" }),
  ];

  expect(selectMarketCapSnapshotCompanies(companies, "all").map((company) => company.slug)).toEqual(
    ["sp500", "nonsp500"],
  );
  expect(
    selectMarketCapSnapshotCompanies(companies, "sp500").map((company) => company.slug),
  ).toEqual(["sp500"]);
});

test("assertMarketCapSnapshotCoverage allows fallback rows when live coverage meets the guard", () => {
  const snapshot = makeSnapshot([
    makeSnapshotRow("alpha", "live"),
    makeSnapshotRow("beta", "live"),
    makeSnapshotRow("gamma", "live"),
    makeSnapshotRow("delta", "live"),
    makeSnapshotRow("epsilon", "live"),
    makeSnapshotRow("zeta", "live"),
    makeSnapshotRow("eta", "live"),
    makeSnapshotRow("theta", "live"),
    makeSnapshotRow("iota", "live"),
    makeSnapshotRow("kappa", "published-fallback"),
  ]);

  const coverage = assertMarketCapSnapshotCoverage(snapshot, {
    targetCompanyCount: 10,
  });

  expect(coverage.liveCount).toBe(9);
  expect(coverage.fallbackCount).toBe(1);
  expect(coverage.liveShare).toBe(0.9);
});

test("assertMarketCapSnapshotCoverage fails below 90 percent live coverage", () => {
  const snapshot = makeSnapshot([
    makeSnapshotRow("alpha", "live"),
    makeSnapshotRow("beta", "live"),
    makeSnapshotRow("gamma", "live"),
    makeSnapshotRow("delta", "live"),
    makeSnapshotRow("epsilon", "live"),
    makeSnapshotRow("zeta", "live"),
    makeSnapshotRow("eta", "live"),
    makeSnapshotRow("theta", "live"),
    makeSnapshotRow("iota", "published-fallback"),
    makeSnapshotRow("kappa", "published-fallback"),
  ]);

  expect(() =>
    assertMarketCapSnapshotCoverage(snapshot, {
      targetCompanyCount: 10,
    }),
  ).toThrow(/below the required 90%/);
  expect(calculateMarketCapSnapshotCoverage(snapshot, 10).liveShare).toBe(0.8);
});

test("hasSubstantiveMarketCapSnapshotChange ignores refresh-only timestamps", () => {
  const previousSnapshot = makeSnapshot(
    [
      makeSnapshotRow("alpha", "live", {
        fetchedAt: "2026-03-20T00:00:00.000Z",
        sourceNote: "retrieved from website (20-03-2026 22:01 UTC)",
      }),
    ],
    "2026-03-20T00:00:00.000Z",
  );
  const nextSnapshot = makeSnapshot(
    [
      makeSnapshotRow("alpha", "live", {
        fetchedAt: "2026-03-21T00:00:00.000Z",
        sourceNote: "retrieved from website (21-03-2026 22:01 UTC)",
      }),
    ],
    "2026-03-21T00:00:00.000Z",
  );

  expect(hasSubstantiveMarketCapSnapshotChange(previousSnapshot, nextSnapshot)).toBe(false);
});

test("hasSubstantiveMarketCapSnapshotChange detects value and coverage changes", () => {
  const previousSnapshot = makeSnapshot([makeSnapshotRow("alpha", "live")]);
  const valueChangedSnapshot = makeSnapshot([
    makeSnapshotRow("alpha", "live", {
      marketCapDisplay: "$456",
      marketCapUsd: 456,
    }),
  ]);
  const coverageChangedSnapshot = makeSnapshot([
    makeSnapshotRow("alpha", "live"),
    makeSnapshotRow("beta", "live"),
  ]);

  expect(hasSubstantiveMarketCapSnapshotChange(previousSnapshot, valueChangedSnapshot)).toBe(true);
  expect(hasSubstantiveMarketCapSnapshotChange(previousSnapshot, coverageChangedSnapshot)).toBe(
    true,
  );
});

test("serializeMarketCapSnapshotCsv writes a stable header and quoted rows", () => {
  const csv = serializeMarketCapSnapshotCsv({
    generatedAt: "2026-03-20T00:00:00.000Z",
    sourceName: "CompaniesMarketCap",
    rows: [
      {
        companySlug: "alpha",
        companyName: 'Alpha "Inc"',
        ticker: "ALPHA",
        companiesMarketCapUrl: "https://example.com/alpha/marketcap/",
        marketCapUsd: 123,
        marketCapDisplay: "$123",
        sourceKind: "live",
        sourceReportedAtLabel: "Mar 26th, 2026",
        fetchedAt: "2026-03-20T00:00:00.000Z",
        sourceNote: 'retrieved from website, "fine"',
      },
    ],
  });

  expect(csv).toContain("company_slug,company_name,ticker");
  expect(csv).toContain('"Alpha ""Inc"""');
  expect(csv).toContain('"retrieved from website, ""fine"""');
});

function makeSnapshot(
  rows: MarketCapSnapshot["rows"],
  generatedAt = "2026-03-20T00:00:00.000Z",
): MarketCapSnapshot {
  return {
    generatedAt,
    sourceName: "CompaniesMarketCap",
    rows,
  };
}

function makeSnapshotRow(
  companySlug: string,
  sourceKind: MarketCapSnapshot["rows"][number]["sourceKind"],
  overrides: Partial<MarketCapSnapshot["rows"][number]> = {},
): MarketCapSnapshot["rows"][number] {
  return {
    companySlug,
    companyName: companySlug,
    ticker: companySlug.toUpperCase(),
    companiesMarketCapUrl: `https://example.com/${companySlug}/marketcap/`,
    marketCapUsd: 123,
    marketCapDisplay: "$123",
    sourceKind,
    sourceReportedAtLabel: "Mar 26th, 2026",
    fetchedAt: "2026-03-20T00:00:00.000Z",
    sourceNote: "retrieved from website (20-03-2026 22:01 UTC)",
    ...overrides,
  };
}
