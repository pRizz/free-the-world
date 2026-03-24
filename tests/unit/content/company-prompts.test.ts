import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeMinimalFixture } from "./fixtures";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

let tempRoot = "";

beforeEach(async () => {
  tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-company-prompts-"));
});

afterEach(async () => {
  if (tempRoot) {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

describe("bun run company:prompts", () => {
  test("writes run-local implementation prompt artifacts in dry-run mode", async () => {
    await writeMinimalFixture(tempRoot);

    const result = runCli(["company:prompts", "--company=fixtureco", "--mode=dry-run"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "Generated implementation prompts for 1 company in dry-run mode.",
    );

    const runEntries = await readRunEntries("fixtureco");
    expect(runEntries).toHaveLength(1);

    const runDir = path.join(tempRoot, "research", "runs", "fixtureco", runEntries[0] ?? "");
    const normalizedPayload = JSON.parse(
      await readFile(path.join(runDir, "implementation-prompts.local.normalized.json"), "utf8"),
    ) as { prompts: Array<{ productSlug: string; markdown: string }> };

    expect(normalizedPayload.prompts).toHaveLength(1);
    expect(normalizedPayload.prompts[0]?.productSlug).toBe("fixtureco-core");
    expect(normalizedPayload.prompts[0]?.markdown).toContain("Build Fixture product");
  });

  test("backfills canonical prompts without mutating bundle content", async () => {
    await writeMinimalFixture(tempRoot);
    const bundleFile = path.join(tempRoot, "companies", "fixtureco", "bundle.json");
    const promptDir = path.join(tempRoot, "implementation-prompts", "fixtureco-core");
    const originalBundleText = await readFile(bundleFile, "utf8");

    await rm(promptDir, { recursive: true, force: true });

    const result = runCli(["company:prompts", "--company=fixtureco", "--mode=publish"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "Generated implementation prompts for 1 company in publish mode.",
    );
    expect(await readFile(bundleFile, "utf8")).toBe(originalBundleText);

    const canonicalPrompt = await readFile(path.join(promptDir, "PROMPT.md"), "utf8");
    expect(canonicalPrompt).toContain("productSlug: fixtureco-core");
    expect(canonicalPrompt).toContain("Build Fixture product");

    const generatedGraph = await readFile(
      path.join(tempRoot, "src", "lib", "generated", "content-graph.ts"),
      "utf8",
    );
    expect(generatedGraph).toContain('"implementationPrompt"');
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

async function readRunEntries(companySlug: string) {
  const runRoot = path.join(tempRoot, "research", "runs", companySlug);
  return (await readdir(runRoot)).sort();
}
