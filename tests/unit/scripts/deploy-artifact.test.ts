import { expect, test } from "bun:test";
import { classifyArtifactPath, diffDeployManifests, getInvalidationPaths } from "../../../scripts/lib/deploy-artifact";
import type { DeployManifest } from "../../../scripts/lib/deploy-artifact";

test("classifyArtifactPath marks hashed build assets immutable", () => {
  expect(classifyArtifactPath("_build/assets/app-abcdef12.js")).toBe("immutable");
  expect(classifyArtifactPath("about/index.html")).toBe("html");
  expect(classifyArtifactPath("robots.txt")).toBe("metadata");
});

test("diffDeployManifests identifies uploads and deletes", () => {
  const remoteManifest: DeployManifest = {
    artifactHash: "remote",
    basePath: "/",
    canonicalOrigin: "https://free-the-world.com",
    files: [
      { cacheClass: "html", path: "index.html", sha256: "one", size: 1 },
      { cacheClass: "immutable", path: "_build/assets/app-abcdef12.js", sha256: "two", size: 2 },
    ],
    publicOrigin: "https://free-the-world.com",
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
  expect(diff.uploads.map(file => file.path)).toEqual(["index.html", "robots.txt"]);
  expect(diff.deletes).toEqual(["_build/assets/app-abcdef12.js"]);
});

test("getInvalidationPaths expands pretty URLs and skips immutable assets", () => {
  expect(getInvalidationPaths(["index.html", "about/index.html", "robots.txt", "_build/assets/app-abcdef12.js"])).toEqual([
    "/",
    "/about",
    "/about/",
    "/about/index.html",
    "/index.html",
    "/robots.txt",
  ]);
});
