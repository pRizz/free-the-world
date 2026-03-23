export const homepageInfographicStorageKey = "ftw:last-homepage-infographic";

export function normalizeHomepageInfographicId(
  infographicIds: string[],
  maybeInfographicId: string | null | undefined,
) {
  if (!maybeInfographicId) {
    return null;
  }

  return infographicIds.includes(maybeInfographicId) ? maybeInfographicId : null;
}

export function pickRandomHomepageInfographicId(
  infographicIds: string[],
  maybeExcludedInfographicId?: string | null,
  randomValue = Math.random(),
) {
  if (infographicIds.length === 0) {
    return null;
  }

  const candidateIds =
    infographicIds.length > 1 && maybeExcludedInfographicId
      ? infographicIds.filter((infographicId) => infographicId !== maybeExcludedInfographicId)
      : infographicIds;

  const safeRandomValue = Number.isFinite(randomValue)
    ? Math.max(0, Math.min(0.999999, randomValue))
    : 0;
  const selectedIndex = Math.min(
    candidateIds.length - 1,
    Math.floor(safeRandomValue * candidateIds.length),
  );

  return candidateIds[selectedIndex] ?? candidateIds[0] ?? null;
}
