import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { companies } from "../src/lib/content/companies";
import { products } from "../src/lib/content/products";
import { technologyWaves } from "../src/lib/content/technology-waves";
import type { PromptTaskDefinition } from "../src/lib/domain/types";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const promptsDir = path.join(rootDir, "prompts");
const researchDir = path.join(rootDir, "research", "generated");

const promptTasks: PromptTaskDefinition[] = [
  {
    id: "company-overview",
    label: "Company overview synthesis",
    templateFile: "company-overview.md",
    outputSuffix: "overview",
  },
  {
    id: "moat-analysis",
    label: "Moat analysis",
    templateFile: "moat-analysis.md",
    outputSuffix: "moat",
  },
  {
    id: "decentralization-analysis",
    label: "Decentralization analysis",
    templateFile: "decentralization-analysis.md",
    outputSuffix: "decentralization",
  },
  {
    id: "product-alternatives",
    label: "Product alternatives scan",
    templateFile: "product-alternatives.md",
    outputSuffix: "alternatives",
  },
  {
    id: "source-gathering",
    label: "Source gathering",
    templateFile: "source-gathering.md",
    outputSuffix: "sources",
  },
];

const args = parseArgs(process.argv.slice(2));
const requestedCompanySlugs = parseList(args.company ?? args.companies);
const requestedTaskIds = parseList(args.task ?? args.tasks);
const providerPreference = (args.provider ?? "auto") as "auto" | "claude" | "codex";
const shouldExecute = args.execute === "true" || args.execute === "1";

const selectedCompanies =
  requestedCompanySlugs.length > 0
    ? requestedCompanySlugs.map(companySlug => {
        const company = companies.find(entry => entry.slug === companySlug);
        if (!company) {
          throw new Error(`Unknown company slug: ${companySlug}`);
        }
        return company;
      })
    : companies;

const selectedTasks =
  requestedTaskIds.length > 0
    ? requestedTaskIds.map(taskId => {
        const task = promptTasks.find(entry => entry.id === taskId);
        if (!task) {
          throw new Error(`Unknown task id: ${taskId}`);
        }
        return task;
      })
    : promptTasks;

const providerAvailability = detectProviders();

for (const company of selectedCompanies) {
  const companyProducts = products.filter(product => product.companySlug === company.slug);
  const relevantWaves = technologyWaves.filter(wave => company.technologyWaveIds.includes(wave.id));
  const companyDir = path.join(researchDir, company.slug);
  await mkdir(companyDir, { recursive: true });

  for (const task of selectedTasks) {
    const template = await readFile(path.join(promptsDir, task.templateFile), "utf8");
    const promptText = applyTemplate(template, {
      companyName: company.name,
      companySlug: company.slug,
      ticker: company.ticker,
      sectorId: company.sectorId,
      industryId: company.industryId,
      description: company.description,
      snapshotNote: company.snapshotNote,
      productNames: companyProducts.map(product => product.name).join(", "),
      technologyWaves: relevantWaves.map(wave => `- ${wave.label}: ${wave.summary}`).join("\n"),
      companyDataJson: JSON.stringify(
        {
          company,
          products: companyProducts,
          technologyWaves: relevantWaves,
        },
        null,
        2
      ),
    });

    const promptFile = path.join(companyDir, `${task.outputSuffix}.prompt.md`);
    const outputFile = path.join(companyDir, `${task.outputSuffix}.draft.md`);
    const manifestFile = path.join(companyDir, `${task.outputSuffix}.manifest.json`);

    await writeFile(promptFile, promptText, "utf8");

    const provider = resolveProvider(providerPreference, providerAvailability);
    const manifest = {
      companySlug: company.slug,
      taskId: task.id,
      providerPreference,
      resolvedProvider: provider,
      providerAvailability,
      promptFile: path.relative(rootDir, promptFile),
      outputFile: path.relative(rootDir, outputFile),
      executeRequested: shouldExecute,
      generatedOn: new Date().toISOString(),
    };

    if (!shouldExecute) {
      await writeFile(
        outputFile,
        [
          "# Ralph loop draft",
          "",
          "Execution skipped (`--execute` not provided).",
          "",
          `Prompt file: \`${manifest.promptFile}\``,
          `Preferred provider: \`${providerPreference}\``,
          `Resolved provider: \`${provider ?? "none"}\``,
          "",
          "Use this prompt with your preferred local CLI, review the resulting draft, and only then promote findings into canonical typed site data.",
        ].join("\n"),
        "utf8"
      );
      await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
      continue;
    }

    if (!provider) {
      await writeFile(
        outputFile,
        [
          "# Ralph loop draft",
          "",
          "Execution requested, but no supported provider binary was detected.",
          "",
          "Detected availability:",
          `- claude: ${providerAvailability.claude}`,
          `- codex: ${providerAvailability.codex}`,
          "",
          "Install one of the CLIs locally or provide an explicit provider command template via environment variables.",
        ].join("\n"),
        "utf8"
      );
      await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
      continue;
    }

    const commandTemplate =
      provider === "claude"
        ? process.env.RALPH_LOOP_CLAUDE_COMMAND_TEMPLATE
        : process.env.RALPH_LOOP_CODEX_COMMAND_TEMPLATE;

    if (!commandTemplate) {
      await writeFile(
        outputFile,
        [
          "# Ralph loop draft",
          "",
          `Execution requested for provider \`${provider}\`, but no command template was configured.`,
          "",
          "Set one of these environment variables before running with --execute=true:",
          "- RALPH_LOOP_CLAUDE_COMMAND_TEMPLATE",
          "- RALPH_LOOP_CODEX_COMMAND_TEMPLATE",
          "",
          "Templates may use {{promptFile}}, {{outputFile}}, {{companySlug}}, and {{taskId}} placeholders.",
        ].join("\n"),
        "utf8"
      );
      await writeFile(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
      continue;
    }

    const renderedCommand = applyTemplate(commandTemplate, {
      promptFile,
      outputFile,
      companySlug: company.slug,
      taskId: task.id,
      companyName: company.name,
      ticker: company.ticker,
      sectorId: company.sectorId,
      industryId: company.industryId,
      description: company.description,
      snapshotNote: company.snapshotNote,
      productNames: companyProducts.map(product => product.name).join(", "),
      technologyWaves: relevantWaves.map(wave => `- ${wave.label}: ${wave.summary}`).join("\n"),
      companyDataJson: "",
    });

    const result = Bun.spawnSync({
      cmd: ["bash", "-lc", renderedCommand],
      cwd: rootDir,
      stdout: "pipe",
      stderr: "pipe",
      env: process.env,
    });

    if (result.exitCode !== 0) {
      await writeFile(
        outputFile,
        [
          "# Ralph loop draft",
          "",
          `Provider command failed with exit code ${result.exitCode}.`,
          "",
          "stderr:",
          "```",
          Buffer.from(result.stderr).toString("utf8"),
          "```",
        ].join("\n"),
        "utf8"
      );
    }

    await writeFile(
      manifestFile,
      JSON.stringify(
        {
          ...manifest,
          executedCommand: renderedCommand,
          exitCode: result.exitCode,
        },
        null,
        2
      ),
      "utf8"
    );
  }
}

console.log(
  `Prepared ${selectedCompanies.length * selectedTasks.length} prompt-loop job(s) in ${path.relative(rootDir, researchDir)}`
);

function detectProviders() {
  return {
    claude: commandExists("claude"),
    codex: commandExists("codex"),
  };
}

function resolveProvider(
  provider: "auto" | "claude" | "codex",
  availability: ReturnType<typeof detectProviders>
) {
  if (provider === "claude") {
    return availability.claude ? "claude" : null;
  }

  if (provider === "codex") {
    return availability.codex ? "codex" : null;
  }

  if (availability.claude) {
    return "claude";
  }

  if (availability.codex) {
    return "codex";
  }

  return null;
}

function commandExists(commandName: string) {
  const result = Bun.spawnSync({
    cmd: ["bash", "-lc", `command -v ${commandName}`],
    cwd: rootDir,
    stdout: "ignore",
    stderr: "ignore",
    env: process.env,
  });

  return result.exitCode === 0;
}

function parseArgs(rawArgs: string[]) {
  return rawArgs.reduce<Record<string, string>>((accumulator, currentArg) => {
    if (!currentArg.startsWith("--")) {
      return accumulator;
    }

    const [key, value = "true"] = currentArg.slice(2).split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
}

function parseList(input?: string) {
  if (!input) {
    return [];
  }

  return input
    .split(",")
    .map(entry => entry.trim())
    .filter(Boolean);
}

function applyTemplate(template: string, variables: Record<string, string>) {
  return Object.entries(variables).reduce((resolvedTemplate, [key, value]) => {
    return resolvedTemplate.replaceAll(`{{${key}}}`, value);
  }, template);
}
