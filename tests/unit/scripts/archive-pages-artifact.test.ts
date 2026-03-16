import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const archiveScript = path.join(rootDir, "scripts", "ci", "archive-pages-artifact.sh");

test("archive-pages-artifact.sh excludes hidden entries and keeps site files", async () => {
  // Arrange
  const tempRoot = await mkdtemp(path.join(tmpdir(), "ftw-archive-pages-artifact-"));
  const inputDir = path.join(tempRoot, "site");
  const outputTar = path.join(tempRoot, "artifact.tar");

  await mkdir(path.join(inputDir, "assets"), { recursive: true });
  await mkdir(path.join(inputDir, ".git"), { recursive: true });
  await mkdir(path.join(inputDir, ".github", "workflows"), { recursive: true });
  await writeFile(path.join(inputDir, "index.html"), "<html></html>");
  await writeFile(path.join(inputDir, "assets", "app.js"), "console.log('ok');");
  await writeFile(path.join(inputDir, ".git", "config"), "ignored");
  await writeFile(path.join(inputDir, ".github", "workflows", "deploy.yml"), "ignored");
  await writeFile(path.join(inputDir, ".hidden"), "ignored");

  try {
    // Act
    const archiveResult = spawnSync("bash", [archiveScript, inputDir, outputTar], {
      cwd: rootDir,
      encoding: "utf8",
    });

    // Assert
    expect(archiveResult.status).toBe(0);

    const listResult = spawnSync("tar", ["-tf", outputTar], {
      cwd: rootDir,
      encoding: "utf8",
    });

    expect(listResult.status).toBe(0);
    expect(listResult.stderr).toBe("");

    const entries = listResult.stdout
      .split("\n")
      .map((entry) => entry.trim())
      .filter(Boolean);
    const normalizedEntries = entries.map((entry) => entry.replace(/^\.\//, "").replace(/\/$/, ""));

    expect(normalizedEntries).toContain("index.html");
    expect(normalizedEntries).toContain("assets/app.js");
    expect(normalizedEntries.some((entry) => entry.includes(".git"))).toBe(false);
    expect(normalizedEntries.some((entry) => entry.includes(".github"))).toBe(false);
    expect(normalizedEntries.some((entry) => entry.includes(".hidden"))).toBe(false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
