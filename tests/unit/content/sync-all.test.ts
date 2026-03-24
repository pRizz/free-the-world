import { afterEach, beforeEach, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifest, writeJson, writeMinimalFixture } from "./fixtures";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-sync-all-"));
});

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("sync:all defaults to published targets, respects company filters, and writes a batch summary", async () => {
  await writeMinimalFixture(tempRoot);
  await writeSecondPublishedCompany(tempRoot);
  await writeJson(
    path.join(tempRoot, "manifests", "companies", "unpublishedco.json"),
    buildManifest({
      slug: "unpublishedco",
      name: "UnpublishedCo",
      ticker: "UNP",
      companiesMarketCapUrl: "https://example.com/unpublishedco",
      description: "Unpublished company",
    }),
  );
  await writeFakeProvider(tempRoot, [
    { slug: "fixtureco", companyName: "FixtureCo", ticker: "FIX" },
    { slug: "secondco", companyName: "SecondCo", ticker: "SEC" },
  ]);

  const result = runCli(["sync:all", "--company=fixtureco", "--provider=auto"]);

  expect(result.status).toBe(0);
  expect(result.stdout).toContain("Completed sync for 1 companies.");

  const batchDirs = (
    await readdir(path.join(tempRoot, "research", "runs", "_batches", "sync-all"), {
      withFileTypes: true,
    })
  )
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  expect(batchDirs).toHaveLength(1);

  const summary = JSON.parse(
    await readFile(
      path.join(tempRoot, "research", "runs", "_batches", "sync-all", batchDirs[0], "summary.json"),
      "utf8",
    ),
  ) as {
    target: string;
    requestedCompanies: string[];
    companyCount: number;
    successCount: number;
    totalConceptCount: number;
    totalCompleteProductCount: number;
    totalProductsNeedingSecondConceptCount: number;
  };
  const summaryMarkdown = await readFile(
    path.join(tempRoot, "research", "runs", "_batches", "sync-all", batchDirs[0], "summary.md"),
    "utf8",
  );

  expect(summary.target).toBe("published");
  expect(summary.requestedCompanies).toEqual(["fixtureco"]);
  expect(summary.companyCount).toBe(1);
  expect(summary.successCount).toBe(1);
  expect(summary.totalConceptCount).toBe(1);
  expect(summary.totalCompleteProductCount).toBe(0);
  expect(summary.totalProductsNeedingSecondConceptCount).toBe(1);
  expect(summaryMarkdown).toContain("Total disruption concepts: 1");
  expect(summaryMarkdown).toContain("Products at two concepts: 0");
  expect(summaryMarkdown).toContain("Products still needing a second concept: 1");
  expect(summaryMarkdown).toContain(
    "fixtureco: 1 concepts across 1 products, 0 products at two concepts, 1 still needing a second concept, 0 exceptions",
  );
});

function runCli(args: string[]) {
  return spawnSync("bun", ["run", ...args], {
    cwd: repoRoot,
    env: {
      ...process.env,
      FTW_ROOT_DIR: tempRoot,
      FTW_CONTENT_DIR: tempRoot,
    },
    encoding: "utf8",
  });
}

async function writeSecondPublishedCompany(root: string) {
  const bundleFile = path.join(root, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    company: Record<string, unknown>;
    products: Array<Record<string, unknown>>;
  };

  await writeJson(
    path.join(root, "manifests", "companies", "secondco.json"),
    buildManifest({
      slug: "secondco",
      name: "SecondCo",
      ticker: "SEC",
      companiesMarketCapUrl: "https://example.com/secondco",
      description: "Second company",
    }),
  );
  await mkdir(path.join(root, "companies", "secondco"), { recursive: true });
  await mkdir(path.join(root, "implementation-prompts", "secondco-core"), { recursive: true });
  await writeJson(path.join(root, "companies", "secondco", "bundle.json"), {
    ...bundle,
    company: {
      ...bundle.company,
      slug: "secondco",
      name: "SecondCo",
      ticker: "SEC",
      companiesMarketCapUrl: "https://example.com/secondco",
      description: "Second company",
    },
    products: bundle.products.map((product, index) => ({
      ...product,
      slug: index === 0 ? "secondco-core" : product.slug,
      name: index === 0 ? "SecondCo Product" : product.name,
      homepageUrl: index === 0 ? "https://example.com/secondco/product" : product.homepageUrl,
      sourceIds: ["fixture-source"],
      alternatives:
        "alternatives" in product && Array.isArray(product.alternatives)
          ? product.alternatives.map((alternative: Record<string, unknown>, alternativeIndex) => ({
              ...alternative,
              slug: alternativeIndex === 0 ? "secondco-open" : alternative.slug,
              name: alternativeIndex === 0 ? "SecondCo Open" : alternative.name,
            }))
          : [],
      disruptionConcepts:
        "disruptionConcepts" in product && Array.isArray(product.disruptionConcepts)
          ? product.disruptionConcepts.map(
              (disruptionConcept: Record<string, unknown>, conceptIndex) => ({
                ...disruptionConcept,
                slug: conceptIndex === 0 ? "secondco-lightning-market" : disruptionConcept.slug,
                name: conceptIndex === 0 ? "SecondCo Lightning Market" : disruptionConcept.name,
              }),
            )
          : [],
    })),
  });
  await writeFile(
    path.join(root, "implementation-prompts", "secondco-core", "PROMPT.md"),
    [
      "---",
      "productSlug: secondco-core",
      "companySlug: secondco",
      "generatedOn: 2026-03-24",
      "---",
      "",
      "# Build SecondCo Product",
      "",
      "Use this prompt to implement SecondCo's disruptive product alternative.",
      "",
    ].join("\n"),
    "utf8",
  );
}

async function writeFakeProvider(
  root: string,
  companies: Array<{ slug: string; companyName: string; ticker: string }>,
) {
  const dotCodexDir = path.join(root, ".codex");
  const scriptFile = path.join(root, "fake-sync-provider.cjs");
  const payloadFile = path.join(root, "fake-sync-payloads.json");

  await mkdir(dotCodexDir, { recursive: true });
  await writeJson(
    payloadFile,
    Object.fromEntries(
      companies.map(({ slug, companyName, ticker }) => [
        slug,
        buildSyncPayload({ slug, companyName, ticker }),
      ]),
    ),
  );
  await writeFile(
    scriptFile,
    [
      "#!/usr/bin/env node",
      "const fs = require('node:fs');",
      "const payloads = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));",
      "const { stdin, stdout } = process;",
      "(async () => {",
      "  let prompt = '';",
      "  stdin.setEncoding('utf8');",
      "  for await (const chunk of stdin) prompt += chunk;",
      "  const firstLine = prompt.split(/\\r?\\n/, 1)[0] ?? '';",
      "  const slug = firstLine.slice('Sync '.length).trim();",
      "  stdout.write(JSON.stringify(payloads[slug]));",
      "})().catch((error) => {",
      "  console.error(error);",
      "  process.exit(1);",
      "});",
    ].join("\n"),
    "utf8",
  );
  await chmod(scriptFile, 0o755);

  await writeJson(path.join(dotCodexDir, "ralph.providers.local.json"), {
    schemaVersion: 1,
    defaultProviderOrder: ["claude", "codex"],
    providers: {
      claude: {
        command: scriptFile,
        args: [payloadFile],
        timeoutMs: 5000,
      },
      codex: {
        command: "definitely-missing-command-for-ftw",
        args: [],
        timeoutMs: 5000,
      },
    },
  });
}

function buildSyncPayload(options: { slug: string; companyName: string; ticker: string }) {
  const sourceId = `${options.slug}-source`;

  return {
    schemaVersion: 1,
    bundle: {
      schemaVersion: 1,
      company: {
        slug: options.slug,
        name: options.companyName,
        ticker: options.ticker,
        rankApprox: 11,
        maybeIpo: null,
        regionId: "us",
        indexIds: ["sp500-top20"],
        sectorId: "consumer-staples",
        industryId: "warehouse-clubs",
        companiesMarketCapUrl: `https://example.com/${options.slug}`,
        description: `${options.companyName} company`,
        overview: [
          {
            title: "Overview",
            paragraphs: ["Overview paragraph"],
          },
        ],
        moatNarrative: ["Moat paragraph"],
        decentralizationNarrative: ["Decentralization paragraph"],
        sourceIds: [sourceId],
        technologyWaveIds: [],
        snapshotNote: "Fixture snapshot",
        inputMetrics: {
          moat: metric(8.1, sourceId),
          decentralizability: metric(6.2, sourceId),
          profitability: metric(7.4, sourceId),
          peRatio: metric(21, sourceId),
          marketCap: metric(1230000000, sourceId),
        },
      },
      products: [
        {
          slug: `${options.slug}-membership`,
          name: `${options.companyName} Membership`,
          category: "Retail",
          homepageUrl: `https://example.com/${options.slug}/membership`,
          summary: "Membership program",
          whyItMatters: "Important product",
          replacementSketch: ["Replacement sketch"],
          sourceIds: [sourceId],
          technologyWaveIds: [],
          alternatives: [
            {
              slug: `${options.slug}-open`,
              name: `${options.companyName} Open`,
              kind: "open-source",
              homepageUrl: `https://example.com/${options.slug}/open`,
              repoUrl: `https://example.com/${options.slug}/open/repo`,
              summary: "Open alternative",
              metrics: {
                openness: metric(9, sourceId),
                decentralizationFit: metric(8, sourceId),
                readiness: metric(7, sourceId),
                costLeverage: metric(6, sourceId),
              },
              sourceIds: [sourceId],
            },
          ],
          disruptionConcepts: [
            {
              slug: `${options.slug}-market`,
              name: `${options.companyName} Open Market`,
              summary: "Structured concept",
              angleIds: ["lightning", "decentralized-coordination"],
              thesis: "Open the product to independent operators.",
              bitcoinOrDecentralizationRole:
                "Lightning settles small recurring payments between participants.",
              coordinationMechanism: "Independent operators join a shared marketplace.",
              verificationOrTrustModel: "Proof of fulfillment and random audits discourage fraud.",
              failureModes: ["Collusion", "Weak early liquidity"],
              adoptionPath: ["Pilot with niche users", "Expand after reliability improves"],
              confidence: "medium",
              problemSourceIds: [sourceId],
              enablerSourceIds: [sourceId],
              metrics: {
                decentralizationFit: metric(8, sourceId),
                coordinationCredibility: metric(7, sourceId),
                implementationFeasibility: metric(6.5, sourceId),
                incumbentPressure: metric(6, sourceId),
              },
            },
          ],
        },
      ],
    },
    sources: [
      {
        id: sourceId,
        title: `${options.companyName} source`,
        url: `https://example.com/${options.slug}/source`,
        kind: "analysis",
        publisher: "Fixture",
        note: "Fixture note",
        accessedOn: "2026-03-21",
      },
    ],
    summaryMarkdown: "# Summary\n",
  };
}

function metric(value: number, sourceId: string) {
  return {
    value,
    rationale: "Fixture metric rationale",
    sourceIds: [sourceId],
    confidence: "high" as const,
    lastReviewedOn: "2026-03-21",
  };
}
