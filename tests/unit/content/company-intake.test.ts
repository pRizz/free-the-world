import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compileContent } from "../../../scripts/lib/content";
import { buildManifest, writeJson, writeMinimalFixture } from "./fixtures";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-intake-"));
});

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("company:queue accepts a valid manifest draft and preserves batch metadata", async () => {
  await writeMinimalFixture(tempRoot);
  const manifestFile = path.join(tempRoot, "drafts", "newco.json");

  await mkdir(path.dirname(manifestFile), { recursive: true });
  await writeJson(
    manifestFile,
    buildManifest({
      slug: "newco",
      name: "NewCo",
      ticker: "NEW",
      companiesMarketCapUrl: "https://example.com/newco",
      description: "New company",
    })
  );

  const result = runCli([
    "company:queue",
    `--manifest=${manifestFile}`,
    "--batch-id=top10-refresh",
    "--group-label=S&P 500 Top 10 refresh",
    "--request-notes=Batch intake candidate",
  ]);

  expect(result.status).toBe(0);

  const queuedEntry = JSON.parse(
    await readFile(path.join(tempRoot, "manifests", "queue", "newco.json"), "utf8")
  ) as {
    status: string;
    createdOn: string;
    batchId?: string;
    groupLabel?: string;
    requestNotes?: string;
    manifest: { slug: string };
  };

  expect(queuedEntry.status).toBe("queued");
  expect(queuedEntry.createdOn).toContain("T");
  expect(queuedEntry.batchId).toBe("top10-refresh");
  expect(queuedEntry.groupLabel).toBe("S&P 500 Top 10 refresh");
  expect(queuedEntry.requestNotes).toBe("Batch intake candidate");
  expect(queuedEntry.manifest.slug).toBe("newco");
});

test("company:queue rejects canonical slug collisions", async () => {
  await writeMinimalFixture(tempRoot);
  const manifestFile = path.join(tempRoot, "drafts", "fixtureco.json");

  await mkdir(path.dirname(manifestFile), { recursive: true });
  await writeJson(manifestFile, buildManifest());

  const result = runCli(["company:queue", `--manifest=${manifestFile}`]);

  expect(result.status).not.toBe(0);
  expect(`${result.stdout}\n${result.stderr}`).toContain("Canonical manifest fixtureco already exists.");
});

test("company:queue rejects queued slug collisions", async () => {
  await writeMinimalFixture(tempRoot);
  const manifestFile = path.join(tempRoot, "drafts", "newco.json");

  await mkdir(path.dirname(manifestFile), { recursive: true });
  await writeJson(
    manifestFile,
    buildManifest({
      slug: "newco",
      name: "NewCo",
      ticker: "NEW",
      companiesMarketCapUrl: "https://example.com/newco",
      description: "New company",
    })
  );

  expect(runCli(["company:queue", `--manifest=${manifestFile}`]).status).toBe(0);

  const duplicateResult = runCli(["company:queue", `--manifest=${manifestFile}`]);
  expect(duplicateResult.status).not.toBe(0);
  expect(`${duplicateResult.stdout}\n${duplicateResult.stderr}`).toContain("Queued manifest newco already exists.");
});

test("company:init --queued promotes a queued manifest and removes the queue entry", async () => {
  await writeMinimalFixture(tempRoot);
  const manifestFile = path.join(tempRoot, "drafts", "newco.json");

  await mkdir(path.dirname(manifestFile), { recursive: true });
  await writeJson(
    manifestFile,
    buildManifest({
      slug: "newco",
      name: "NewCo",
      ticker: "NEW",
      companiesMarketCapUrl: "https://example.com/newco",
      description: "New company",
    })
  );

  expect(runCli(["company:queue", `--manifest=${manifestFile}`]).status).toBe(0);

  const promotionResult = runCli(["company:init", "--queued=newco"]);
  expect(promotionResult.status).toBe(0);

  const canonicalManifest = JSON.parse(
    await readFile(path.join(tempRoot, "manifests", "companies", "newco.json"), "utf8")
  ) as { slug: string };
  expect(canonicalManifest.slug).toBe("newco");

  await expect(readFile(path.join(tempRoot, "manifests", "queue", "newco.json"), "utf8")).rejects.toThrow();
});

test("company:init --manifest continues to promote a direct manifest file", async () => {
  await writeMinimalFixture(tempRoot);
  const manifestFile = path.join(tempRoot, "drafts", "newco.json");

  await mkdir(path.dirname(manifestFile), { recursive: true });
  await writeJson(
    manifestFile,
    buildManifest({
      slug: "newco",
      name: "NewCo",
      ticker: "NEW",
      companiesMarketCapUrl: "https://example.com/newco",
      description: "New company",
    })
  );

  const result = runCli(["company:init", `--manifest=${manifestFile}`]);
  expect(result.status).toBe(0);

  const canonicalManifest = JSON.parse(
    await readFile(path.join(tempRoot, "manifests", "companies", "newco.json"), "utf8")
  ) as { slug: string };
  expect(canonicalManifest.slug).toBe("newco");
});

test("company:init --queued rejects malformed queue entries", async () => {
  await writeMinimalFixture(tempRoot);
  await writeJson(path.join(tempRoot, "manifests", "queue", "broken.json"), {
    schemaVersion: 1,
    status: "draft",
    createdOn: "2026-03-15T00:00:00.000Z",
    manifest: buildManifest({
      slug: "broken",
      name: "BrokenCo",
      ticker: "BRK",
      companiesMarketCapUrl: "https://example.com/broken",
      description: "Broken company",
    }),
  });

  const result = runCli(["company:init", "--queued=broken"]);
  expect(result.status).not.toBe(0);
  expect(`${result.stdout}\n${result.stderr}`).toContain("unsupported status");
});

test("compileContent ignores queued manifests", async () => {
  await writeMinimalFixture(tempRoot);
  await writeJson(path.join(tempRoot, "manifests", "queue", "newco.json"), {
    schemaVersion: 1,
    status: "queued",
    createdOn: "2026-03-15T00:00:00.000Z",
    batchId: "top10-refresh",
    groupLabel: "S&P 500 Top 10 refresh",
    manifest: buildManifest({
      slug: "newco",
      name: "NewCo",
      ticker: "NEW",
      companiesMarketCapUrl: "https://example.com/newco",
      description: "New company",
    }),
  });

  const { graph } = await compileContent(tempRoot);
  expect(graph.companies.length).toBe(1);
  expect(graph.companies[0]?.slug).toBe("fixtureco");
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
