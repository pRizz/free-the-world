import { companyMetricDefinitions, defaultVisibleCompanyMetrics } from "~/lib/domain/metrics";
import type { CompanyMetricId } from "~/lib/domain/types";

export interface CompanyTableState {
  search: string;
  sectorId: string;
  industryId: string;
  sortMetricId: CompanyMetricId;
  sortDirection: "asc" | "desc";
  visibleMetricIds: CompanyMetricId[];
}

export const defaultCompanyTableState: CompanyTableState = {
  search: "",
  sectorId: "all",
  industryId: "all",
  sortMetricId: "freedCapitalPotential",
  sortDirection: "desc",
  visibleMetricIds: [...defaultVisibleCompanyMetrics],
};

export const companyTableMetricOptions = Object.values(companyMetricDefinitions).map(definition => ({
  id: definition.id,
  label: definition.label,
}));
