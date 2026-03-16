import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CompanyManifest,
  ManifestQueueEntry,
  ResearchTaskId,
} from "../../../src/lib/domain/content-types";

export async function writeMinimalFixture(
  root: string,
  overrides: {
    companySourceIds?: string[];
    manifest?: Partial<CompanyManifest>;
  } = {},
) {
  await mkdir(path.join(root, "taxonomy"), { recursive: true });
  await mkdir(path.join(root, "manifests", "companies"), { recursive: true });
  await mkdir(path.join(root, "manifests", "queue"), { recursive: true });
  await mkdir(path.join(root, "manifests", "unverified"), { recursive: true });
  await mkdir(path.join(root, "companies", "fixtureco"), { recursive: true });
  await mkdir(path.join(root, "sources"), { recursive: true });
  await mkdir(path.join(root, "prompts"), { recursive: true });

  await writeJson(path.join(root, "taxonomy", "regions.json"), [
    { id: "us", label: "United States" },
  ]);
  await writeJson(path.join(root, "taxonomy", "indices.json"), [
    {
      id: "sp500-top10",
      label: "S&P 500 · Top 10 by market cap",
      regionId: "us",
      description: "Fixture index",
    },
    {
      id: "sp500-top20",
      label: "S&P 500 · Top 20 by market cap",
      regionId: "us",
      description: "Fixture top 20 index",
    },
  ]);
  await writeJson(path.join(root, "taxonomy", "sectors.json"), [
    { id: "information-technology", label: "Information Technology" },
    { id: "consumer-staples", label: "Consumer Staples" },
    { id: "financials", label: "Financials" },
    { id: "health-care", label: "Health Care" },
    { id: "energy", label: "Energy" },
    { id: "communication-services", label: "Communication Services" },
  ]);
  await writeJson(path.join(root, "taxonomy", "industries.json"), [
    {
      id: "software-cloud",
      sectorId: "information-technology",
      label: "Software & Cloud Platforms",
    },
    {
      id: "semiconductors",
      sectorId: "information-technology",
      label: "Semiconductors",
    },
    {
      id: "diversified-banks",
      sectorId: "financials",
      label: "Diversified Banks",
    },
    {
      id: "pharmaceuticals",
      sectorId: "health-care",
      label: "Pharmaceuticals",
    },
    {
      id: "payment-networks",
      sectorId: "financials",
      label: "Payment Networks",
    },
    {
      id: "warehouse-clubs",
      sectorId: "consumer-staples",
      label: "Warehouse Clubs",
    },
    {
      id: "integrated-oil-gas",
      sectorId: "energy",
      label: "Integrated Oil & Gas",
    },
    {
      id: "streaming-video",
      sectorId: "communication-services",
      label: "Streaming Video",
    },
    {
      id: "pharma-medtech",
      sectorId: "health-care",
      label: "Pharma & MedTech",
    },
  ]);
  await writeJson(path.join(root, "taxonomy", "technology-waves.json"), [
    {
      id: "bitcoin-native-coordination",
      label: "Bitcoin and Lightning as coordination rails",
      summary: "Fixture wave",
      implications: ["Fixture implication"],
    },
  ]);

  await writeJson(path.join(root, "sources", "fixture-source.json"), {
    id: "fixture-source",
    title: "Fixture source",
    url: "https://example.com/source",
    kind: "analysis",
    publisher: "Fixture",
    note: "Fixture note",
    accessedOn: "2026-03-14",
  });

  await writeJson(
    path.join(root, "manifests", "companies", "fixtureco.json"),
    buildManifest(overrides.manifest),
  );
  await writeLoopPromptFixtures(root);

  await writeJson(path.join(root, "companies", "fixtureco", "bundle.json"), {
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
      overview: [
        {
          title: "Fixture overview",
          paragraphs: ["Fixture paragraph one", "Fixture paragraph two"],
        },
      ],
      moatNarrative: ["Moat paragraph one", "Moat paragraph two"],
      decentralizationNarrative: [
        "Decentralization paragraph one",
        "Decentralization paragraph two",
      ],
      sourceIds: overrides.companySourceIds ?? ["fixture-source"],
      technologyWaveIds: ["bitcoin-native-coordination"],
      snapshotNote: "Fixture snapshot",
      inputMetrics: {
        moat: metric(8.1),
        decentralizability: metric(6.2),
        profitability: metric(7.4),
        peRatio: metric(21),
        marketCap: metric(1230000000),
      },
    },
    products: [
      {
        slug: "fixtureco-core",
        name: "Fixture product",
        category: "Productivity",
        homepageUrl: "https://example.com/product",
        summary: "Fixture product summary",
        whyItMatters: "Fixture product matters",
        replacementSketch: ["Replacement sketch"],
        sourceIds: ["fixture-source"],
        technologyWaveIds: ["bitcoin-native-coordination"],
        alternatives: [
          {
            slug: "fixture-open",
            name: "Fixture open alternative",
            kind: "open-source",
            homepageUrl: "https://example.com/open",
            repoUrl: "https://example.com/open/repo",
            summary: "Alternative summary",
            metrics: {
              openness: metric(9),
              decentralizationFit: metric(8),
              readiness: metric(7),
              costLeverage: metric(6),
            },
            sourceIds: ["fixture-source"],
          },
        ],
      },
    ],
  });
}

export function buildManifest(overrides: Partial<CompanyManifest> = {}): CompanyManifest {
  return {
    schemaVersion: 1,
    slug: "fixtureco",
    name: "FixtureCo",
    ticker: "FIX",
    regionId: "us",
    indexIds: ["sp500-top10"],
    sectorId: "information-technology",
    industryId: "software-cloud",
    companiesMarketCapUrl: "https://example.com/fixtureco",
    description: "Fixture company",
    technologyWaveIds: ["bitcoin-native-coordination"],
    notes: "Fixture manifest",
    ...overrides,
  };
}

export function buildQueueEntry(
  manifest: CompanyManifest,
  overrides: Partial<ManifestQueueEntry> = {},
): ManifestQueueEntry {
  return {
    schemaVersion: 1,
    status: "queued",
    createdOn: "2026-03-15T00:00:00.000Z",
    batchId: "sp500-top20-2026-03-15",
    groupLabel: "S&P 500 Top 20 by market cap",
    requestNotes: "Fixture queued entry",
    manifest,
    ...overrides,
  };
}

export async function writeJson(targetFile: string, value: unknown) {
  await writeFile(targetFile, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeLoopPromptFixtures(root: string) {
  const promptContents: Record<Exclude<ResearchTaskId, "company-sync">, string> = {
    "company-overview":
      "Company {{companyName}} ({{ticker}})\nProducts:\n{{productNames}}\nContext:\n{{companyDataJson}}\n",
    "moat-analysis":
      "Moat {{companyName}}\nProducts:\n{{productNames}}\nContext:\n{{companyDataJson}}\n",
    "decentralization-analysis":
      "Decentralization {{companyName}}\nProducts:\n{{productNames}}\nContext:\n{{companyDataJson}}\n",
    "product-alternatives":
      "Alternatives {{companyName}}\nProducts:\n{{productNames}}\nContext:\n{{companyDataJson}}\n",
    "source-gathering":
      "Sources {{companyName}}\nProducts:\n{{productNames}}\nContext:\n{{companyDataJson}}\n",
  };

  const promptFiles: Array<[string, string]> = [
    ["company-overview.md", promptContents["company-overview"]],
    ["moat-analysis.md", promptContents["moat-analysis"]],
    ["decentralization-analysis.md", promptContents["decentralization-analysis"]],
    ["product-alternatives.md", promptContents["product-alternatives"]],
    ["source-gathering.md", promptContents["source-gathering"]],
    ["company-sync.md", "Sync {{companySlug}}\n{{companyManifestJson}}\n{{taxonomyJson}}\n"],
    [
      "company-intake-candidates.md",
      "Resolve company intake candidates.\n{{rawItemsJson}}\n{{canonicalCompaniesJson}}\n{{queuedCompaniesJson}}\n",
    ],
    [
      "company-intake-manifests.md",
      "Draft company intake manifests.\n{{resolvedCandidatesJson}}\n{{taxonomyJson}}\n",
    ],
  ];

  for (const [fileName, fileContents] of promptFiles) {
    await writeFile(path.join(root, "prompts", fileName), fileContents, "utf8");
  }
}

function metric(value: number) {
  return {
    value,
    rationale: "Fixture metric rationale",
    sourceIds: ["fixture-source"],
    confidence: "high" as const,
    lastReviewedOn: "2026-03-14",
  };
}
