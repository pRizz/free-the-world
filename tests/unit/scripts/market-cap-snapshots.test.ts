import { expect, test } from "bun:test";
import {
  buildFallbackMarketCapSnapshotRow,
  generateMarketCapSnapshot,
  parseCompaniesMarketCapPage,
  parseMarketCapDisplayToUsd,
  serializeMarketCapSnapshotCsv,
} from "../../../scripts/lib/market-cap-snapshots";
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
