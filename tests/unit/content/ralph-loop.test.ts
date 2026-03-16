import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRawContent, writeJsonFile } from "../../../scripts/lib/content";
import {
  parseLoopConcurrencyLimit,
  runWithConcurrencyLimit,
} from "../../../scripts/lib/ralph-loop-runner";
import { resolveLoopTargets } from "../../../scripts/lib/ralph-loop-targets";
import { buildManifest, buildQueueEntry, writeMinimalFixture } from "./fixtures";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-ralph-loop-"));
});

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

describe("resolveLoopTargets", () => {
  test("returns bundled canonical targets by default", async () => {
    await writeMinimalFixture(tempRoot);
    const raw = await loadRawContent(tempRoot);

    const targets = resolveLoopTargets({
      raw,
      queueEntries: [],
      requestedCompanySlugs: [],
    });

    expect(targets.map((target) => target.companySlug)).toEqual(["fixtureco"]);
    expect(targets[0]?.targetSource).toBe("canonical");
  });

  test("allows explicit canonical manifest-only targets", async () => {
    await writeMinimalFixture(tempRoot);
    await writeJsonFile(
      path.join(tempRoot, "manifests", "companies", "manifest-only.json"),
      buildManifest({
        slug: "manifest-only",
        name: "Manifest Only",
        ticker: "MAN",
        indexIds: ["sp500-top20"],
        sectorId: "financials",
        industryId: "diversified-banks",
        companiesMarketCapUrl: "https://example.com/manifest-only",
        description: "Manifest-only company",
        technologyWaveIds: ["bitcoin-native-coordination"],
      }),
    );
    const raw = await loadRawContent(tempRoot);

    const targets = resolveLoopTargets({
      raw,
      queueEntries: [],
      requestedCompanySlugs: ["manifest-only"],
    });

    expect(targets).toHaveLength(1);
    expect(targets[0]?.companySlug).toBe("manifest-only");
    expect(targets[0]?.targetSource).toBe("canonical");
  });

  test("selects queued batch targets", async () => {
    await writeMinimalFixture(tempRoot);
    const raw = await loadRawContent(tempRoot);
    const queuedEntry = buildQueueEntry(
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
    );

    const targets = resolveLoopTargets({
      raw,
      queueEntries: [queuedEntry],
      requestedCompanySlugs: [],
      batchId: "sp500-top20-2026-03-15",
    });

    expect(targets).toHaveLength(1);
    expect(targets[0]?.targetSource).toBe("queued");
    expect(targets[0]?.batchId).toBe("sp500-top20-2026-03-15");
  });

  test("fails with actionable guidance when a batch is missing", async () => {
    await writeMinimalFixture(tempRoot);
    const raw = await loadRawContent(tempRoot);

    expect(() =>
      resolveLoopTargets({
        raw,
        queueEntries: [],
        requestedCompanySlugs: [],
        batchId: "missing-batch",
      }),
    ).toThrow(/company:queue/);
  });

  test("fails with actionable guidance when a slug filter misses inside a batch", async () => {
    await writeMinimalFixture(tempRoot);
    const raw = await loadRawContent(tempRoot);
    const queuedEntry = buildQueueEntry(
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
    );

    expect(() =>
      resolveLoopTargets({
        raw,
        queueEntries: [queuedEntry],
        requestedCompanySlugs: ["missingco"],
        batchId: "sp500-top20-2026-03-15",
      }),
    ).toThrow(/does not contain company slug missingco/i);
  });

  test("fails on malformed queued entries", async () => {
    await writeMinimalFixture(tempRoot);
    const raw = await loadRawContent(tempRoot);
    const malformedEntry = {
      ...buildQueueEntry(
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
      status: "draft",
    };

    expect(() =>
      resolveLoopTargets({
        raw,
        queueEntries: [malformedEntry as never],
        requestedCompanySlugs: [],
        batchId: "sp500-top20-2026-03-15",
      }),
    ).toThrow(/unsupported status/i);
  });

  test("fails on duplicate queued slugs inside a batch", async () => {
    await writeMinimalFixture(tempRoot);
    const raw = await loadRawContent(tempRoot);
    const firstEntry = buildQueueEntry(
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
    );
    const duplicateEntry = buildQueueEntry(
      buildManifest({
        slug: "queuedco",
        name: "QueuedCo Duplicate",
        ticker: "QUD",
        indexIds: ["sp500-top20"],
        sectorId: "financials",
        industryId: "diversified-banks",
        companiesMarketCapUrl: "https://example.com/queuedco-duplicate",
        description: "Duplicate queued company",
        technologyWaveIds: ["bitcoin-native-coordination"],
      }),
      { createdOn: "2026-03-15T01:00:00.000Z" },
    );

    expect(() =>
      resolveLoopTargets({
        raw,
        queueEntries: [firstEntry, duplicateEntry],
        requestedCompanySlugs: [],
        batchId: "sp500-top20-2026-03-15",
      }),
    ).toThrow(/duplicate manifest slug/i);
  });
});

describe("loop concurrency", () => {
  test("parseLoopConcurrencyLimit defaults to 5 and rejects invalid values", () => {
    expect(parseLoopConcurrencyLimit()).toBe(5);
    expect(parseLoopConcurrencyLimit("10")).toBe(10);
    expect(() => parseLoopConcurrencyLimit("0")).toThrow(/positive integer/i);
    expect(() => parseLoopConcurrencyLimit("abc")).toThrow(/positive integer/i);
  });

  test("runWithConcurrencyLimit caps active workers", async () => {
    const activeItems: number[] = [];
    let activeCount = 0;
    let maxActiveCount = 0;

    await runWithConcurrencyLimit([1, 2, 3, 4, 5], 2, async (item) => {
      activeItems.push(item);
      activeCount += 1;
      maxActiveCount = Math.max(maxActiveCount, activeCount);

      await new Promise((resolve) => setTimeout(resolve, 10));

      activeCount -= 1;
    });

    expect(maxActiveCount).toBe(2);
    expect(activeItems.sort((left, right) => left - right)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("bun run loop", () => {
  test("writes prompts and run manifests for a queued batch", async () => {
    await writeMinimalFixture(tempRoot);
    await writeJsonFile(
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
          seedProductNames: ["Queued Product"],
          seedSourceUrls: ["https://example.com/queuedco"],
        }),
      ),
    );

    const result = runCli(["loop", "--batch-id=sp500-top20-2026-03-15", "--task=company-overview"]);

    expect(result.status).toBe(0);

    const runDir = await readOnlyRunDir("queuedco");
    const promptText = await readFile(path.join(runDir, "overview.prompt.md"), "utf8");
    const runManifest = JSON.parse(
      await readFile(path.join(runDir, "run.manifest.json"), "utf8"),
    ) as {
      companySlug: string;
      targetSource?: string;
      batchId?: string;
    };

    expect(promptText).toContain("QueuedCo");
    expect(promptText).toContain("Queued Product");
    expect(runManifest.companySlug).toBe("queuedco");
    expect(runManifest.targetSource).toBe("queued");
    expect(runManifest.batchId).toBe("sp500-top20-2026-03-15");
  });

  test("filters queued batch runs by company slug", async () => {
    await writeMinimalFixture(tempRoot);
    await writeJsonFile(
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
    await writeJsonFile(
      path.join(tempRoot, "manifests", "queue", "queuedco-two.json"),
      buildQueueEntry(
        buildManifest({
          slug: "queuedco-two",
          name: "QueuedCo Two",
          ticker: "QUT",
          indexIds: ["sp500-top20"],
          sectorId: "financials",
          industryId: "payment-networks",
          companiesMarketCapUrl: "https://example.com/queuedco-two",
          description: "Second queued company",
          technologyWaveIds: ["bitcoin-native-coordination"],
        }),
        { createdOn: "2026-03-15T01:00:00.000Z" },
      ),
    );

    const result = runCli([
      "loop",
      "--batch-id=sp500-top20-2026-03-15",
      "--company=queuedco-two",
      "--task=moat-analysis",
    ]);

    expect(result.status).toBe(0);

    const researchRunsDir = path.join(tempRoot, "research", "runs");
    const runCompanies = (await readdir(researchRunsDir)).sort();
    expect(runCompanies).toEqual(["queuedco-two"]);
  });

  test("accepts an explicit concurrency limit for multi-company batch runs", async () => {
    await writeMinimalFixture(tempRoot);
    await writeJsonFile(
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
    await writeJsonFile(
      path.join(tempRoot, "manifests", "queue", "queuedco-two.json"),
      buildQueueEntry(
        buildManifest({
          slug: "queuedco-two",
          name: "QueuedCo Two",
          ticker: "QUT",
          indexIds: ["sp500-top20"],
          sectorId: "financials",
          industryId: "payment-networks",
          companiesMarketCapUrl: "https://example.com/queuedco-two",
          description: "Second queued company",
          technologyWaveIds: ["bitcoin-native-coordination"],
        }),
        { createdOn: "2026-03-15T01:00:00.000Z" },
      ),
    );

    const result = runCli([
      "loop",
      "--batch-id=sp500-top20-2026-03-15",
      "--task=company-overview",
      "--concurrency=2",
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("concurrency 2");

    const researchRunsDir = path.join(tempRoot, "research", "runs");
    const runCompanies = (await readdir(researchRunsDir)).sort();
    expect(runCompanies).toEqual(["queuedco", "queuedco-two"]);
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

async function readOnlyRunDir(companySlug: string) {
  const companyRunRoot = path.join(tempRoot, "research", "runs", companySlug);
  const runDirs = await readdir(companyRunRoot);
  expect(runDirs).toHaveLength(1);
  const [runDir] = runDirs;

  if (!runDir) {
    throw new Error(`Expected one run directory for ${companySlug}.`);
  }

  return path.join(companyRunRoot, runDir);
}
