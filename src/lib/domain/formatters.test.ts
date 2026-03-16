import { expect, test } from "bun:test";
import { formatCompanyMetric } from "~/lib/domain/formatters";
import type { MetricAssessment } from "~/lib/domain/types";

function assessment(value: number): MetricAssessment {
  return {
    value,
    rationale: "test",
    sourceIds: ["test-source"],
    confidence: "high",
    lastReviewedOn: "2026-03-16",
  };
}

test("formatCompanyMetric renders IPO metrics with the expected display format", () => {
  expect(formatCompanyMetric("ipoMarketCap", assessment(1_200_000_000))).toBe("$1.2B");
  expect(formatCompanyMetric("ipoReturnMultiplier", assessment(3102.1))).toBe("3,102.1x");
  expect(formatCompanyMetric("ipoAnnualizedGrowthRate", assessment(0.194))).toBe("19.4%");
});

test("formatCompanyMetric renders missing company metrics as an em dash", () => {
  expect(formatCompanyMetric("ipoMarketCap")).toBe("—");
});
