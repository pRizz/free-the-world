import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { compileContent, ContentValidationError } from "../../../scripts/lib/content";
import { writeJson, writeMinimalFixture } from "./fixtures";

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-content-"));
});

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("compileContent compiles the real JSON corpus and strips raw-only fields", async () => {
  const { graph } = await compileContent();

  expect(graph.companies.length).toBe(10);
  expect(graph.products.length).toBe(20);
  expect(graph.alternatives.length).toBe(31);
  expect("inputMetrics" in graph.companies[0]!).toBe(false);
  expect(graph.companies[0]!.metrics.freedCapitalPotential).toBeDefined();
});

test("compileContent rejects malformed JSON", async () => {
  await writeMinimalFixture(tempRoot);
  await writeFile(path.join(tempRoot, "sources", "fixture-source.json"), "{not-json", "utf8");

  await expect(compileContent(tempRoot)).rejects.toThrow();
});

test("compileContent rejects missing source references", async () => {
  await writeMinimalFixture(tempRoot, {
    companySourceIds: ["missing-source"],
  });

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues.some(issue => issue.includes("missing-source"))).toBe(true);
});

test("compileContent rejects duplicate source ids", async () => {
  await writeMinimalFixture(tempRoot);
  await writeJson(path.join(tempRoot, "sources", "duplicate.json"), {
    id: "fixture-source",
    title: "Duplicate source",
    url: "https://example.com/dup",
    kind: "analysis",
    publisher: "Fixture",
    note: "Duplicate id",
    accessedOn: "2026-03-14",
  });

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues).toContain("Duplicate source id fixture-source.");
});

test("compileContent rejects bad manifest taxonomy alignment", async () => {
  await writeMinimalFixture(tempRoot, {
    manifest: {
      sectorId: "consumer-staples",
      industryId: "software-cloud",
    },
  });

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues.some(issue => issue.includes("outside sector"))).toBe(true);
});

async function getValidationError(action: () => Promise<unknown>) {
  try {
    await action();
  } catch (error) {
    expect(error).toBeInstanceOf(ContentValidationError);
    return error as ContentValidationError;
  }

  throw new Error("Expected ContentValidationError.");
}
