import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CompanyBundle,
  ImplementationPromptArtifact,
  ImplementationPromptsPayload,
  LoadedImplementationPromptArtifact,
} from "../../src/lib/domain/content-types";
import type { SourceCitation, TechnologyWave } from "../../src/lib/domain/types";

interface ParsedImplementationPromptFile {
  frontmatter: Record<string, string>;
  body: string;
  issues: string[];
}

export async function readImplementationPromptArtifacts(
  implementationPromptsRoot: string,
): Promise<LoadedImplementationPromptArtifact[]> {
  const directoryEntries = await readDirectoryIfExists(implementationPromptsRoot);
  const promptArtifacts: LoadedImplementationPromptArtifact[] = [];

  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const sourceFile = path.join(implementationPromptsRoot, entry.name, "PROMPT.md");
    const maybePromptContents = await readTextFileIfExists(sourceFile);
    if (maybePromptContents === null) {
      continue;
    }

    const parsed = parseImplementationPromptFile(maybePromptContents);
    const productSlug = parsed.frontmatter.productSlug ?? entry.name;
    const companySlug = parsed.frontmatter.companySlug ?? "";
    const generatedOn = parsed.frontmatter.generatedOn ?? "";
    const issues = [...parsed.issues];

    if (productSlug !== entry.name) {
      issues.push(
        `Implementation prompt directory ${entry.name} does not match frontmatter productSlug ${productSlug}.`,
      );
    }

    promptArtifacts.push({
      productSlug,
      companySlug,
      generatedOn,
      markdown: parsed.body,
      sourceFile,
      issues,
    });
  }

  return promptArtifacts.sort((left, right) => left.productSlug.localeCompare(right.productSlug));
}

export function serializeImplementationPromptFile(prompt: ImplementationPromptArtifact) {
  return [
    "---",
    `productSlug: ${prompt.productSlug}`,
    `companySlug: ${prompt.companySlug}`,
    `generatedOn: ${prompt.generatedOn}`,
    "---",
    "",
    prompt.markdown.trim(),
    "",
  ].join("\n");
}

export async function generateImplementationPromptsPayload(options: {
  bundle: CompanyBundle;
  sources: SourceCitation[];
  allTechnologyWaves: TechnologyWave[];
  templateFile: string;
  generatedOn?: string;
}): Promise<ImplementationPromptsPayload> {
  const template = await readFile(options.templateFile, "utf8");
  const sourceById = new Map(options.sources.map((source) => [source.id, source]));
  const waveById = new Map(options.allTechnologyWaves.map((wave) => [wave.id, wave]));
  const generatedOn = options.generatedOn ?? new Date().toISOString().slice(0, 10);

  return {
    schemaVersion: 1,
    companySlug: options.bundle.company.slug,
    prompts: options.bundle.products.map((product) => {
      const relevantWaveIds = [
        ...new Set([...options.bundle.company.technologyWaveIds, ...product.technologyWaveIds]),
      ];
      const relevantWaves = relevantWaveIds
        .map((waveId) => waveById.get(waveId))
        .filter((wave): wave is TechnologyWave => Boolean(wave));
      const relevantSources = collectProductSources(options.bundle, product.slug, sourceById);

      return {
        productSlug: product.slug,
        companySlug: options.bundle.company.slug,
        generatedOn,
        markdown: applyTemplate(template, {
          companyName: options.bundle.company.name,
          companyTicker: options.bundle.company.ticker,
          companySlug: options.bundle.company.slug,
          companyDescription: options.bundle.company.description,
          companyOverview: formatOverviewSections(options.bundle.company.overview),
          moatNarrative: formatBullets(
            options.bundle.company.moatNarrative,
            "No moat narrative is currently stored.",
          ),
          decentralizationNarrative: formatBullets(
            options.bundle.company.decentralizationNarrative,
            "No decentralization narrative is currently stored.",
          ),
          productName: product.name,
          productSlug: product.slug,
          productCategory: product.category,
          productHomepageUrl: product.homepageUrl,
          productSummary: product.summary,
          productWhyItMatters: product.whyItMatters,
          replacementSketch: formatBullets(
            product.replacementSketch,
            "No replacement sketch is currently stored.",
          ),
          alternatives: formatAlternativeBullets(product.alternatives),
          technologyWaves: formatTechnologyWaveBullets(relevantWaves),
          primarySources: formatSourceBullets(relevantSources),
        }),
      } satisfies ImplementationPromptArtifact;
    }),
  };
}

export async function writeImplementationPromptPayload(
  implementationPromptsRoot: string,
  payload: ImplementationPromptsPayload,
  options: { obsoleteProductSlugs?: string[] } = {},
) {
  await mkdir(implementationPromptsRoot, { recursive: true });

  for (const obsoleteProductSlug of options.obsoleteProductSlugs ?? []) {
    await rm(path.join(implementationPromptsRoot, obsoleteProductSlug), {
      recursive: true,
      force: true,
    });
  }

  for (const prompt of payload.prompts) {
    const promptDir = path.join(implementationPromptsRoot, prompt.productSlug);
    await mkdir(promptDir, { recursive: true });
    await writeFile(
      path.join(promptDir, "PROMPT.md"),
      serializeImplementationPromptFile(prompt),
      "utf8",
    );
  }
}

function applyTemplate(template: string, variables: Record<string, string>) {
  return Object.entries(variables).reduce((resolvedTemplate, [key, value]) => {
    return resolvedTemplate.replaceAll(`{{${key}}}`, value);
  }, template);
}

function collectProductSources(
  bundle: CompanyBundle,
  productSlug: string,
  sourceById: Map<string, SourceCitation>,
) {
  const product = bundle.products.find((entry) => entry.slug === productSlug);
  if (!product) {
    return [];
  }

  const referencedSourceIds = new Set<string>(bundle.company.sourceIds);
  for (const sourceId of product.sourceIds) {
    referencedSourceIds.add(sourceId);
  }

  for (const alternative of product.alternatives) {
    for (const sourceId of alternative.sourceIds) {
      referencedSourceIds.add(sourceId);
    }

    for (const metric of Object.values(alternative.metrics)) {
      for (const sourceId of metric.sourceIds) {
        referencedSourceIds.add(sourceId);
      }
    }
  }

  return [...referencedSourceIds]
    .map((sourceId) => sourceById.get(sourceId))
    .filter((source): source is SourceCitation => Boolean(source))
    .sort((left, right) => left.title.localeCompare(right.title));
}

function formatAlternativeBullets(
  productAlternatives: CompanyBundle["products"][number]["alternatives"],
) {
  if (productAlternatives.length === 0) {
    return "- No mature alternative is already in the registry. Research net-new protocol, open-source, cooperative, or decentralized approaches before locking implementation scope.";
  }

  return productAlternatives
    .map((alternative) => {
      const repoLabel = alternative.repoUrl ? ` Repo: ${alternative.repoUrl}.` : "";
      const homepageLabel = alternative.homepageUrl ? ` Homepage: ${alternative.homepageUrl}.` : "";
      return `- ${alternative.name} (${alternative.kind}): ${alternative.summary}.${homepageLabel}${repoLabel}`.trim();
    })
    .join("\n");
}

function formatBullets(values: string[], fallback: string) {
  return values.length > 0 ? values.map((value) => `- ${value}`).join("\n") : fallback;
}

function formatOverviewSections(sections: CompanyBundle["company"]["overview"]) {
  if (sections.length === 0) {
    return "No overview sections are currently stored.";
  }

  return sections
    .map((section) => {
      const paragraphs = section.paragraphs.map((paragraph) => `  ${paragraph}`).join("\n");
      return `- ${section.title}\n${paragraphs}`;
    })
    .join("\n");
}

function formatSourceBullets(relevantSources: SourceCitation[]) {
  if (relevantSources.length === 0) {
    return "- No sources are currently attached. Research primary sources before implementation.";
  }

  return relevantSources
    .map(
      (source) =>
        `- ${source.title} (${source.publisher}) - ${source.url}\n  Why it matters: ${source.note}`,
    )
    .join("\n");
}

function formatTechnologyWaveBullets(relevantWaves: TechnologyWave[]) {
  if (relevantWaves.length === 0) {
    return "- No technology waves are currently attached. Identify the enabling waves before implementation.";
  }

  return relevantWaves.map((wave) => `- ${wave.label}: ${wave.summary}`).join("\n");
}

function parseImplementationPromptFile(rawPrompt: string): ParsedImplementationPromptFile {
  const trimmedPrompt = rawPrompt.trim();
  if (!trimmedPrompt.startsWith("---\n")) {
    return {
      frontmatter: {},
      body: trimmedPrompt,
      issues: ["Implementation prompt is missing frontmatter."],
    };
  }

  const closingDelimiterIndex = trimmedPrompt.indexOf("\n---\n", 4);
  if (closingDelimiterIndex < 0) {
    return {
      frontmatter: {},
      body: trimmedPrompt,
      issues: ["Implementation prompt frontmatter is not properly closed."],
    };
  }

  const frontmatterBlock = trimmedPrompt.slice(4, closingDelimiterIndex);
  const body = trimmedPrompt.slice(closingDelimiterIndex + 5).trim();
  const frontmatter: Record<string, string> = {};
  const issues: string[] = [];

  for (const line of frontmatterBlock.split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) {
      issues.push(`Implementation prompt frontmatter line is invalid: ${line}`);
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!key || !value) {
      issues.push(`Implementation prompt frontmatter line is incomplete: ${line}`);
      continue;
    }

    frontmatter[key] = value;
  }

  for (const requiredField of ["productSlug", "companySlug", "generatedOn"] as const) {
    if (!frontmatter[requiredField]) {
      issues.push(`Implementation prompt frontmatter is missing ${requiredField}.`);
    }
  }

  if (!body) {
    issues.push("Implementation prompt body is empty.");
  }

  return {
    frontmatter,
    body,
    issues,
  };
}

async function readDirectoryIfExists(targetDir: string) {
  try {
    return await readdir(targetDir, { withFileTypes: true });
  } catch (error) {
    if (isMissingPathError(error)) {
      return [];
    }

    throw error;
  }
}

async function readTextFileIfExists(targetFile: string) {
  try {
    return await readFile(targetFile, "utf8");
  } catch (error) {
    if (isMissingPathError(error)) {
      return null;
    }

    throw error;
  }
}

function isMissingPathError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}
