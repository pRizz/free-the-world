import { expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import type { DeployManifest } from "../../../scripts/lib/deploy-artifact";
import {
  assertArtifactMatchesTarget,
  assertDeployArtifactIntegrity,
  classifyArtifactPath,
  diffDeployManifests,
  getInvalidationPaths,
} from "../../../scripts/lib/deploy-artifact";

test("classifyArtifactPath marks hashed build assets immutable", () => {
  expect(classifyArtifactPath("_build/assets/app-abcdef12.js")).toBe("immutable");
  expect(classifyArtifactPath("about/index.html")).toBe("html");
  expect(classifyArtifactPath("robots.txt")).toBe("metadata");
});

test("diffDeployManifests identifies uploads and deletes", () => {
  const remoteManifest: DeployManifest = {
    artifactHash: "remote",
    basePath: "/",
    canonicalOrigin: "https://freetheworld.ai",
    files: [
      { cacheClass: "html", path: "index.html", sha256: "one", size: 1 },
      { cacheClass: "immutable", path: "_build/assets/app-abcdef12.js", sha256: "two", size: 2 },
    ],
    publicOrigin: "https://freetheworld.ai",
    routes: ["/"],
    target: "aws",
    version: 1,
  };

  const localManifest: DeployManifest = {
    ...remoteManifest,
    artifactHash: "local",
    files: [
      { cacheClass: "html", path: "index.html", sha256: "three", size: 3 },
      { cacheClass: "metadata", path: "robots.txt", sha256: "four", size: 4 },
    ],
  };

  const diff = diffDeployManifests(localManifest, remoteManifest);

  expect(diff.changed).toBe(true);
  expect(diff.uploads.map((file) => file.path)).toEqual(["index.html", "robots.txt"]);
  expect(diff.deletes).toEqual(["_build/assets/app-abcdef12.js"]);
});

test("getInvalidationPaths expands pretty URLs and skips immutable assets", () => {
  expect(
    getInvalidationPaths([
      "index.html",
      "about/index.html",
      "robots.txt",
      "_build/assets/app-abcdef12.js",
    ]),
  ).toEqual(["/", "/about", "/about/", "/about/index.html", "/index.html", "/robots.txt"]);
});

test("assertDeployArtifactIntegrity fails when manifest-listed files are missing", async () => {
  const artifactDir = await mkdtemp(path.join(tmpdir(), "deploy-artifact-"));

  try {
    // Arrange
    await mkdir(path.join(artifactDir, "_build", "assets"), { recursive: true });
    await writeFile(path.join(artifactDir, "index.html"), "<!doctype html>", "utf8");

    const manifest: DeployManifest = {
      artifactHash: "artifact",
      basePath: "/",
      canonicalOrigin: "https://freetheworld.ai",
      files: [
        { cacheClass: "html", path: "index.html", sha256: "one", size: 1 },
        { cacheClass: "metadata", path: ".nojekyll", sha256: "two", size: 2 },
        { cacheClass: "asset", path: "_build/.vite/manifest.json", sha256: "three", size: 3 },
      ],
      publicOrigin: "https://freetheworld.ai",
      routes: ["/"],
      target: "aws",
      version: 1,
    };

    // Act
    const result = assertDeployArtifactIntegrity(artifactDir, manifest);

    // Assert
    await expect(result).rejects.toThrow(
      /missing 2 file\(s\).*\.nojekyll.*_build\/\.vite\/manifest\.json/s,
    );
  } finally {
    await rm(artifactDir, { force: true, recursive: true });
  }
});

test("assertArtifactMatchesTarget allows external GitHub commit links on aws artifacts", async () => {
  const artifactDir = await mkdtemp(path.join(tmpdir(), "deploy-artifact-"));

  try {
    // Arrange
    await writeFile(
      path.join(artifactDir, "index.html"),
      [
        "<!doctype html>",
        '<link rel="modulepreload" href="/_build/assets/app.js">',
        '<a href="https://github.com/pRizz/free-the-world/commit/0123456789abcdef">Commit</a>',
      ].join(""),
      "utf8",
    );

    // Act
    const result = assertArtifactMatchesTarget(artifactDir, "aws");

    // Assert
    await expect(result).resolves.toBeUndefined();
  } finally {
    await rm(artifactDir, { force: true, recursive: true });
  }
});

test("assertArtifactMatchesTarget rejects unprefixed root references on github pages artifacts", async () => {
  const artifactDir = await mkdtemp(path.join(tmpdir(), "deploy-artifact-"));

  try {
    // Arrange
    await writeFile(
      path.join(artifactDir, "insights.html"),
      [
        "<!doctype html>",
        '<link rel="modulepreload" href="/free-the-world/_build/assets/app.js">',
        '<a href="/insights/post-bubble">Open the post-bubble view</a>',
      ].join(""),
      "utf8",
    );

    // Act
    const result = assertArtifactMatchesTarget(artifactDir, "github-pages");

    // Assert
    await expect(result).rejects.toThrow(
      /insights\.html still contains an unprefixed root reference: href="\//,
    );
  } finally {
    await rm(artifactDir, { force: true, recursive: true });
  }
});

test("assertArtifactMatchesTarget allows prefixed root references on github pages artifacts", async () => {
  const artifactDir = await mkdtemp(path.join(tmpdir(), "deploy-artifact-"));

  try {
    // Arrange
    await writeFile(
      path.join(artifactDir, "insights.html"),
      [
        "<!doctype html>",
        '<link rel="modulepreload" href="/free-the-world/_build/assets/app.js">',
        '<a href="/free-the-world/insights/post-bubble">Open the post-bubble view</a>',
      ].join(""),
      "utf8",
    );

    // Act
    const result = assertArtifactMatchesTarget(artifactDir, "github-pages");

    // Assert
    await expect(result).resolves.toBeUndefined();
  } finally {
    await rm(artifactDir, { force: true, recursive: true });
  }
});
