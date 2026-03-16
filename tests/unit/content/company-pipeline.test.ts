import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { chmod, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
  test("queues, promotes, loops, and syncs a manifest draft with safe defaults", async () => {
    await writeMinimalFixture(tempRoot);
    await writeFakeProvider(tempRoot, "newco");

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

async function writeFakeProvider(root: string, companySlug: string) {
  const dotCodexDir = path.join(root, ".codex");
  const scriptFile = path.join(root, "fake-provider.sh");
  const payloadFile = path.join(root, "fake-sync-payload.json");

  await mkdir(dotCodexDir, { recursive: true });
  await writeJson(payloadFile, buildSyncPayload(companySlug));
  await writeFile(
    scriptFile,
    [
      "#!/usr/bin/env bash",
      "set -euo pipefail",
      'prompt="$(cat)"',
      'if printf "%s" "$prompt" | grep -q "^Sync "; then',
      `  cat ${JSON.stringify(payloadFile)}`,
      "else",
      `  printf '%s' '${JSON.stringify({ ok: true })}'`,
      "fi",
      "",
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
}

function buildSyncPayload(companySlug: string) {
  return {
    schemaVersion: 1,
    bundle: {
      schemaVersion: 1,
      company: {
        slug: companySlug,
        name: "NewCo",
        ticker: "NEW",
        rankApprox: 11,
        maybeIpo: null,
        regionId: "us",
        indexIds: ["sp500-top20"],
        sectorId: "consumer-staples",
        industryId: "warehouse-clubs",
        companiesMarketCapUrl: "https://example.com/newco",
        description: "New company",
        overview: [
          {
            title: "Overview",
            paragraphs: ["Overview paragraph"],
          },
        ],
        moatNarrative: ["Moat paragraph"],
        decentralizationNarrative: ["Decentralization paragraph"],
        sourceIds: ["newco-source"],
        technologyWaveIds: [],
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
          slug: "newco-membership",
          name: "NewCo Membership",
          category: "Retail",
          homepageUrl: "https://example.com/newco/membership",
          summary: "Membership program",
          whyItMatters: "Important product",
          replacementSketch: ["Replacement sketch"],
          sourceIds: ["newco-source"],
          technologyWaveIds: [],
          alternatives: [
            {
              slug: "newco-open",
              name: "Open Wholesale",
              kind: "open-source",
              homepageUrl: "https://example.com/open-wholesale",
              repoUrl: "https://example.com/open-wholesale/repo",
              summary: "Open alternative",
              metrics: {
                openness: metric(9),
                decentralizationFit: metric(8),
                readiness: metric(7),
                costLeverage: metric(6),
              },
              sourceIds: ["newco-source"],
            },
          ],
        },
      ],
    },
    sources: [
      {
        id: "newco-source",
        title: "NewCo source",
        url: "https://example.com/newco/source",
        kind: "analysis",
        publisher: "Fixture",
        note: "Fixture note",
        accessedOn: "2026-03-16",
      },
    ],
    summaryMarkdown: "# Summary\n",
  };
}

function metric(value: number) {
  return {
    value,
    rationale: "Fixture metric rationale",
    sourceIds: ["newco-source"],
    confidence: "high" as const,
    lastReviewedOn: "2026-03-16",
  };
}
