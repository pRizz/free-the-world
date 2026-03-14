import {
  type AlternativeMetricId,
  type CompanyMetricId,
  type MetricAssessment,
  type MetricValueType,
} from "~/lib/domain/types";
import { alternativeMetricDefinitions, companyMetricDefinitions } from "~/lib/domain/metrics";

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const preciseCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const abbreviatedNumberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

export function formatMetricValue(value: number, valueType: MetricValueType, precision = 1) {
  if (valueType === "currency") {
    return compactCurrencyFormatter.format(value);
  }

  if (valueType === "percentage") {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    }).format(value);
  }

  if (valueType === "ratio") {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    }).format(value)}x`;
  }

  return `${value.toFixed(precision)}/10`;
}

export function formatMoneyRange(value: number) {
  if (value >= 1_000_000_000_000) {
    return `$${abbreviatedNumberFormatter.format(value / 1_000_000_000_000)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${abbreviatedNumberFormatter.format(value / 1_000_000_000)}B`;
  }

  return preciseCurrencyFormatter.format(value);
}

export function formatCompanyMetric(metricId: CompanyMetricId, assessment?: MetricAssessment) {
  if (!assessment) {
    return "—";
  }

  const definition = companyMetricDefinitions[metricId];
  return formatMetricValue(assessment.value, definition.valueType, definition.precision);
}

export function formatAlternativeMetric(metricId: AlternativeMetricId, assessment: MetricAssessment) {
  const definition = alternativeMetricDefinitions[metricId];
  return formatMetricValue(assessment.value, definition.valueType, definition.precision);
}
