import { expect, test } from "bun:test";
import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { createDeployRun, writeDeploySummary } from "../../../scripts/lib/deploy-log";

test("writeDeploySummary writes markdown and json summaries under the gitignored deploy log directory", async () => {
  const run = await createDeployRun({
    command: "deploy:aws:publish",
    mode: "check",
    target: "aws",
  });

  await run.addBreadcrumb({
    detail: "Prepared the publish plan.",
    status: "planned",
    step: "plan",
  });

  const result = await writeDeploySummary({
    appliedChanges: ["Uploaded index.html"],
    artifactDir: ".artifacts/deploy/aws",
    artifactHash: "abc123",
    command: "deploy:aws:publish",
    discoveredRemoteState: { bucket: "example-bucket" },
    mode: "check",
    plannedChanges: { uploads: ["index.html"] },
    resultingUrls: ["https://free-the-world.com/"],
    skippedReasons: ["Check mode only"],
    target: "aws",
    verificationResults: [
      {
        detail: "Manifest comparison completed.",
        name: "manifest",
        status: "passed",
      },
    ],
  }, { runDirectory: run.runDirectory });

  const jsonContent = await readFile(result.jsonPath, "utf8");
  const markdownContent = await readFile(result.markdownPath, "utf8");
  const breadcrumbsJsonl = await readFile(run.breadcrumbsJsonlPath, "utf8");
  const breadcrumbsMarkdown = await readFile(run.breadcrumbsMarkdownPath, "utf8");

  expect(result.runDirectory).toContain(path.join(".codex", "logs", "deploy"));
  expect(jsonContent).toContain('"command": "deploy:aws:publish"');
  expect(markdownContent).toContain("# Deployment Summary");
  expect(breadcrumbsJsonl).toContain('"step":"plan"');
  expect(breadcrumbsMarkdown).toContain("# Deployment Breadcrumbs");

  await rm(result.runDirectory, { force: true, recursive: true });
});
