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
  const githubStepSummaryPath = path.join(run.runDirectory, "github-step-summary.md");
  const originalGitHubStepSummary = process.env.GITHUB_STEP_SUMMARY;
  process.env.GITHUB_STEP_SUMMARY = githubStepSummaryPath;

  try {
    await run.addBreadcrumb({
      detail: "Prepared the publish plan.",
      status: "planned",
      step: "plan",
    });

    const result = await writeDeploySummary(
      {
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
      },
      { runDirectory: run.runDirectory },
    );

    const jsonContent = await readFile(result.jsonPath, "utf8");
    const summaryJson = JSON.parse(jsonContent) as {
      breadcrumbs?: Array<{
        durationMs?: number;
        elapsedMs?: number;
        startedAt?: string;
        step: string;
      }>;
      command: string;
      timing?: { completedAt: string; durationMs: number; startedAt: string };
    };
    const markdownContent = await readFile(result.markdownPath, "utf8");
    const breadcrumbsJsonl = await readFile(run.breadcrumbsJsonlPath, "utf8");
    const breadcrumbsMarkdown = await readFile(run.breadcrumbsMarkdownPath, "utf8");
    const githubStepSummary = await readFile(githubStepSummaryPath, "utf8");

    expect(result.runDirectory).toContain(path.join(".codex", "logs", "deploy"));
    expect(summaryJson.command).toBe("deploy:aws:publish");
    expect(summaryJson.timing?.startedAt).toBeString();
    expect(summaryJson.timing?.completedAt).toBeString();
    expect(summaryJson.timing?.durationMs).toBeGreaterThanOrEqual(0);
    expect(summaryJson.breadcrumbs?.[0]?.step).toBe("plan");
    expect(summaryJson.breadcrumbs?.[0]?.startedAt).toBeString();
    expect(summaryJson.breadcrumbs?.[0]?.durationMs).toBeGreaterThanOrEqual(0);
    expect(summaryJson.breadcrumbs?.[0]?.elapsedMs).toBeGreaterThanOrEqual(0);
    expect(markdownContent).toContain("# Deployment Summary");
    expect(markdownContent).toContain("## Timing");
    expect(markdownContent).toContain("## Action Timeline");
    expect(breadcrumbsJsonl).toContain('"step":"plan"');
    expect(breadcrumbsMarkdown).toContain("# Deployment Breadcrumbs");
    expect(breadcrumbsMarkdown).toContain("Duration:");
    expect(githubStepSummary).toContain("## `deploy:aws:publish`");
    expect(githubStepSummary).toContain("Action timeline");

    await rm(result.runDirectory, { force: true, recursive: true });
  } finally {
    if (originalGitHubStepSummary === undefined) {
      delete process.env.GITHUB_STEP_SUMMARY;
    } else {
      process.env.GITHUB_STEP_SUMMARY = originalGitHubStepSummary;
    }
  }
});
