import { expect, test } from "bun:test";
import { extractJsonPayload, isBundleStale, resolveProviders } from "../../../scripts/lib/ralph";
import type { CompanyBundle, RalphProvidersFile } from "../../../src/lib/domain/content-types";

test("extractJsonPayload parses raw JSON and fenced JSON", () => {
  expect(extractJsonPayload('{"ok":true}')).toEqual({ ok: true });
  expect(extractJsonPayload("```json\n{\"ok\":true}\n```")).toEqual({ ok: true });
});

test("extractJsonPayload rejects empty output", () => {
  expect(() => extractJsonPayload("   ")).toThrow(/empty output/i);
});

test("resolveProviders honors provider availability and auto fallback order", () => {
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["codex", "claude"],
    providers: {
      codex: {
        command: "definitely-missing-command-for-ftw",
        args: [],
      },
      claude: {
        command: "bash",
        args: ["-lc", "cat"],
      },
    },
  };

  expect(resolveProviders("auto", providerConfig)).toEqual(["claude"]);
  expect(() => resolveProviders("both", providerConfig)).toThrow(/requires both providers/i);
});

test("isBundleStale flags aged bundles and keeps fresh bundles current", () => {
  const bundle = makeBundle("2026-01-01");
  const freshBundle = makeBundle("2026-03-10");
  const now = new Date("2026-03-15T00:00:00Z");

  expect(isBundleStale(bundle, now)).toBe(true);
  expect(isBundleStale(freshBundle, now)).toBe(false);
});

function makeBundle(lastReviewedOn: string): CompanyBundle {
  return {
    schemaVersion: 1,
    company: {
      slug: "fixtureco",
      name: "FixtureCo",
      ticker: "FIX",
      rankApprox: 1,
      maybeIpo: null,
      regionId: "us",
      indexIds: ["sp500-top10"],
      sectorId: "information-technology",
      industryId: "software-cloud",
      companiesMarketCapUrl: "https://example.com/fixtureco",
      description: "Fixture company",
      overview: [],
      moatNarrative: [],
      decentralizationNarrative: [],
      sourceIds: ["fixture-source"],
      technologyWaveIds: ["bitcoin-native-coordination"],
      snapshotNote: "Fixture snapshot",
      inputMetrics: {
        moat: metric(lastReviewedOn),
        decentralizability: metric(lastReviewedOn),
        profitability: metric(lastReviewedOn),
        peRatio: metric(lastReviewedOn),
        marketCap: metric(lastReviewedOn),
      },
    },
    products: [],
  };
}

function metric(lastReviewedOn: string) {
  return {
    value: 1,
    rationale: "Fixture metric rationale",
    sourceIds: ["fixture-source"],
    confidence: "high" as const,
    lastReviewedOn,
  };
}
