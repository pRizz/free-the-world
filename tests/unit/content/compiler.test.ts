import { afterEach, beforeEach, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { ContentValidationError, compileContent } from "../../../scripts/lib/content";
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
  const apple = graph.companies.find((company) => company.slug === "apple");
  const microsoft = graph.companies.find((company) => company.slug === "microsoft");

  expect(graph.companies.length).toBeGreaterThanOrEqual(10);
  expect(graph.products.length).toBeGreaterThanOrEqual(20);
  expect(graph.alternatives.length).toBeGreaterThanOrEqual(31);
  expect(graph.disruptionConcepts).toHaveLength(64);
  expect(graph.sources.length).toBeGreaterThan(0);
  expect(apple).toBeDefined();
  expect(microsoft).toBeDefined();
  if (!apple || !microsoft) {
    throw new Error("Expected the seeded Apple and Microsoft records to exist.");
  }
  expect("inputMetrics" in apple).toBe(false);
  expect(apple.metrics.freedCapitalPotential).toBeDefined();
  expect(graph.conceptAngles.length).toBeGreaterThanOrEqual(18);
  expect(graph.conceptAngles.some((angle) => angle.id === "distributed-energy-generation")).toBe(
    true,
  );
  expect(graph.conceptAngles.some((angle) => angle.id === "solar-manufacturing")).toBe(true);
  expect(graph.conceptAngles.some((angle) => angle.id === "wind-manufacturing")).toBe(true);
  expect(
    graph.products.every(
      (product) =>
        product.maybeDisruptionException !== null || product.disruptionConceptSlugs.length === 2,
    ),
  ).toBe(true);
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
  expect(error.issues.some((issue) => issue.includes("missing-source"))).toBe(true);
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

test("compileContent rejects unsupported source kinds", async () => {
  await writeMinimalFixture(tempRoot);
  await writeJson(path.join(tempRoot, "sources", "fixture-source.json"), {
    id: "fixture-source",
    title: "Fixture source",
    url: "https://example.com/source",
    kind: "sec-filing",
    publisher: "Fixture",
    note: "Fixture note",
    accessedOn: "2026-03-14",
  });

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues).toContain("Source fixture-source has unsupported kind sec-filing.");
});

test("compileContent rejects unsupported alternative kinds", async () => {
  await writeMinimalFixture(tempRoot);
  const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    products: Array<{ alternatives: Array<{ kind: string }> }>;
  };
  bundle.products[0].alternatives[0].kind = "commercial";
  await writeJson(bundleFile, bundle);

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues).toContain("Alternative fixture-open has unsupported kind commercial.");
});

test("compileContent rejects null repoUrl on alternatives", async () => {
  await writeMinimalFixture(tempRoot);
  const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    products: Array<{ alternatives: Array<{ repoUrl?: string | null }> }>;
  };
  bundle.products[0].alternatives[0].repoUrl = null;
  await writeJson(bundleFile, bundle);

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues).toContain(
    "Alternative fixture-open must omit repoUrl instead of setting it to null.",
  );
});

test("compileContent rejects bad manifest taxonomy alignment", async () => {
  await writeMinimalFixture(tempRoot, {
    manifest: {
      sectorId: "consumer-staples",
      industryId: "software-cloud",
    },
  });

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues.some((issue) => issue.includes("outside sector"))).toBe(true);
});

test("compileContent accepts a documented disruption exception in place of concepts", async () => {
  await writeMinimalFixture(tempRoot);
  const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    products: Array<{
      disruptionConcepts: unknown[];
      maybeDisruptionException?: {
        reason: string;
        sourceIds: string[];
        lastReviewedOn: string;
      };
    }>;
  };
  bundle.products[0].disruptionConcepts = [];
  bundle.products[0].maybeDisruptionException = {
    reason: "Hardware bottleneck remains too severe.",
    sourceIds: ["fixture-source"],
    lastReviewedOn: "2026-03-21",
  };
  await writeJson(bundleFile, bundle);

  const { graph } = await compileContent(tempRoot);

  expect(graph.products[0]?.maybeDisruptionException?.reason).toContain("Hardware bottleneck");
  expect(graph.disruptionConcepts).toHaveLength(0);
});

test("compileContent rejects products without concepts or exceptions", async () => {
  await writeMinimalFixture(tempRoot);
  const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    products: Array<{
      disruptionConcepts: unknown[];
      maybeDisruptionException?: unknown;
    }>;
  };
  bundle.products[0].disruptionConcepts = [];
  delete bundle.products[0].maybeDisruptionException;
  await writeJson(bundleFile, bundle);

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(
    error.issues.some((issue) =>
      issue.includes("must define 1-2 disruption concepts or a documented exception"),
    ),
  ).toBe(true);
});

test("compileContent rejects products with more than two disruption concepts", async () => {
  await writeMinimalFixture(tempRoot);
  const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    products: Array<{
      disruptionConcepts: Array<Record<string, unknown>>;
    }>;
  };
  bundle.products[0].disruptionConcepts.push({
    ...bundle.products[0].disruptionConcepts[0],
    slug: "fixtureco-third-concept",
    name: "Third concept",
  });
  bundle.products[0].disruptionConcepts.push({
    ...bundle.products[0].disruptionConcepts[0],
    slug: "fixtureco-fourth-concept",
    name: "Fourth concept",
  });
  await writeJson(bundleFile, bundle);

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(error.issues).toContain(
    "Product fixtureco-core exceeds the maximum of 2 disruption concepts.",
  );
});

test("compileContent rejects disruption concepts without angles or source layers", async () => {
  await writeMinimalFixture(tempRoot);
  const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
  const bundle = JSON.parse(await readFile(bundleFile, "utf8")) as {
    products: Array<{
      disruptionConcepts: Array<{
        angleIds: string[];
        problemSourceIds: string[];
        enablerSourceIds: string[];
      }>;
    }>;
  };
  bundle.products[0].disruptionConcepts[0].angleIds = [];
  bundle.products[0].disruptionConcepts[0].problemSourceIds = [];
  bundle.products[0].disruptionConcepts[0].enablerSourceIds = [];
  await writeJson(bundleFile, bundle);

  const error = await getValidationError(() => compileContent(tempRoot));
  expect(
    error.issues.some((issue) => issue.includes("must reference at least one concept angle")),
  ).toBe(true);
  expect(
    error.issues.some((issue) => issue.includes("must reference at least one problem source")),
  ).toBe(true);
  expect(
    error.issues.some((issue) => issue.includes("must reference at least one enabler source")),
  ).toBe(true);
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
