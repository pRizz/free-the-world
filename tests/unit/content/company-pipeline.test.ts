import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolvePipelineSyncConcurrencyLimit } from "../../../scripts/lib/company-pipeline";
import { buildManifest, buildQueueEntry, writeJson, writeMinimalFixture } from "./fixtures";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-company-pipeline-"));
});

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

describe("bun run company:pipeline", () => {
  test("resolvePipelineSyncConcurrencyLimit keeps dry-run parallel and forces publish serial", () => {
    expect(resolvePipelineSyncConcurrencyLimit("dry-run", 5)).toBe(5);
    expect(resolvePipelineSyncConcurrencyLimit("publish", 5)).toBe(1);
  });

  test("queues, promotes, loops, and syncs a manifest draft with safe defaults", async () => {
    await writeMinimalFixture(tempRoot);
    await writeFakeProvider(tempRoot, [
      {
        slug: "newco",
        companyName: "NewCo",
        ticker: "NEW",
      },
    ]);

    const manifestFile = path.join(tempRoot, "drafts", "newco.json");
    await mkdir(path.dirname(manifestFile), { recursive: true });
    await writeJson(
      manifestFile,
      buildManifest({
        slug: "newco",
        name: "NewCo",
        ticker: "NEW",
        indexIds: ["sp500-top20"],
        sectorId: "consumer-staples",
        industryId: "warehouse-clubs",
        companiesMarketCapUrl: "https://example.com/newco",
        description: "New company",
        technologyWaveIds: [],
        seedProductNames: ["NewCo Membership"],
        seedSourceUrls: ["https://example.com/newco"],
      }),
    );

    const result = runCli([
      "company:pipeline",
      `--manifest=${manifestFile}`,
      "--batch-id=top20-refresh",
      "--group-label=S&P 500 Top 20 refresh",
      "--request-notes=Fixture batch intake",
      "--provider=auto",
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Queued 1 manifest(s), promoted 1, looped 1, synced 1.");

    const canonicalManifest = JSON.parse(
      await readFile(path.join(tempRoot, "manifests", "companies", "newco.json"), "utf8"),
    ) as { slug: string };
    expect(canonicalManifest.slug).toBe("newco");

    await expect(
      readFile(path.join(tempRoot, "manifests", "queue", "newco.json"), "utf8"),
    ).rejects.toThrow();
    await expect(
      readFile(path.join(tempRoot, "companies", "newco", "bundle.json"), "utf8"),
    ).rejects.toThrow();

    const runDirEntries = (
      await readdir(path.join(tempRoot, "research", "runs", "newco"), {
        withFileTypes: true,
      })
    )
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    expect(runDirEntries.length).toBe(2);

    const runManifests = await Promise.all(
      runDirEntries.map(
        async (entryName) =>
          JSON.parse(
            await readFile(
              path.join(tempRoot, "research", "runs", "newco", entryName, "run.manifest.json"),
              "utf8",
            ),
          ) as {
            taskResults: Array<{ taskId: string; success: boolean }>;
            mode: string;
          },
      ),
    );

    const loopManifest = runManifests.find((runManifest) =>
      runManifest.taskResults.some((result) => result.taskId === "company-overview"),
    );
    const syncManifest = runManifests.find((runManifest) =>
      runManifest.taskResults.some((result) => result.taskId === "company-sync"),
    );

    expect(loopManifest?.mode).toBe("dry-run");
    expect(loopManifest?.taskResults.every((result) => result.success)).toBe(true);
    expect(syncManifest?.mode).toBe("dry-run");
    expect(syncManifest?.taskResults.every((result) => result.success)).toBe(true);

    const syncRunDirName = runDirEntries.find((entryName) =>
      runManifests.find(
        (runManifest, index) =>
          runDirEntries[index] === entryName &&
          runManifest.taskResults.some((result) => result.taskId === "company-sync"),
      ),
    );
    const summaryMarkdown = await readFile(
      path.join(tempRoot, "research", "runs", "newco", syncRunDirName ?? "", "summary.md"),
      "utf8",
    );
    expect(summaryMarkdown).toContain("## Concept Review Checklist");
    expect(summaryMarkdown).toContain("Products that still need a second concept");
  });

  test("promotes every queued manifest in a batch when batch-id is provided alone", async () => {
    await writeMinimalFixture(tempRoot);
    await writeJson(
      path.join(tempRoot, "manifests", "queue", "queuedco.json"),
      buildQueueEntry(
        buildManifest({
          slug: "queuedco",
          name: "QueuedCo",
          ticker: "QUE",
          indexIds: ["sp500-top20"],
          sectorId: "health-care",
          industryId: "pharmaceuticals",
          companiesMarketCapUrl: "https://example.com/queuedco",
          description: "Queued company",
          technologyWaveIds: [],
        }),
      ),
    );

    const result = runCli([
      "company:pipeline",
      "--batch-id=sp500-top20-2026-03-15",
      "--skip-loop=true",
      "--skip-sync=true",
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Queued 0 manifest(s), promoted 1, looped 0, synced 0.");

    const canonicalManifest = JSON.parse(
      await readFile(path.join(tempRoot, "manifests", "companies", "queuedco.json"), "utf8"),
    ) as { slug: string };
    expect(canonicalManifest.slug).toBe("queuedco");

    await expect(
      readFile(path.join(tempRoot, "manifests", "queue", "queuedco.json"), "utf8"),
    ).rejects.toThrow();
  });

  test("runs dry-run loop and sync work concurrently when concurrency is greater than 1", async () => {
    await writeMinimalFixture(tempRoot);
    const providerLogFile = await writeFakeProvider(
      tempRoot,
      [
        {
          slug: "fixtureco",
          companyName: "FixtureCo",
          ticker: "FIX",
        },
        {
          slug: "secondco",
          companyName: "SecondCo",
          ticker: "SEC",
        },
      ],
      { delayMs: 150 },
    );

    await writeJson(
      path.join(tempRoot, "manifests", "companies", "secondco.json"),
      buildManifest({
        slug: "secondco",
        name: "SecondCo",
        ticker: "SEC",
        indexIds: ["sp500-top20"],
        sectorId: "consumer-staples",
        industryId: "warehouse-clubs",
        companiesMarketCapUrl: "https://example.com/secondco",
        description: "Second company",
        technologyWaveIds: [],
      }),
    );

    const result = runCli([
      "company:pipeline",
      "--company=fixtureco,secondco",
      "--provider=auto",
      "--concurrency=2",
    ]);

    expect(result.status).toBe(0);

    const providerEvents = await readProviderEvents(providerLogFile);
    expect(countStartsBeforeFirstEnd(providerEvents, "loop")).toBe(2);
    expect(countStartsBeforeFirstEnd(providerEvents, "sync")).toBe(2);
  });
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

async function writeFakeProvider(
  root: string,
  companies: Array<{ slug: string; companyName: string; ticker: string }>,
  options: { delayMs?: number } = {},
) {
  const dotCodexDir = path.join(root, ".codex");
  const scriptFile = path.join(root, "fake-provider.cjs");
  const payloadFile = path.join(root, "fake-sync-payloads.json");
  const logFile = path.join(root, "fake-provider.log");
  const delayMs = options.delayMs ?? 0;

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
      "const { stdin, stdout } = process;",
      "(async () => {",
      "  let prompt = '';",
      "  stdin.setEncoding('utf8');",
      "  for await (const chunk of stdin) {",
      "    prompt += chunk;",
      "  }",
      "  const firstLine = prompt.split(/\\r?\\n/, 1)[0] ?? '';",
      "  const isSync = firstLine.startsWith('Sync ');",
      "  const phase = isSync ? 'sync' : 'loop';",
      "  const label = firstLine;",
      `  const logFile = ${JSON.stringify(logFile)};`,
      "  const append = (event) => fs.appendFileSync(logFile, JSON.stringify({ event, phase, label, ts: Date.now() }) + '\\n');",
      "  append('start');",
      `  await new Promise((resolve) => setTimeout(resolve, ${delayMs}));`,
      "  if (isSync) {",
      `    const payloads = JSON.parse(fs.readFileSync(${JSON.stringify(payloadFile)}, 'utf8'));`,
      "    const slug = firstLine.slice('Sync '.length).trim();",
      "    stdout.write(JSON.stringify(payloads[slug]));",
      "  } else {",
      `    stdout.write(${JSON.stringify(JSON.stringify({ ok: true }))});`,
      "  }",
      "  append('end');",
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
        args: [],
        timeoutMs: 5000,
      },
      codex: {
        command: "definitely-missing-command-for-ftw",
        args: [],
        timeoutMs: 5000,
      },
    },
  });

  return logFile;
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
        accessedOn: "2026-03-16",
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
    lastReviewedOn: "2026-03-16",
  };
}

async function readProviderEvents(logFile: string) {
  const rawLog = await readFile(logFile, "utf8");
  return rawLog
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(
      (line) =>
        JSON.parse(line) as { event: "start" | "end"; phase: string; label: string; ts: number },
    );
}

function countStartsBeforeFirstEnd(
  events: Array<{ event: "start" | "end"; phase: string; label: string; ts: number }>,
  phase: string,
) {
  const phaseEvents = events.filter((event) => event.phase === phase);
  const firstEnd = phaseEvents.find((event) => event.event === "end");
  const cutoffTs = firstEnd?.ts ?? Number.POSITIVE_INFINITY;
  return phaseEvents.filter((event) => event.event === "start" && event.ts <= cutoffTs).length;
}
