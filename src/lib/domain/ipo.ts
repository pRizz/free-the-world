import type { CompanyIpo, CompanyMetricId, MetricAssessment } from "~/lib/domain/types";

const millisecondsPerDay = 24 * 60 * 60 * 1000;
const meanDaysPerYear = 365.2425;

function uniqueSourceIds(...sourceIdLists: string[][]) {
  return [...new Set(sourceIdLists.flat())];
}

function parseIsoDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function calculateIpoReturnMultiplier(currentMarketCap: number, ipoMarketCap: number) {
  if (
    !Number.isFinite(currentMarketCap) ||
    !Number.isFinite(ipoMarketCap) ||
    currentMarketCap <= 0 ||
    ipoMarketCap <= 0
  ) {
    return null;
  }

  return currentMarketCap / ipoMarketCap;
}

export function calculateYearsSinceIpo(ipoDate: string, snapshotDate: string) {
  const maybeIpoDate = parseIsoDate(ipoDate);
  const maybeSnapshotDate = parseIsoDate(snapshotDate);

  if (!maybeIpoDate || !maybeSnapshotDate) {
    return null;
  }

  const millisecondsDiff = maybeSnapshotDate.getTime() - maybeIpoDate.getTime();
  if (millisecondsDiff <= 0) {
    return null;
  }

  return millisecondsDiff / millisecondsPerDay / meanDaysPerYear;
}

export function calculateIpoAnnualizedGrowthRate(returnMultiplier: number, yearsSinceIpo: number) {
  if (
    !Number.isFinite(returnMultiplier) ||
    !Number.isFinite(yearsSinceIpo) ||
    returnMultiplier <= 0 ||
    yearsSinceIpo <= 0
  ) {
    return null;
  }

  return returnMultiplier ** (1 / yearsSinceIpo) - 1;
}

export function deriveIpoMetrics(
  maybeIpo: CompanyIpo | null,
  currentMarketCap: MetricAssessment,
): Partial<
  Record<
    Extract<CompanyMetricId, "ipoMarketCap" | "ipoReturnMultiplier" | "ipoAnnualizedGrowthRate">,
    MetricAssessment
  >
> {
  if (!maybeIpo) {
    return {};
  }

  const returnMultiplier = calculateIpoReturnMultiplier(
    currentMarketCap.value,
    maybeIpo.marketCap.value,
  );
  const yearsSinceIpo = calculateYearsSinceIpo(maybeIpo.date, currentMarketCap.lastReviewedOn);

  if (returnMultiplier === null || yearsSinceIpo === null) {
    return {};
  }

  const annualizedGrowthRate = calculateIpoAnnualizedGrowthRate(returnMultiplier, yearsSinceIpo);
  if (annualizedGrowthRate === null) {
    return {};
  }

  const sourceIds = uniqueSourceIds(maybeIpo.marketCap.sourceIds, currentMarketCap.sourceIds);

  return {
    ipoMarketCap: maybeIpo.marketCap,
    ipoReturnMultiplier: {
      value: returnMultiplier,
      rationale: `Current market cap divided by the IPO market cap implied on ${maybeIpo.date}.`,
      sourceIds,
      confidence: maybeIpo.marketCap.confidence,
      lastReviewedOn: currentMarketCap.lastReviewedOn,
    },
    ipoAnnualizedGrowthRate: {
      value: annualizedGrowthRate,
      rationale: `Compound annual market cap growth from the IPO date ${maybeIpo.date} through the snapshot date ${currentMarketCap.lastReviewedOn}.`,
      sourceIds,
      confidence: maybeIpo.marketCap.confidence,
      lastReviewedOn: currentMarketCap.lastReviewedOn,
    },
  };
}
