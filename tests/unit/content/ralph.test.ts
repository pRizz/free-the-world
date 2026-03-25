import { expect, test } from "bun:test";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  collectSyncTargets,
  dedupeCompanySyncPayloadSlugs,
  executeProvider,
  extractClaudeCliResult,
  extractClaudeDebugDiagnostics,
  extractCodexSessionId,
  extractJsonPayload,
  findCodexSessionFile,
  isBundleStale,
  normalizeCompanySyncPayload,
  resolveProviderExecutionPlan,
  resolveProviders,
} from "../../../scripts/lib/ralph";
import type {
  CompanyBundle,
  CompanySyncPayload,
  RalphProvidersFile,
} from "../../../src/lib/domain/content-types";

test("extractJsonPayload parses raw JSON and fenced JSON", () => {
  expect(extractJsonPayload('{"ok":true}')).toEqual({ ok: true });
  expect(extractJsonPayload('```json\n{"ok":true}\n```')).toEqual({ ok: true });
});

test("extractJsonPayload rejects empty output", () => {
  expect(() => extractJsonPayload("   ")).toThrow(/empty output/i);
});

test("normalizeCompanySyncPayload coerces bare maybeIpo date strings to null", () => {
  const payload: CompanySyncPayload = {
    schemaVersion: 1,
    bundle: {
      schemaVersion: 1,
      company: {
        slug: "fixtureco",
        name: "Fixture Co",
        ticker: "FIX",
        rankApprox: 1,
        maybeIpo: "1980-12-12" as never,
        regionId: "us",
        indexIds: ["sp500-top35"],
        sectorId: "information-technology",
        industryId: "software",
        companiesMarketCapUrl: "https://example.com",
        description: "Fixture description.",
        overview: [],
        moatNarrative: [],
        decentralizationNarrative: [],
        sourceIds: ["src-fixture"],
        technologyWaveIds: [],
        snapshotNote: "Snapshot note.",
        inputMetrics: {
          moat: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "high",
            lastReviewedOn: "2026-03-24",
          },
          decentralizability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "high",
            lastReviewedOn: "2026-03-24",
          },
          profitability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "high",
            lastReviewedOn: "2026-03-24",
          },
          peRatio: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "speculative",
            lastReviewedOn: "2026-03-24",
          },
          marketCap: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "medium",
            lastReviewedOn: "2026-03-24",
          },
        },
      },
      products: [],
    },
    sources: [
      {
        id: "src-fixture",
        title: "Fixture source",
        url: "https://example.com/source",
        kind: "analysis",
        publisher: "Fixture Publisher",
        note: "Fixture note.",
        accessedOn: "2026-03-24",
      },
    ],
  };

  const normalized = normalizeCompanySyncPayload(payload);

  expect(normalized.payload.bundle.company.maybeIpo).toBeNull();
  expect(normalized.notes).toEqual([
    'Coerced company.maybeIpo string "1980-12-12" to null because the schema requires an object with date, dateSourceIds, and marketCap.',
  ]);
});

test("normalizeCompanySyncPayload fills omitted product collection fields", () => {
  const payload = {
    schemaVersion: 1,
    bundle: {
      schemaVersion: 1,
      company: {
        slug: "fixtureco",
        name: "Fixture Co",
        ticker: "FIX",
        rankApprox: 1,
        maybeIpo: null,
        regionId: "us",
        indexIds: ["sp500-top35"],
        sectorId: "information-technology",
        industryId: "software",
        companiesMarketCapUrl: "https://example.com",
        description: "Fixture description.",
        overview: [],
        moatNarrative: [],
        decentralizationNarrative: [],
        sourceIds: ["src-fixture"],
        technologyWaveIds: [],
        snapshotNote: "Snapshot note.",
        inputMetrics: {
          moat: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "high",
            lastReviewedOn: "2026-03-24",
          },
          decentralizability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "high",
            lastReviewedOn: "2026-03-24",
          },
          profitability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "high",
            lastReviewedOn: "2026-03-24",
          },
          peRatio: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "speculative",
            lastReviewedOn: "2026-03-24",
          },
          marketCap: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-fixture"],
            confidence: "medium",
            lastReviewedOn: "2026-03-24",
          },
        },
      },
      products: [
        {
          slug: "fixture-product",
          name: "Fixture Product",
          category: "category",
          homepageUrl: "https://example.com/product",
          summary: "summary",
          whyItMatters: "why it matters",
          replacementSketch: [],
          sourceIds: ["src-fixture"],
          technologyWaveIds: [],
        },
      ],
    },
    sources: [
      {
        id: "src-fixture",
        title: "Fixture source",
        url: "https://example.com/source",
        kind: "analysis",
        publisher: "Fixture Publisher",
        note: "Fixture note.",
        accessedOn: "2026-03-24",
      },
    ],
  } as unknown as CompanySyncPayload;

  const normalized = normalizeCompanySyncPayload(payload);

  expect(normalized.payload.bundle.products[0]?.alternatives).toEqual([]);
  expect(normalized.payload.bundle.products[0]?.disruptionConcepts).toEqual([]);
  expect(normalized.payload.bundle.products[0]?.maybeDisruptionException).toBeUndefined();
  expect(normalized.notes).toEqual([
    "Defaulted product fixture-product alternatives to an empty array because the payload omitted the field.",
    "Defaulted product fixture-product disruptionConcepts to an empty array because the payload omitted the field.",
  ]);
});

test("dedupeCompanySyncPayloadSlugs prefixes colliding slugs", () => {
  const existingBundles: CompanyBundle[] = [
    {
      schemaVersion: 1,
      company: {
        slug: "chevron",
        name: "Chevron",
        ticker: "CVX",
        rankApprox: 1,
        maybeIpo: null,
        regionId: "us",
        indexIds: ["sp500-top35"],
        sectorId: "energy",
        industryId: "integrated-oil-gas",
        companiesMarketCapUrl: "https://example.com/chevron",
        description: "Chevron description.",
        overview: [],
        moatNarrative: [],
        decentralizationNarrative: [],
        sourceIds: ["src-chevron"],
        technologyWaveIds: [],
        snapshotNote: "Snapshot note.",
        inputMetrics: {
          moat: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-chevron"],
            confidence: "high",
            lastReviewedOn: "2026-03-25",
          },
          decentralizability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-chevron"],
            confidence: "high",
            lastReviewedOn: "2026-03-25",
          },
          profitability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-chevron"],
            confidence: "high",
            lastReviewedOn: "2026-03-25",
          },
          peRatio: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-chevron"],
            confidence: "speculative",
            lastReviewedOn: "2026-03-25",
          },
          marketCap: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-chevron"],
            confidence: "medium",
            lastReviewedOn: "2026-03-25",
          },
        },
      },
      products: [
        {
          slug: "upstream-production",
          name: "Upstream production",
          category: "category",
          homepageUrl: "https://example.com/upstream",
          summary: "summary",
          whyItMatters: "why",
          replacementSketch: [],
          sourceIds: ["src-chevron"],
          technologyWaveIds: [],
          alternatives: [
            {
              slug: "openevse",
              name: "OpenEVSE",
              kind: "open-source",
              homepageUrl: "https://example.com/openevse",
              summary: "summary",
              metrics: {
                openness: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                decentralizationFit: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                readiness: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                costLeverage: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
              },
              sourceIds: ["src-chevron"],
            },
          ],
          disruptionConcepts: [
            {
              slug: "community-charging-microgrids",
              name: "Community charging microgrids",
              summary: "summary",
              angleIds: ["distributed-energy-generation"],
              thesis: "thesis",
              bitcoinOrDecentralizationRole: "role",
              coordinationMechanism: "coordination",
              verificationOrTrustModel: "trust",
              failureModes: [],
              adoptionPath: [],
              confidence: "medium",
              problemSourceIds: ["src-chevron"],
              enablerSourceIds: ["src-chevron"],
              metrics: {
                decentralizationFit: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                coordinationCredibility: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                implementationFeasibility: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                incumbentPressure: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-chevron"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
              },
            },
          ],
        },
      ],
    },
  ];

  const payload = {
    schemaVersion: 1,
    bundle: {
      schemaVersion: 1,
      company: {
        slug: "exxon-mobil",
        name: "Exxon Mobil",
        ticker: "XOM",
        rankApprox: 1,
        maybeIpo: null,
        regionId: "us",
        indexIds: ["sp500-top35"],
        sectorId: "energy",
        industryId: "integrated-oil-gas",
        companiesMarketCapUrl: "https://example.com/exxon",
        description: "Exxon description.",
        overview: [],
        moatNarrative: [],
        decentralizationNarrative: [],
        sourceIds: ["src-exxon"],
        technologyWaveIds: [],
        snapshotNote: "Snapshot note.",
        inputMetrics: {
          moat: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-exxon"],
            confidence: "high",
            lastReviewedOn: "2026-03-25",
          },
          decentralizability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-exxon"],
            confidence: "high",
            lastReviewedOn: "2026-03-25",
          },
          profitability: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-exxon"],
            confidence: "high",
            lastReviewedOn: "2026-03-25",
          },
          peRatio: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-exxon"],
            confidence: "speculative",
            lastReviewedOn: "2026-03-25",
          },
          marketCap: {
            value: 5,
            rationale: "why",
            sourceIds: ["src-exxon"],
            confidence: "medium",
            lastReviewedOn: "2026-03-25",
          },
        },
      },
      products: [
        {
          slug: "upstream-production",
          name: "Upstream production",
          category: "category",
          homepageUrl: "https://example.com/upstream",
          summary: "summary",
          whyItMatters: "why",
          replacementSketch: [],
          sourceIds: ["src-exxon"],
          technologyWaveIds: [],
          alternatives: [
            {
              slug: "openevse",
              name: "OpenEVSE",
              kind: "open-source",
              homepageUrl: "https://example.com/openevse",
              summary: "summary",
              metrics: {
                openness: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                decentralizationFit: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                readiness: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                costLeverage: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
              },
              sourceIds: ["src-exxon"],
            },
          ],
          disruptionConcepts: [
            {
              slug: "community-charging-microgrids",
              name: "Community charging microgrids",
              summary: "summary",
              angleIds: ["distributed-energy-generation"],
              thesis: "thesis",
              bitcoinOrDecentralizationRole: "role",
              coordinationMechanism: "coordination",
              verificationOrTrustModel: "trust",
              failureModes: [],
              adoptionPath: [],
              confidence: "medium",
              problemSourceIds: ["src-exxon"],
              enablerSourceIds: ["src-exxon"],
              metrics: {
                decentralizationFit: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                coordinationCredibility: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                implementationFeasibility: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
                incumbentPressure: {
                  value: 8,
                  rationale: "why",
                  sourceIds: ["src-exxon"],
                  confidence: "high",
                  lastReviewedOn: "2026-03-25",
                },
              },
            },
          ],
          maybeDisruptionException: undefined,
        },
      ],
    },
    sources: [
      {
        id: "src-exxon",
        title: "Exxon source",
        url: "https://example.com/exxon",
        kind: "analysis",
        publisher: "Exxon Publisher",
        note: "note",
        accessedOn: "2026-03-25",
      },
    ],
  } as CompanySyncPayload;

  const normalized = dedupeCompanySyncPayloadSlugs(payload, existingBundles);

  expect(normalized.payload.bundle.products[0]?.slug).toBe("exxon-mobil-upstream-production");
  expect(normalized.payload.bundle.products[0]?.alternatives[0]?.slug).toBe(
    "exxon-mobil-upstream-production-openevse",
  );
  expect(normalized.payload.bundle.products[0]?.disruptionConcepts[0]?.slug).toBe(
    "exxon-mobil-upstream-production-community-charging-microgrids",
  );
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
