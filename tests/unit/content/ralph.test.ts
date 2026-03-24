import { expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  collectSyncTargets,
  executeProvider,
  extractClaudeCliResult,
  extractClaudeDebugDiagnostics,
  extractCodexSessionId,
  extractJsonPayload,
  findCodexSessionFile,
  isBundleStale,
  resolveProviderExecutionPlan,
  resolveProviders,
} from "../../../scripts/lib/ralph";
import type { CompanyBundle, RalphProvidersFile } from "../../../src/lib/domain/content-types";

test("extractJsonPayload parses raw JSON and fenced JSON", () => {
  expect(extractJsonPayload('{"ok":true}')).toEqual({ ok: true });
  expect(extractJsonPayload('```json\n{"ok":true}\n```')).toEqual({ ok: true });
});

test("extractJsonPayload rejects empty output", () => {
  expect(() => extractJsonPayload("   ")).toThrow(/empty output/i);
});

test("extractClaudeCliResult unwraps Claude JSON output metadata", () => {
  expect(
    extractClaudeCliResult(
      JSON.stringify({
        type: "result",
        result: '{"ok":true}',
        session_id: "session-123",
        duration_ms: 2500,
        total_cost_usd: 0.12,
        num_turns: 1,
        stop_reason: null,
      }),
      "json",
    ),
  ).toEqual({
    rawOutput: '{"ok":true}',
    metadata: {
      sessionId: "session-123",
      durationMs: 2500,
      totalCostUsd: 0.12,
      numTurns: 1,
      stopReason: null,
    },
  });
  expect(extractClaudeCliResult("Hello!", "text")).toBeNull();
});

test("extractCodexSessionId parses the session id from provider stderr", () => {
  expect(
    extractCodexSessionId("OpenAI Codex\nsession id: 019cf64a-910f-7b61-aebe-c2ead2b0a0b4\n"),
  ).toBe("019cf64a-910f-7b61-aebe-c2ead2b0a0b4");
  expect(extractCodexSessionId("no session here")).toBeNull();
});

test("findCodexSessionFile resolves nested session logs under CODEX_HOME", async () => {
  const codexHomeDir = await mkdtemp(path.join(tmpdir(), "ftw-codex-home-"));
  const sessionFile = path.join(
    codexHomeDir,
    "sessions",
    "2026",
    "03",
    "16",
    "rollout-2026-03-16T05-56-47-019cf64a-910f-7b61-aebe-c2ead2b0a0b4.jsonl",
  );
  const previousCodexHome = process.env.CODEX_HOME;

  try {
    process.env.CODEX_HOME = codexHomeDir;
    await mkdir(path.dirname(sessionFile), { recursive: true });
    await writeFile(
      sessionFile,
      '{"timestamp":"2026-03-16T10:56:49.945Z","type":"event_msg","payload":{"type":"task_complete"}}\n',
    );

    expect(await findCodexSessionFile("019cf64a-910f-7b61-aebe-c2ead2b0a0b4")).toBe(sessionFile);
  } finally {
    if (previousCodexHome === undefined) {
      delete process.env.CODEX_HOME;
    } else {
      process.env.CODEX_HOME = previousCodexHome;
    }
  }
});

test("resolveProviders honors provider availability and auto fallback order", () => {
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["codex", "claude"],
    providers: {
      codex: {
        command: "definitely-missing-command-for-ftw",
        args: [],
      },
      claude: {
        command: "bash",
        args: ["-lc", "cat"],
      },
    },
  };

  expect(resolveProviders("auto", providerConfig)).toEqual(["claude"]);
  expect(() => resolveProviders("both", providerConfig)).toThrow(/requires both providers/i);
});

test("resolveProviderExecutionPlan injects codex last-message capture before stdin prompt", async () => {
  const runDir = await mkdtemp(path.join(tmpdir(), "ftw-ralph-provider-"));
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["codex", "claude"],
    providers: {
      codex: {
        command: "codex",
        args: ["exec", "-s", "read-only", "-C", "{{rootDir}}", "-"],
      },
      claude: {
        command: "claude",
        args: ["-p"],
      },
    },
  };

  const plan = resolveProviderExecutionPlan(
    "codex",
    {
      rootDir: "/repo/root",
      companySlug: "fixtureco",
      taskId: "company-sync",
      runDir,
    },
    providerConfig,
  );

  expect(plan.timeoutMs).toBe(600000);
  expect(plan.args).toContain("--output-last-message");
  expect(plan.args.at(-1)).toBe("-");
  expect(plan.maybeOutputFile).toBe(path.join(runDir, "company-sync.codex.last-message.txt"));
});

test("resolveProviderExecutionPlan injects claude debug-file and default json output", async () => {
  const runDir = await mkdtemp(path.join(tmpdir(), "ftw-ralph-claude-provider-"));
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["claude", "codex"],
    providers: {
      claude: {
        command: "claude",
        args: ["-p", "--permission-mode", "dontAsk"],
        env: {
          CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
          CLAUDE_RUN_DIR: "{{runDir}}",
        },
      },
      codex: {
        command: "codex",
        args: ["exec", "-s", "read-only", "-C", "{{rootDir}}", "-"],
      },
    },
  };

  const plan = resolveProviderExecutionPlan(
    "claude",
    {
      rootDir: "/repo/root",
      companySlug: "fixtureco",
      taskId: "company-overview",
      runDir,
    },
    providerConfig,
  );

  expect(plan.args).toContain("--debug-file");
  expect(plan.args).toContain("--output-format");
  expect(plan.env).toEqual({
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
    CLAUDE_RUN_DIR: runDir,
  });
  expect(plan.outputFormat).toBe("json");
  expect(plan.maybeDebugFile).toBe(path.join(runDir, "company-overview.claude.debug.log"));
});

test("extractClaudeDebugDiagnostics classifies marketplace and auth failures", () => {
  const diagnostics = extractClaudeDebugDiagnostics(
    [
      "[WARN] Cache corrupted or missing for marketplace claude-plugins-official, re-fetching from source: Invalid schema: /Users/example/.claude/plugins/marketplaces/claude-plugins-official/.claude-plugin/marketplace.json plugins.56.source: Invalid input",
      '[ERROR] "Failed to refresh marketplace claude-plugins-official: The marketplace.json file is no longer present in this repository."',
      '[WARN] "git pull failed, will re-clone: error: cannot pull with rebase: You have unstaged changes."',
      "[DEBUG] Stream started - received first chunk",
    ].join("\n"),
    "Not logged in · Please run /login",
    "Could not resolve authentication method",
  );

  expect(diagnostics.issueCodes).toEqual([
    "deprecated-marketplace",
    "marketplace-schema-invalid",
    "marketplace-git-conflict",
    "missing-auth",
    "not-logged-in",
  ]);
  expect(diagnostics.streamStarted).toBe(true);
  expect(diagnostics.remediationSteps).toContain(
    'Run `claude plugin marketplace remove "claude-plugins-official"` and retry the Ralph command.',
  );
});

test("executeProvider unwraps Claude JSON output envelopes", async () => {
  const runDir = await mkdtemp(path.join(tmpdir(), "ftw-ralph-claude-json-"));
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["claude", "codex"],
    providers: {
      claude: {
        command: "bash",
        args: [
          "-lc",
          'cat >/dev/null; printf \'%s\' \'{"type":"result","result":"{\\"ok\\":true}","session_id":"session-123","duration_ms":42,"total_cost_usd":0.5,"num_turns":1,"stop_reason":null}\'',
          "--output-format",
          "json",
        ],
      },
      codex: {
        command: "codex",
        args: ["exec", "-s", "read-only", "-C", "{{rootDir}}", "-"],
      },
    },
  };

  const execution = await executeProvider(
    "claude",
    "ignored",
    {
      rootDir: "/repo/root",
      companySlug: "fixtureco",
      taskId: "company-overview",
      runDir,
    },
    providerConfig,
  );

  expect(execution.exitCode).toBe(0);
  expect(execution.rawOutput).toBe('{"ok":true}');
  expect(execution.metadata).toEqual({
    sessionId: "session-123",
    durationMs: 42,
    totalCostUsd: 0.5,
    numTurns: 1,
    stopReason: null,
  });
});

test("executeProvider applies provider-specific environment overrides", async () => {
  const runDir = await mkdtemp(path.join(tmpdir(), "ftw-ralph-claude-env-"));
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["claude", "codex"],
    providers: {
      claude: {
        command: "bash",
        args: ["-c", 'cat >/dev/null; printf "%s" "$CLAUDE_TEST_FLAG"'],
        env: {
          CLAUDE_TEST_FLAG: "applied",
        },
      },
      codex: {
        command: "codex",
        args: ["exec", "-s", "read-only", "-C", "{{rootDir}}", "-"],
      },
    },
  };

  const execution = await executeProvider(
    "claude",
    "ignored",
    {
      rootDir: "/repo/root",
      companySlug: "fixtureco",
      taskId: "company-overview",
      runDir,
    },
    providerConfig,
  );

  expect(execution.exitCode).toBe(0);
  expect(execution.rawOutput).toBe("applied");
});

test("executeProvider terminates long-running commands after the configured timeout", async () => {
  const runDir = await mkdtemp(path.join(tmpdir(), "ftw-ralph-timeout-"));
  const providerConfig: RalphProvidersFile = {
    schemaVersion: 1,
    defaultProviderOrder: ["claude", "codex"],
    providers: {
      claude: {
        command: "bash",
        args: ["-lc", "sleep 5"],
        timeoutMs: 100,
      },
      codex: {
        command: "codex",
        args: ["exec", "-s", "read-only", "-C", "{{rootDir}}", "-"],
      },
    },
  };

  const execution = await executeProvider(
    "claude",
    "ignored",
    {
      rootDir: "/repo/root",
      companySlug: "fixtureco",
      taskId: "company-sync",
      runDir,
    },
    providerConfig,
  );

  expect(execution.exitCode).toBe(124);
  expect(execution.timedOut).toBe(true);
  expect(execution.stderr).toContain("timed out");
});

test("isBundleStale flags aged bundles and keeps fresh bundles current", () => {
  const bundle = makeBundle("2026-01-01");
  const freshBundle = makeBundle("2026-03-10");
  const now = new Date("2026-03-15T00:00:00Z");

  expect(isBundleStale(bundle, now)).toBe(true);
  expect(isBundleStale(freshBundle, now)).toBe(false);
});

test("collectSyncTargets supports published, all, and stale batch targets", () => {
  const staleBundle = makeBundle("2026-01-01");
  const freshBundle = makeBundle("2026-03-10");
  const raw = {
    regions: [],
    indices: [],
    sectors: [],
    industries: [],
    technologyWaves: [],
    conceptAngles: [],
    manifests: [
      {
        schemaVersion: 1,
        slug: "fixtureco",
        name: "FixtureCo",
        ticker: "FIX",
        regionId: "us",
        indexIds: ["sp500-top10"],
        sectorId: "information-technology",
        industryId: "software-cloud",
        companiesMarketCapUrl: "https://example.com/fixtureco",
        description: "Fixture company",
        technologyWaveIds: [],
      },
      {
        schemaVersion: 1,
        slug: "freshco",
        name: "FreshCo",
        ticker: "FRS",
        regionId: "us",
        indexIds: ["sp500-top10"],
        sectorId: "information-technology",
        industryId: "software-cloud",
        companiesMarketCapUrl: "https://example.com/freshco",
        description: "Fresh company",
        technologyWaveIds: [],
      },
      {
        schemaVersion: 1,
        slug: "unpublishedco",
        name: "UnpublishedCo",
        ticker: "UNP",
        regionId: "us",
        indexIds: ["sp500-top10"],
        sectorId: "information-technology",
        industryId: "software-cloud",
        companiesMarketCapUrl: "https://example.com/unpublishedco",
        description: "Unpublished company",
        technologyWaveIds: [],
      },
    ],
    bundles: [
      staleBundle,
      { ...freshBundle, company: { ...freshBundle.company, slug: "freshco" } },
    ],
    implementationPrompts: [],
    sources: [],
  } satisfies Parameters<typeof collectSyncTargets>[0];

  expect(collectSyncTargets(raw, "published")).toEqual(["fixtureco", "freshco"]);
  expect(collectSyncTargets(raw, "all")).toEqual(["fixtureco", "freshco", "unpublishedco"]);
  expect(collectSyncTargets(raw, "stale")).toEqual(["fixtureco", "unpublishedco"]);
});

function makeBundle(lastReviewedOn: string): CompanyBundle {
  return {
    schemaVersion: 1,
    company: {
      slug: "fixtureco",
      name: "FixtureCo",
      ticker: "FIX",
      rankApprox: 1,
      maybeIpo: null,
      regionId: "us",
      indexIds: ["sp500-top10"],
      sectorId: "information-technology",
      industryId: "software-cloud",
      companiesMarketCapUrl: "https://example.com/fixtureco",
      description: "Fixture company",
      overview: [],
      moatNarrative: [],
      decentralizationNarrative: [],
      sourceIds: ["fixture-source"],
      technologyWaveIds: ["bitcoin-native-coordination"],
      snapshotNote: "Fixture snapshot",
      inputMetrics: {
        moat: metric(lastReviewedOn),
        decentralizability: metric(lastReviewedOn),
        profitability: metric(lastReviewedOn),
        peRatio: metric(lastReviewedOn),
        marketCap: metric(lastReviewedOn),
      },
    },
    products: [],
  };
}

function metric(lastReviewedOn: string) {
  return {
    value: 1,
    rationale: "Fixture metric rationale",
    sourceIds: ["fixture-source"],
    confidence: "high" as const,
    lastReviewedOn,
  };
}
