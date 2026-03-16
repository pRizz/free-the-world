import { appendFile, mkdir, writeFile } from "node:fs/promises";
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

export interface DeployBreadcrumb {
  at?: string;
  data?: unknown;
  detail: string;
  status: "failed" | "info" | "passed" | "planned" | "skipped";
  step: string;
}

export interface DeployRunContext {
  addBreadcrumb: (breadcrumb: DeployBreadcrumb) => Promise<void>;
  breadcrumbsJsonlPath: string;
  breadcrumbsMarkdownPath: string;
  command: string;
  mode: "apply" | "check";
  runDirectory: string;
  target: string;
}

export async function createDeployRun(options: { command: string; mode: "apply" | "check"; target: string }): Promise<DeployRunContext> {
  const runDirectory = await ensureRunDirectory(options.command, options.target);
  const breadcrumbsJsonlPath = path.join(runDirectory, "breadcrumbs.jsonl");
  const breadcrumbsMarkdownPath = path.join(runDirectory, "breadcrumbs.md");

  await writeFile(breadcrumbsJsonlPath, "", "utf8");
  await writeFile(
    breadcrumbsMarkdownPath,
    [
      "# Deployment Breadcrumbs",
      "",
      `- Command: \`${options.command}\``,
      `- Target: \`${options.target}\``,
      `- Mode: \`${options.mode}\``,
      "",
    ].join("\n"),
    "utf8"
  );

  return {
    addBreadcrumb: async breadcrumb => {
      const entry = {
        ...breadcrumb,
        at: breadcrumb.at ?? new Date().toISOString(),
      };

      await appendFile(breadcrumbsJsonlPath, `${JSON.stringify(entry)}\n`, "utf8");
      await appendFile(
        breadcrumbsMarkdownPath,
        `- ${entry.at} [${entry.status}] ${entry.step}: ${entry.detail}${entry.data === undefined ? "" : `\n  \`\`\`json\n  ${JSON.stringify(entry.data, null, 2).replaceAll("\n", "\n  ")}\n  \`\`\``}\n`,
        "utf8"
      );
    },
    breadcrumbsJsonlPath,
    breadcrumbsMarkdownPath,
    command: options.command,
    mode: options.mode,
    runDirectory,
    target: options.target,
  };
}

export async function writeDeploySummary(summary: DeploySummary, options: { runDirectory?: string } = {}) {
  const runDirectory = options.runDirectory ?? (await ensureRunDirectory(summary.command, summary.target));

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

async function ensureRunDirectory(command: string, target: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const runDirectory = path.join(
    process.cwd(),
    ".codex",
    "logs",
    "deploy",
    `${timestamp}-${sanitizePathSegment(command)}-${sanitizePathSegment(target)}`
  );

  await mkdir(runDirectory, { recursive: true });
  return runDirectory;
}
