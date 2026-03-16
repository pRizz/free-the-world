import path from "node:path";
import type { UnverifiedCompanyRequest } from "../../src/lib/domain/content-types";
import { readJsonFile, unverifiedManifestsDir, writeJsonFile } from "./content";

export function getUnverifiedRequestFile(requestId: string, manifestDir = unverifiedManifestsDir) {
  return path.join(manifestDir, `${requestId}.json`);
}

export async function readUnverifiedCompanyRequest(
  requestId: string,
  manifestDir = unverifiedManifestsDir,
) {
  const rawRequest = await readJsonFile<Partial<UnverifiedCompanyRequest>>(
    getUnverifiedRequestFile(requestId, manifestDir),
  );
  const request = {
    alreadyResearchedMode: "skip",
    ...rawRequest,
  } as UnverifiedCompanyRequest;
  validateUnverifiedCompanyRequest(request, requestId);
  return request;
}

export async function writeUnverifiedCompanyRequest(
  request: UnverifiedCompanyRequest,
  manifestDir = unverifiedManifestsDir,
) {
  validateUnverifiedCompanyRequest(request, request.requestId);
  await writeJsonFile(getUnverifiedRequestFile(request.requestId, manifestDir), request);
}

function validateUnverifiedCompanyRequest(
  request: UnverifiedCompanyRequest,
  expectedRequestId: string,
) {
  if (request.schemaVersion !== 1) {
    throw new Error(
      `Unverified request ${expectedRequestId} has unsupported schemaVersion ${String(request.schemaVersion)}.`,
    );
  }

  if (request.requestId !== expectedRequestId) {
    throw new Error(
      `Unverified request file ${expectedRequestId} does not match nested requestId ${request.requestId}.`,
    );
  }
}
