import type {
  CompanyIntakeAlreadyResearchedMode,
  UnverifiedCompanyRequest,
} from "../../src/lib/domain/content-types";
import { createRunId } from "./ralph";

export function parseRawCompanyItems(rawInput: string) {
  return rawInput
    .split(/\r?\n/)
    .flatMap((line) => {
      const cleanedLine = line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, "").trim();
      if (!cleanedLine) {
        return [];
      }

      return cleanedLine
        .split(",")
        .map((entry) => entry.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    })
    .filter(Boolean);
}

export function createUnverifiedCompanyRequest(options: {
  rawInput: string;
  rawItems: string[];
  requestId?: string;
  batchId?: string;
  groupLabel?: string;
  alreadyResearchedMode?: CompanyIntakeAlreadyResearchedMode;
  requestNotes?: string;
}): UnverifiedCompanyRequest {
  const requestId = options.requestId ?? `company-intake-${createRunId()}`;
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    requestId,
    status: "pending",
    createdOn: now,
    updatedOn: now,
    rawInput: options.rawInput,
    rawItems: options.rawItems,
    batchId: options.batchId?.trim() || requestId,
    groupLabel: options.groupLabel?.trim() || defaultGroupLabel(options.rawItems),
    alreadyResearchedMode: options.alreadyResearchedMode ?? "skip",
    requestNotes: normalizeOptional(options.requestNotes),
    preparedCandidates: [],
    skippedItems: [],
    queuedSlugs: [],
    promotedSlugs: [],
    completedCompanySlugs: [],
    lastLoopRunDirs: [],
    lastSyncRunDirs: [],
  };
}

function defaultGroupLabel(rawItems: string[]) {
  if (rawItems.length === 1) {
    return `Autonomous intake: ${rawItems[0]}`;
  }

  return `Autonomous company intake (${rawItems.length} items)`;
}

function normalizeOptional(value?: string) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}
