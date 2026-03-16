import { afterAll, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createUnverifiedCompanyRequest,
  parseRawCompanyItems,
} from "../../../scripts/lib/company-intake-model";
import {
  readUnverifiedCompanyRequest,
  writeUnverifiedCompanyRequest,
} from "../../../scripts/lib/company-intake-store";
import { buildManifest, buildQueueEntry, writeJson, writeMinimalFixture } from "./fixtures";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tempRoot = "";

beforeEach(async () => {
  if (!tempRoot) {
    tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-company-intake-"));
  }

  await rm(tempRoot, { recursive: true, force: true });
  await mkdir(tempRoot, { recursive: true });
  await writeMinimalFixture(tempRoot);
  await writePublishCheckPackage(tempRoot);
});

afterAll(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

describe("company intake funnel", () => {
  test("parses comma, newline, bullet, and mixed group input without dropping group phrases", () => {
    // Arrange
    const rawInput = ["Visa, ORCL", "- Costco", "1. Next 5 S&P 500 companies"].join("\n");

    // Act
    const items = parseRawCompanyItems(rawInput);

    // Assert
    expect(items).toEqual(["Visa", "ORCL", "Costco", "Next 5 S&P 500 companies"]);
  });

  test("persists unverified requests and preserves status transitions", async () => {
    // Arrange
    const manifestDir = path.join(tempRoot, "manifests", "unverified");
    const request = createUnverifiedCompanyRequest({
      rawInput: "Visa\nOracle",
      rawItems: ["Visa", "Oracle"],
      requestId: "fixture-request",
      batchId: "fixture-batch",
      groupLabel: "Fixture batch",
      requestNotes: "Fixture notes",
    });

    // Act
    await writeUnverifiedCompanyRequest(request, manifestDir);
    await writeUnverifiedCompanyRequest(
      {
        ...(await readUnverifiedCompanyRequest("fixture-request", manifestDir)),
        status: "prepared",
      },
      manifestDir,
    );
    await writeUnverifiedCompanyRequest(
      {
        ...(await readUnverifiedCompanyRequest("fixture-request", manifestDir)),
        status: "completed",
      },
      manifestDir,
    );
    const persistedRequest = await readUnverifiedCompanyRequest("fixture-request", manifestDir);

    // Assert
    expect(persistedRequest.batchId).toBe("fixture-batch");
    expect(persistedRequest.groupLabel).toBe("Fixture batch");
    expect(persistedRequest.status).toBe("completed");
  });

  test("skips duplicate raw items plus canonical and queued companies before provider work", async () => {
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

    // Act
    const result = runCli([
      "company:intake",
      "--raw=FixtureCo\nQueuedCo\nfixtureco",
      "--provider=auto",
    ]);
    const request = await readSingleRequest();

    // Assert
    expect(result.status).toBe(0);
    expect(request.status).toBe("failed");
    expect(request.skippedItems.map((issue) => issue.code).sort()).toEqual([
      "already-canonical",
      "already-queued",
      "duplicate-input",
    ]);
  });

  test("records ambiguous and invalid provider issues during prepare", async () => {
    await writeFakeIntakeProvider(tempRoot, {
      resolve: {
        resolved: [],
        issues: [
          {
            sourceItem: "MysteryCo",
            code: "ambiguous",
            detail: "Could refer to multiple companies.",
          },
          {
            sourceItem: "BadCo",
            code: "invalid",
            detail: "Not a public company.",
          },
        ],
      },
      draft: {
        drafts: [],
        issues: [],
      },
      syncPayloads: {},
    });

    // Act
    const result = runCli(["company:intake", "--raw=MysteryCo\nBadCo", "--provider=auto"]);
    const request = await readSingleRequest();

    // Assert
    expect(result.status).toBe(0);
    expect(request.status).toBe("failed");
    expect(request.skippedItems.map((issue) => issue.code).sort()).toEqual([
      "ambiguous",
      "invalid",
    ]);
  });

  test("creates queued manifests and a persistent summary from raw intake", async () => {
    const providerLogFile = await writeFakeIntakeProvider(tempRoot, {
      resolve: {
        resolved: [
          {
            sourceItem: "NewCo",
            slug: "newco",
            name: "NewCo",
            ticker: "NEW",
          },
        ],
        issues: [],
      },
      draft: {
        drafts: [
          {
            sourceItem: "NewCo",
            manifest: buildManifest({
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
          },
        ],
        issues: [],
      },
      syncPayloads: {
        newco: buildSyncPayload({ slug: "newco", companyName: "NewCo", ticker: "NEW" }),
      },
    });

    const itemsFile = path.join(tempRoot, "items.json");
    await writeJson(itemsFile, ["NewCo"]);

    // Act
    const result = runCli(["company:intake", `--items-file=${itemsFile}`, "--provider=auto"]);
    const request = await readSingleRequest();

    // Assert
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Prepared request");
    await expect(
      readFile(path.join(tempRoot, "manifests", "queue", "newco.json"), "utf8"),
    ).resolves.toContain('"slug": "newco"');
    await expect(
      readFile(
        path.join(tempRoot, ".codex", "logs", "company-intake", request.requestId, "summary.md"),
        "utf8",
      ),
    ).resolves.toContain("Company Intake Summary");

    const events = await readProviderEvents(providerLogFile);
    expect(events.some((event) => event.phase === "resolve")).toBe(true);
    expect(events.some((event) => event.phase === "draft")).toBe(true);
  });

  test("resumes a prepared request by id and skips re-running prepare stages during dry-run", async () => {
    const providerLogFile = await writeFakeIntakeProvider(tempRoot, {
      resolve: {
        resolved: [
          {
            sourceItem: "NewCo",
            slug: "newco",
            name: "NewCo",
            ticker: "NEW",
          },
        ],
        issues: [],
      },
      draft: {
        drafts: [
          {
            sourceItem: "NewCo",
            manifest: buildManifest({
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
          },
        ],
        issues: [],
      },
      syncPayloads: {
        newco: buildSyncPayload({ slug: "newco", companyName: "NewCo", ticker: "NEW" }),
      },
    });

    // Arrange
    const prepareResult = runCli(["company:intake", "--raw=NewCo", "--provider=auto"]);
    const preparedRequest = await readSingleRequest();
    await writeFile(providerLogFile, "", "utf8");

    // Act
    const dryRunResult = runCli([
      "company:intake",
      `--request=${preparedRequest.requestId}`,
      "--mode=dry-run",
      "--provider=auto",
    ]);
    const completedRequest = await readSingleRequest();

    // Assert
    expect(prepareResult.status).toBe(0);
    expect(dryRunResult.status).toBe(0);
    expect(completedRequest.status).toBe("completed");
    await expect(
      readFile(path.join(tempRoot, "manifests", "companies", "newco.json"), "utf8"),
    ).resolves.toContain('"slug": "newco"');
    await expect(
      readFile(path.join(tempRoot, "manifests", "queue", "newco.json"), "utf8"),
    ).rejects.toThrow();

    const events = await readProviderEvents(providerLogFile);
    expect(events.some((event) => event.phase === "resolve")).toBe(false);
    expect(events.some((event) => event.phase === "draft")).toBe(false);
    expect(events.some((event) => event.phase === "loop")).toBe(true);
    expect(events.some((event) => event.phase === "sync")).toBe(true);
  });

  test("keeps publish sync serial when resuming a prepared multi-company request", async () => {
    const providerLogFile = await writeFakeIntakeProvider(
      tempRoot,
      {
        resolve: {
          resolved: [
            {
              sourceItem: "NewCo",
              slug: "newco",
              name: "NewCo",
              ticker: "NEW",
            },
            {
              sourceItem: "SecondCo",
              slug: "secondco",
              name: "SecondCo",
              ticker: "SEC",
            },
          ],
          issues: [],
        },
        draft: {
          drafts: [
            {
              sourceItem: "NewCo",
              manifest: buildManifest({
                slug: "newco",
                name: "NewCo",
                ticker: "NEW",
                indexIds: ["sp500-top20"],
                sectorId: "consumer-staples",
                industryId: "warehouse-clubs",
                companiesMarketCapUrl: "https://example.com/newco",
                description: "New company",
                technologyWaveIds: [],
              }),
            },
            {
              sourceItem: "SecondCo",
              manifest: buildManifest({
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
            },
          ],
          issues: [],
        },
        syncPayloads: {
          newco: buildSyncPayload({ slug: "newco", companyName: "NewCo", ticker: "NEW" }),
          secondco: buildSyncPayload({
            slug: "secondco",
            companyName: "SecondCo",
            ticker: "SEC",
          }),
        },
      },
      { delayMs: 150 },
    );

    // Arrange
    const prepareResult = runCli(["company:intake", "--raw=NewCo\nSecondCo", "--provider=auto"]);
    const preparedRequest = await readSingleRequest();
    await writeFile(providerLogFile, "", "utf8");

    // Act
    const publishResult = runCli([
      "company:intake",
      `--request=${preparedRequest.requestId}`,
      "--mode=publish",
      "--provider=auto",
      "--concurrency=2",
    ]);
    const completedRequest = await readSingleRequest();

    // Assert
    expect(prepareResult.status).toBe(0);
    expect(publishResult.status).toBe(0);
    expect(completedRequest.status).toBe("completed");
    const events = await readProviderEvents(providerLogFile);
    expect(events.some((event) => event.phase === "resolve")).toBe(false);
    expect(events.some((event) => event.phase === "draft")).toBe(false);
    expect(countStartsBeforeFirstEnd(events, "sync")).toBe(1);
    await expect(
      readFile(path.join(tempRoot, "companies", "newco", "bundle.json"), "utf8"),
    ).resolves.toContain('"slug": "newco"');
    await expect(
      readFile(path.join(tempRoot, "companies", "secondco", "bundle.json"), "utf8"),
    ).resolves.toContain('"slug": "secondco"');
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

async function readSingleRequest() {
  const entries = (await readdir(path.join(tempRoot, "manifests", "unverified")))
    .filter((entry) => entry.endsWith(".json"))
    .sort((left, right) => left.localeCompare(right));

  expect(entries.length).toBe(1);
  return JSON.parse(
    await readFile(path.join(tempRoot, "manifests", "unverified", entries[0]), "utf8"),
  ) as {
    requestId: string;
    status: string;
    skippedItems: Array<{ code: string }>;
  };
}

async function writeFakeIntakeProvider(
  root: string,
  payloads: {
    resolve: {
      resolved: Array<{ sourceItem: string; slug: string; name: string; ticker: string }>;
      issues: Array<{ sourceItem: string; code: string; detail: string }>;
    };
    draft: {
      drafts: Array<{ sourceItem: string; manifest: ReturnType<typeof buildManifest> }>;
      issues: Array<{ sourceItem: string; code: string; detail: string }>;
    };
    syncPayloads: Record<string, ReturnType<typeof buildSyncPayload>>;
  },
  options: { delayMs?: number } = {},
) {
  const dotCodexDir = path.join(root, ".codex");
  const scriptFile = path.join(root, "fake-intake-provider.cjs");
  const payloadFile = path.join(root, "fake-intake-provider-payloads.json");
  const logFile = path.join(root, "fake-intake-provider.log");
  const delayMs = options.delayMs ?? 0;

  await mkdir(dotCodexDir, { recursive: true });
  await writeJson(payloadFile, payloads);
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
      "  const payloads = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));",
      "  let phase = 'loop';",
      "  let label = firstLine;",
      "  if (firstLine.startsWith('Resolve company intake candidates.')) phase = 'resolve';",
      "  else if (firstLine.startsWith('Draft company intake manifests.')) phase = 'draft';",
      "  else if (firstLine.startsWith('Sync ')) phase = 'sync';",
      `  const logFile = ${JSON.stringify(logFile)};`,
      "  const append = (event) => fs.appendFileSync(logFile, JSON.stringify({ event, phase, label, ts: Date.now() }) + '\\n');",
      "  append('start');",
      `  await new Promise((resolve) => setTimeout(resolve, ${delayMs}));`,
      "  if (phase === 'resolve') stdout.write(JSON.stringify(payloads.resolve));",
      "  else if (phase === 'draft') stdout.write(JSON.stringify(payloads.draft));",
      "  else if (phase === 'sync') {",
      "    const slug = firstLine.slice('Sync '.length).trim();",
      "    stdout.write(JSON.stringify(payloads.syncPayloads[slug]));",
      "  } else {",
      "    stdout.write(JSON.stringify({ ok: true }));",
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

async function writePublishCheckPackage(root: string) {
  await writeJson(path.join(root, "package.json"), {
    name: "fixture-root",
    type: "module",
    scripts: {
      "content:validate": 'bun -e "process.exit(0)"',
      typecheck: 'bun -e "process.exit(0)"',
      test: 'bun -e "process.exit(0)"',
      build: 'bun -e "process.exit(0)"',
      "test:e2e": 'bun -e "process.exit(0)"',
    },
  });
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
