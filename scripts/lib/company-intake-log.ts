import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  PreparedCompanyCandidate,
  RalphSyncMode,
  UnverifiedCompanyIssue,
  UnverifiedCompanyRequestStatus,
} from "../../src/lib/domain/content-types";
import { rootDir } from "./content";

export interface CompanyIntakeBreadcrumb {
  at?: string;
  startedAt?: string;
  durationMs?: number;
  elapsedMs?: number;
  data?: unknown;
  detail: string;
  status: "failed" | "info" | "passed" | "planned" | "skipped";
  step: string;
}

export interface CompanyIntakeRunTiming {
  completedAt: string;
  durationMs: number;
  startedAt: string;
}

export interface CompanyIntakeSummary {
  command: string;
  mode: "prepare" | RalphSyncMode;
  requestId: string;
  status: UnverifiedCompanyRequestStatus;
  rawInput: string;
  rawItems: string[];
  batchId: string;
  groupLabel: string;
  requestNotes?: string;
  preparedCandidates: PreparedCompanyCandidate[];
  skippedItems: UnverifiedCompanyIssue[];
  queuedSlugs: string[];
  promotedSlugs: string[];
  completedCompanySlugs: string[];
  loopRunDirs: string[];
  syncRunDirs: string[];
  breadcrumbs?: CompanyIntakeBreadcrumb[];
  timing?: CompanyIntakeRunTiming;
}

interface PersistedCompanyIntakeRunMetadata {
  command: string;
  mode: "prepare" | RalphSyncMode;
  requestId: string;
  startedAt: string;
}

export interface CompanyIntakeRunContext {
  addBreadcrumb: (breadcrumb: CompanyIntakeBreadcrumb) => Promise<void>;
  breadcrumbsJsonlPath: string;
  breadcrumbsMarkdownPath: string;
  command: string;
  mode: "prepare" | RalphSyncMode;
  requestId: string;
  runDirectory: string;
  startedAt: string;
}

export async function createCompanyIntakeRun(options: {
  command: string;
  mode: "prepare" | RalphSyncMode;
  requestId: string;
}): Promise<CompanyIntakeRunContext> {
  const runDirectory = await ensureCompanyIntakeRunDirectory(options.requestId);
  const breadcrumbsJsonlPath = path.join(runDirectory, "breadcrumbs.jsonl");
  const breadcrumbsMarkdownPath = path.join(runDirectory, "breadcrumbs.md");
  const runMetadataPath = path.join(runDirectory, "run.json");
  const startedAt = new Date().toISOString();
  const startedAtMs = Date.parse(startedAt);
  let lastBreadcrumbAtMs = startedAtMs;

  await writeFile(breadcrumbsJsonlPath, "", "utf8");
  await writeFile(
    breadcrumbsMarkdownPath,
    [
      "# Company Intake Breadcrumbs",
      "",
      `- Command: \`${options.command}\``,
      `- Mode: \`${options.mode}\``,
      `- Request: \`${options.requestId}\``,
      `- Started at: \`${startedAt}\``,
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    runMetadataPath,
    `${JSON.stringify({ ...options, startedAt } satisfies PersistedCompanyIntakeRunMetadata, null, 2)}\n`,
    "utf8",
  );

  return {
    addBreadcrumb: async (breadcrumb) => {
      const completedAtMs = resolveTimestampMs(breadcrumb.at, Date.now());
      const completedAt = new Date(completedAtMs).toISOString();
      const breadcrumbStartedAtMs =
        breadcrumb.startedAt !== undefined
          ? resolveTimestampMs(breadcrumb.startedAt, lastBreadcrumbAtMs)
          : breadcrumb.durationMs !== undefined
            ? completedAtMs - breadcrumb.durationMs
            : lastBreadcrumbAtMs;
      const normalizedStartedAtMs = Math.min(
        completedAtMs,
        Math.max(startedAtMs, breadcrumbStartedAtMs),
      );
      const entry = {
        ...breadcrumb,
        at: completedAt,
        durationMs: Math.max(0, breadcrumb.durationMs ?? completedAtMs - normalizedStartedAtMs),
        elapsedMs: Math.max(0, completedAtMs - startedAtMs),
        startedAt: new Date(normalizedStartedAtMs).toISOString(),
      };
      lastBreadcrumbAtMs = completedAtMs;

      await appendFile(breadcrumbsJsonlPath, `${JSON.stringify(entry)}\n`, "utf8");
      await appendFile(
        breadcrumbsMarkdownPath,
        [
          `- ${entry.at} [${entry.status}] ${entry.step}: ${entry.detail}`,
          `  - Started at: \`${entry.startedAt}\``,
          `  - Duration: \`${formatDurationVerbose(entry.durationMs)}\``,
          `  - Elapsed: \`${formatDurationVerbose(entry.elapsedMs)}\``,
          entry.data === undefined
            ? null
            : `  \`\`\`json\n  ${JSON.stringify(entry.data, null, 2).replaceAll("\n", "\n  ")}\n  \`\`\``,
          "",
        ]
          .filter((line): line is string => line !== null)
          .join("\n"),
        "utf8",
      );
    },
    breadcrumbsJsonlPath,
    breadcrumbsMarkdownPath,
    command: options.command,
    mode: options.mode,
    requestId: options.requestId,
    runDirectory,
    startedAt,
  };
}

export async function writeCompanyIntakeSummary(
  summary: CompanyIntakeSummary,
  options: { runDirectory?: string } = {},
) {
  const runDirectory =
    options.runDirectory ?? (await ensureCompanyIntakeRunDirectory(summary.requestId));
  const runMetadata = await loadPersistedRunMetadata(runDirectory);
  const breadcrumbs = await loadPersistedBreadcrumbs(runDirectory);
  const completedAt = new Date().toISOString();
  const timing = runMetadata ? buildRunTiming(runMetadata.startedAt, completedAt) : summary.timing;
  const enrichedSummary: CompanyIntakeSummary = {
    ...summary,
    breadcrumbs: summary.breadcrumbs ?? breadcrumbs,
    timing,
  };

  const jsonPath = path.join(runDirectory, "summary.json");
  const markdownPath = path.join(runDirectory, "summary.md");

  await writeFile(jsonPath, `${JSON.stringify(enrichedSummary, null, 2)}\n`, "utf8");
  await writeFile(markdownPath, renderSummaryMarkdown(enrichedSummary), "utf8");

  return {
    jsonPath,
    markdownPath,
    runDirectory,
  };
}

async function ensureCompanyIntakeRunDirectory(requestId: string) {
  const runDirectory = path.join(rootDir, ".codex", "logs", "company-intake", requestId);
  await mkdir(runDirectory, { recursive: true });
  return runDirectory;
}

async function loadPersistedRunMetadata(runDirectory: string) {
  try {
    const rawText = await readFile(path.join(runDirectory, "run.json"), "utf8");
    return JSON.parse(rawText) as PersistedCompanyIntakeRunMetadata;
  } catch {
    return null;
  }
}

async function loadPersistedBreadcrumbs(runDirectory: string) {
  try {
    const rawText = await readFile(path.join(runDirectory, "breadcrumbs.jsonl"), "utf8");
    return rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as CompanyIntakeBreadcrumb);
  } catch {
    return [];
  }
}

function buildRunTiming(startedAt: string, completedAt: string): CompanyIntakeRunTiming {
  return {
    startedAt,
    completedAt,
    durationMs: Math.max(0, Date.parse(completedAt) - Date.parse(startedAt)),
  };
}

function renderSummaryMarkdown(summary: CompanyIntakeSummary) {
  return [
    "# Company Intake Summary",
    "",
    `- Command: \`${summary.command}\``,
    `- Mode: \`${summary.mode}\``,
    `- Request: \`${summary.requestId}\``,
    `- Status: \`${summary.status}\``,
    `- Batch: \`${summary.batchId}\``,
    `- Group label: ${summary.groupLabel}`,
    summary.requestNotes ? `- Request notes: ${summary.requestNotes}` : null,
    summary.timing
      ? [
          `- Started at: \`${summary.timing.startedAt}\``,
          `- Completed at: \`${summary.timing.completedAt}\``,
          `- Total duration: \`${formatDurationVerbose(summary.timing.durationMs)}\``,
        ].join("\n")
      : null,
    "",
    "## Raw Request",
    "```text",
    summary.rawInput,
    "```",
    "",
    "## Parsed Items",
    summary.rawItems.length > 0 ? summary.rawItems.map((item) => `- ${item}`).join("\n") : "- None",
    "",
    "## Prepared Candidates",
    summary.preparedCandidates.length > 0
      ? summary.preparedCandidates
          .map((candidate) => `- ${candidate.name} (${candidate.ticker}) -> \`${candidate.slug}\``)
          .join("\n")
      : "- None",
    "",
    "## Skipped Items",
    summary.skippedItems.length > 0
      ? summary.skippedItems
          .map(
            (issue) =>
              `- [${issue.code}] ${issue.sourceItem}: ${issue.detail}${issue.maybeCandidateSlug ? ` (\`${issue.maybeCandidateSlug}\`)` : ""}`,
          )
          .join("\n")
      : "- None",
    "",
    "## Queue And Pipeline",
    `- Queued slugs: ${formatValueList(summary.queuedSlugs)}`,
    `- Promoted slugs: ${formatValueList(summary.promotedSlugs)}`,
    `- Completed company slugs: ${formatValueList(summary.completedCompanySlugs)}`,
    `- Loop run directories: ${formatValueList(summary.loopRunDirs)}`,
    `- Sync run directories: ${formatValueList(summary.syncRunDirs)}`,
    summary.breadcrumbs && summary.breadcrumbs.length > 0
      ? ["", "## Action Timeline", renderBreadcrumbTable(summary.breadcrumbs)].join("\n")
      : null,
    "",
  ]
    .filter((section): section is string => section !== null)
    .join("\n");
}

function renderBreadcrumbTable(breadcrumbs: CompanyIntakeBreadcrumb[]) {
  const lines = [
    "| Step | Status | Detail | Duration | Elapsed |",
    "| --- | --- | --- | --- | --- |",
  ];

  for (const breadcrumb of breadcrumbs) {
    lines.push(
      [
        `| ${breadcrumb.step}`,
        breadcrumb.status,
        escapeTableCell(breadcrumb.detail),
        breadcrumb.durationMs === undefined
          ? "-"
          : `\`${formatDurationVerbose(breadcrumb.durationMs)}\``,
        breadcrumb.elapsedMs === undefined
          ? "-"
          : `\`${formatDurationVerbose(breadcrumb.elapsedMs)}\` |`,
      ].join(" | "),
    );
  }

  return lines.join("\n");
}

function escapeTableCell(value: string) {
  return value.replaceAll("|", "\\|");
}

function formatValueList(values: string[]) {
  return values.length > 0 ? values.map((value) => `\`${value}\``).join(", ") : "None";
}

function formatDurationVerbose(durationMs: number) {
  if (durationMs < 1_000) {
    return `${durationMs}ms`;
  }

  const totalSeconds = Math.round(durationMs / 1_000);
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [hours > 0 ? `${hours}h` : null, minutes > 0 ? `${minutes}m` : null, `${seconds}s`];
  return parts.filter((part): part is string => part !== null).join(" ");
}

function resolveTimestampMs(value: string | undefined, fallbackMs: number) {
  if (!value) {
    return fallbackMs;
  }

  const parsedMs = Date.parse(value);
  return Number.isNaN(parsedMs) ? fallbackMs : parsedMs;
}
