import type {
  CompanyManifest,
  ManifestQueueEntry,
  ResearchLoopTarget,
} from "../../src/lib/domain/content-types";
import { loadManifestQueueEntries, loadRawContent, type LoadedRawContent } from "./content";

export async function collectLoopTargets(options: {
  requestedCompanySlugs: string[];
  batchId?: string;
}) {
  const raw = await loadRawContent();
  const queueEntries = options.batchId ? await loadManifestQueueEntries() : [];

  return resolveLoopTargets({
    raw,
    queueEntries,
    requestedCompanySlugs: options.requestedCompanySlugs,
    batchId: options.batchId,
  });
}

export function resolveLoopTargets(options: {
  raw: LoadedRawContent;
  queueEntries: ManifestQueueEntry[];
  requestedCompanySlugs: string[];
  batchId?: string;
}) {
  const { raw, queueEntries, requestedCompanySlugs, batchId } = options;
  return batchId
    ? resolveQueuedLoopTargets(batchId, requestedCompanySlugs, queueEntries)
    : resolveCanonicalLoopTargets(raw.manifests, raw.bundles.map(bundle => bundle.company.slug), requestedCompanySlugs);
}

function resolveCanonicalLoopTargets(
  manifests: CompanyManifest[],
  bundledCompanySlugs: string[],
  requestedCompanySlugs: string[]
) {
  const manifestBySlug = new Map(manifests.map(manifest => [manifest.slug, manifest]));
  const selectedSlugs = requestedCompanySlugs.length > 0 ? requestedCompanySlugs : bundledCompanySlugs;

  return selectedSlugs.map<ResearchLoopTarget>(companySlug => {
    const maybeManifest = manifestBySlug.get(companySlug);
    if (!maybeManifest) {
      throw new Error(
        [
          `Unknown canonical company slug: ${companySlug}.`,
          "Fix: use a slug from content/manifests/companies/, or queue a draft with bun run company:queue --manifest=... --batch-id=....",
        ].join("\n")
      );
    }

    return {
      companySlug,
      targetSource: "canonical",
      manifest: maybeManifest,
    };
  });
}

function resolveQueuedLoopTargets(
  batchId: string,
  requestedCompanySlugs: string[],
  queueEntries: ManifestQueueEntry[]
) {
  const validatedEntries = queueEntries.map(validateQueueEntryForLoop);
  const batchEntries = validatedEntries.filter(entry => entry.batchId === batchId);

  if (batchEntries.length === 0) {
    throw new Error(
      [
        `No queued manifests found for batch ${batchId}.`,
        `Fix: queue draft manifests with bun run company:queue --manifest=... --batch-id=${batchId}.`,
      ].join("\n")
    );
  }

  const seenSlugs = new Set<string>();
  for (const entry of batchEntries) {
    const slug = entry.manifest.slug;
    if (seenSlugs.has(slug)) {
      throw new Error(
        [
          `Queued batch ${batchId} contains duplicate manifest slug ${slug}.`,
          "Fix: remove or rename the duplicate queue entry so each slug appears once per batch.",
        ].join("\n")
      );
    }
    seenSlugs.add(slug);
  }

  const entryBySlug = new Map(batchEntries.map(entry => [entry.manifest.slug, entry]));
  const selectedEntries =
    requestedCompanySlugs.length > 0
      ? requestedCompanySlugs.map(companySlug => {
          const maybeEntry = entryBySlug.get(companySlug);
          if (!maybeEntry) {
            throw new Error(
              [
                `Queued batch ${batchId} does not contain company slug ${companySlug}.`,
                `Fix: use one of the queued batch slugs (${[...entryBySlug.keys()].sort().join(", ")}), or queue ${companySlug} into batch ${batchId}.`,
              ].join("\n")
            );
          }

          return maybeEntry;
        })
      : batchEntries;

  return selectedEntries.map<ResearchLoopTarget>(entry => ({
    companySlug: entry.manifest.slug,
    targetSource: "queued",
    batchId: entry.batchId,
    manifest: entry.manifest,
    queueEntry: entry,
  }));
}

function validateQueueEntryForLoop(entry: ManifestQueueEntry) {
  const slug = entry.manifest?.slug ?? "<unknown>";

  if (entry.schemaVersion !== 1) {
    throw new Error(
      [
        `Queued manifest ${slug} has unsupported schemaVersion ${String(entry.schemaVersion)}.`,
        "Fix: requeue the manifest with bun run company:queue so it is rewritten in the supported format.",
      ].join("\n")
    );
  }

  if (entry.status !== "queued") {
    throw new Error(
      [
        `Queued manifest ${slug} has unsupported status ${String(entry.status)}.`,
        "Fix: replace the malformed queue file by rerunning bun run company:queue --manifest=....",
      ].join("\n")
    );
  }

  if (!entry.createdOn) {
    throw new Error(
      [
        `Queued manifest ${slug} is missing createdOn.`,
        "Fix: replace the malformed queue file by rerunning bun run company:queue --manifest=....",
      ].join("\n")
    );
  }

  if (!entry.manifest) {
    throw new Error(
      [
        `Queued entry ${slug} is missing nested manifest data.`,
        "Fix: replace the malformed queue file by rerunning bun run company:queue --manifest=....",
      ].join("\n")
    );
  }

  return entry;
}
