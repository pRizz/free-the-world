import { expect, test } from "bun:test";
import { calculateIpoAnnualizedGrowthRate, calculateIpoReturnMultiplier, calculateYearsSinceIpo, deriveIpoMetrics } from "~/lib/domain/ipo";
import type { CompanyIpo, MetricAssessment } from "~/lib/domain/types";

function makeAssessment(value: number, lastReviewedOn = "2026-03-14"): MetricAssessment {
  return {
    value,
    rationale: "test",
    sourceIds: ["test-source"],
    confidence: "high",
    lastReviewedOn,
  };
}

function makeIpo(overrides: Partial<CompanyIpo> = {}): CompanyIpo {
  return {
    date: "2000-01-01",
    dateSourceIds: ["ipo-date"],
    marketCap: makeAssessment(100),
    ...overrides,
  };
}

test("calculateIpoReturnMultiplier divides current market cap by IPO market cap", () => {
  // Arrange
  const currentMarketCap = 500;
  const ipoMarketCap = 125;

  // Act
  const result = calculateIpoReturnMultiplier(currentMarketCap, ipoMarketCap);

  // Assert
  expect(result).toBe(4);
});

test("deriveIpoMetrics computes the IPO multiplier and CAGR for valid IPO data", () => {
  // Arrange
  const maybeIpo = makeIpo();
  const currentMarketCap = makeAssessment(1_600);

  // Act
  const result = deriveIpoMetrics(maybeIpo, currentMarketCap);

  // Assert
  expect(result.ipoMarketCap?.value).toBe(100);
  expect(result.ipoReturnMultiplier?.value).toBe(16);
  expect(result.ipoAnnualizedGrowthRate?.value).toBeCloseTo(0.1116, 4);
});

test("calculateYearsSinceIpo returns null for invalid or same-day dates", () => {
  // Arrange
  const invalidIpoDate = "not-a-date";
  const sameDay = "2026-03-14";

  // Act
  const invalidDateResult = calculateYearsSinceIpo(invalidIpoDate, "2026-03-14");
  const sameDayResult = calculateYearsSinceIpo(sameDay, sameDay);

  // Assert
  expect(invalidDateResult).toBeNull();
  expect(sameDayResult).toBeNull();
});

test("calculateIpoAnnualizedGrowthRate returns null for invalid return multipliers or durations", () => {
  // Arrange
  const invalidMultiplier = 0;
  const invalidDuration = 0;

  // Act
  const invalidMultiplierResult = calculateIpoAnnualizedGrowthRate(invalidMultiplier, 10);
  const invalidDurationResult = calculateIpoAnnualizedGrowthRate(2, invalidDuration);

  // Assert
  expect(invalidMultiplierResult).toBeNull();
  expect(invalidDurationResult).toBeNull();
});

test("deriveIpoMetrics returns no IPO-derived metrics when IPO data is missing", () => {
  // Arrange
  const currentMarketCap = makeAssessment(1_600);

  // Act
  const result = deriveIpoMetrics(null, currentMarketCap);

  // Assert
  expect(result).toEqual({});
});
