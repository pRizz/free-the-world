import { rm } from "node:fs/promises";
import path from "node:path";
import type {
  CompanyManifest,
  ManifestQueueEntry,
  ManifestQueueStatus,
} from "../../src/lib/domain/content-types";
import {
  loadManifestQueueEntries,
  loadRawContent,
  manifestsDir,
  queueManifestsDir,
  readJsonFile,
  validateAndCompile,
  writeJsonFile,
} from "./content";

export interface QueueManifestOptions {
  manifest: CompanyManifest;
  batchId?: string;
  groupLabel?: string;
  requestNotes?: string;
  createdOn?: string;
  status?: ManifestQueueStatus;
}

export interface PromoteManifestResult {
  manifest: CompanyManifest;
  targetFile: string;
}

export interface PromoteQueuedManifestResult extends PromoteManifestResult {
  queueEntry: ManifestQueueEntry;
  queueFile: string;
}

export function getManifestFile(slug: string) {
  return path.join(manifestsDir, `${slug}.json`);
}

export function getQueuedManifestFile(slug: string) {
  return path.join(queueManifestsDir, `${slug}.json`);
}

export async function queueManifestFromFile(manifestPath: string, options: Omit<QueueManifestOptions, "manifest"> = {}) {
  const manifest = await readJsonFile<CompanyManifest>(manifestPath);
  return queueManifest({ manifest, ...options });
}

export async function queueManifest(options: QueueManifestOptions) {
  const raw = await loadRawContent();
  const queuedEntries = await loadManifestQueueEntries();
  for (const queuedEntry of queuedEntries) {
    validateQueueEntry(queuedEntry, queuedEntry.manifest?.slug ?? "<unknown>");
  }
  assertQueueCandidateIsAvailable(options.manifest.slug, raw.manifests, queuedEntries);

  validateAndCompile({
    ...raw,
    manifests: [...raw.manifests, options.manifest],
  });

  const queueEntry: ManifestQueueEntry = {
    schemaVersion: 1,
    status: options.status ?? "queued",
    createdOn: options.createdOn ?? new Date().toISOString(),
    batchId: options.batchId,
    groupLabel: options.groupLabel,
    requestNotes: options.requestNotes,
    manifest: options.manifest,
  };

  await writeJsonFile(getQueuedManifestFile(options.manifest.slug), queueEntry);
  return queueEntry;
}

export async function readQueuedManifestEntry(slug: string) {
  const queueEntry = await readJsonFile<ManifestQueueEntry>(getQueuedManifestFile(slug));
  validateQueueEntry(queueEntry, slug);
  return queueEntry;
}

export async function promoteQueuedManifest(slug: string): Promise<PromoteQueuedManifestResult> {
  const queueEntry = await readQueuedManifestEntry(slug);
  if (queueEntry.manifest.slug !== slug) {
    throw new Error(`Queued manifest ${slug} does not match nested manifest slug ${queueEntry.manifest.slug}.`);
  }

  const raw = await loadRawContent();
  if (raw.manifests.some(manifest => manifest.slug === slug)) {
    throw new Error(`Canonical manifest ${slug} already exists.`);
  }

  validateAndCompile({
    ...raw,
    manifests: [...raw.manifests, queueEntry.manifest],
  });

  const result = await promoteManifest(queueEntry.manifest);
  await rm(getQueuedManifestFile(slug));

  return {
    ...result,
    queueEntry,
    queueFile: getQueuedManifestFile(slug),
  };
}

export async function promoteManifest(manifest: CompanyManifest): Promise<PromoteManifestResult> {
  const raw = await loadRawContent();

  validateAndCompile({
    ...raw,
    manifests: [...raw.manifests.filter(entry => entry.slug !== manifest.slug), manifest],
  });

  const targetFile = getManifestFile(manifest.slug);
  await writeJsonFile(targetFile, manifest);
  return { manifest, targetFile };
}

function assertQueueCandidateIsAvailable(
  slug: string,
  canonicalManifests: CompanyManifest[],
  queuedEntries: ManifestQueueEntry[]
) {
  if (canonicalManifests.some(manifest => manifest.slug === slug)) {
    throw new Error(`Canonical manifest ${slug} already exists.`);
  }

  if (queuedEntries.some(entry => entry.manifest.slug === slug)) {
    throw new Error(`Queued manifest ${slug} already exists.`);
  }
}

function validateQueueEntry(queueEntry: ManifestQueueEntry, expectedSlug: string) {
  if (queueEntry.schemaVersion !== 1) {
    throw new Error(`Queued manifest ${expectedSlug} has unsupported schemaVersion ${String(queueEntry.schemaVersion)}.`);
  }

  if (queueEntry.status !== "queued") {
    throw new Error(`Queued manifest ${expectedSlug} has unsupported status ${String(queueEntry.status)}.`);
  }

  if (!queueEntry.createdOn) {
    throw new Error(`Queued manifest ${expectedSlug} is missing createdOn.`);
  }

  if (!queueEntry.manifest) {
    throw new Error(`Queued manifest ${expectedSlug} is missing nested manifest data.`);
  }
}
