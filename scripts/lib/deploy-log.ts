import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export interface DeployVerificationResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  detail: string;
}

export interface DeploySummary {
  command: string;
  target: string;
  mode: "check" | "apply";
  artifactHash?: string;
  artifactDir?: string;
  discoveredRemoteState: unknown;
  plannedChanges: unknown;
  skippedReasons: string[];
  appliedChanges: string[];
  verificationResults: DeployVerificationResult[];
  resultingUrls: string[];
}

export async function writeDeploySummary(summary: DeploySummary) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDirectory = path.join(
    process.cwd(),
    ".codex",
    "logs",
    "deploy",
    `${timestamp}-${sanitizePathSegment(summary.command)}-${sanitizePathSegment(summary.target)}`
  );

  await mkdir(runDirectory, { recursive: true });

  const jsonPath = path.join(runDirectory, "summary.json");
  const markdownPath = path.join(runDirectory, "summary.md");

  await writeFile(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderSummaryMarkdown(summary), "utf8");

  return {
    jsonPath,
    markdownPath,
    runDirectory,
  };
}

function renderSummaryMarkdown(summary: DeploySummary) {
  const sections = [
    "# Deployment Summary",
    "",
    `- Command: \`${summary.command}\``,
    `- Target: \`${summary.target}\``,
    `- Mode: \`${summary.mode}\``,
    summary.artifactDir ? `- Artifact directory: \`${summary.artifactDir}\`` : null,
    summary.artifactHash ? `- Artifact hash: \`${summary.artifactHash}\`` : null,
    summary.resultingUrls.length > 0 ? `- Result URLs: ${summary.resultingUrls.map(url => `\`${url}\``).join(", ")}` : null,
    "",
    "## Skips",
    summary.skippedReasons.length > 0 ? summary.skippedReasons.map(reason => `- ${reason}`).join("\n") : "- None",
    "",
    "## Applied Changes",
    summary.appliedChanges.length > 0 ? summary.appliedChanges.map(change => `- ${change}`).join("\n") : "- None",
    "",
    "## Verification",
    summary.verificationResults.length > 0
      ? summary.verificationResults.map(result => `- [${result.status}] ${result.name}: ${result.detail}`).join("\n")
      : "- None",
    "",
    "## Planned Changes",
    "```json",
    JSON.stringify(summary.plannedChanges, null, 2),
    "```",
    "",
    "## Discovered Remote State",
    "```json",
    JSON.stringify(summary.discoveredRemoteState, null, 2),
    "```",
    "",
  ];

  return sections.filter((section): section is string => section !== null).join("\n");
}

function sanitizePathSegment(input: string) {
  return input.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "") || "run";
}
