import type { Company, CompanyMetricId } from "~/lib/domain/types";

export function getCompanyMetricValue(company: Company, metricId: CompanyMetricId) {
  return company.metrics[metricId]?.value ?? null;
}

export function compareCompaniesByMetric(
  left: Company,
  right: Company,
  metricId: CompanyMetricId,
  direction: "asc" | "desc",
) {
  const leftValue = getCompanyMetricValue(left, metricId);
  const rightValue = getCompanyMetricValue(right, metricId);

  if (leftValue === null && rightValue === null) {
    return 0;
  }

  if (leftValue === null) {
    return 1;
  }

  if (rightValue === null) {
    return -1;
  }

  return direction === "desc" ? rightValue - leftValue : leftValue - rightValue;
}

export function sortCompaniesByMetric(
  companies: Company[],
  metricId: CompanyMetricId,
  direction: "asc" | "desc",
) {
  return [...companies].sort((left, right) =>
    compareCompaniesByMetric(left, right, metricId, direction),
  );
}
