import {
  type AlternativeMetricId,
  alternativeMetricIds,
  type CompanyMetricId,
  companyMetricIds,
  type MetricDefinition,
} from "~/lib/domain/types";

export const companyMetricDefinitions: Record<
  CompanyMetricId,
  MetricDefinition<CompanyMetricId>
> = {
  moat: {
    id: "moat",
    label: "Moat",
    shortLabel: "Moat",
    description:
      "How difficult the company is to dislodge with product, distribution, or regulatory pressure.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "scores",
  },
  decentralizability: {
    id: "decentralizability",
    label: "Decentralizability",
    shortLabel: "Decentral.",
    description:
      "How feasible it is to replace the company’s core value capture with open-source, self-hosted, federated, or Bitcoin-adjacent alternatives.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "scores",
  },
  profitability: {
    id: "profitability",
    label: "Profitability",
    shortLabel: "Profit",
    description:
      "Editorial score for profit quality and staying power rather than a single accounting ratio.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "scores",
  },
  peRatio: {
    id: "peRatio",
    label: "Price / Earnings",
    shortLabel: "P/E",
    description:
      "Approximate forward or blended price-to-earnings snapshot for context, not a precise valuation service.",
    valueType: "ratio",
    precision: 1,
    defaultVisible: true,
    category: "finance",
  },
  marketCap: {
    id: "marketCap",
    label: "Market cap",
    shortLabel: "Mkt cap",
    description: "Approximate equity value snapshot in USD.",
    valueType: "currency",
    precision: 0,
    defaultVisible: true,
    category: "finance",
  },
  ipoMarketCap: {
    id: "ipoMarketCap",
    label: "IPO market cap",
    shortLabel: "IPO cap",
    description:
      "Approximate equity value implied at the IPO using the offer price and post-offering share count.",
    valueType: "currency",
    precision: 0,
    defaultVisible: true,
    category: "finance",
  },
  ipoReturnMultiplier: {
    id: "ipoReturnMultiplier",
    label: "IPO return multiplier",
    shortLabel: "IPO x",
    description: "Current market cap divided by the company’s IPO market cap.",
    valueType: "ratio",
    precision: 1,
    defaultVisible: true,
    category: "derived",
  },
  ipoAnnualizedGrowthRate: {
    id: "ipoAnnualizedGrowthRate",
    label: "Yearly market cap growth since IPO",
    shortLabel: "IPO CAGR",
    description:
      "Compound annual growth rate of market cap from the IPO date through the current market cap snapshot.",
    valueType: "percentage",
    precision: 1,
    defaultVisible: true,
    category: "derived",
  },
  freedCapitalPotential: {
    id: "freedCapitalPotential",
    label: "Freed-up capital potential",
    shortLabel: "Freed cap",
    description:
      "Derived estimate of how much market value could be challenged if open, automated, and decentralized substitutes ate away at the rent-heavy parts of the business.",
    valueType: "currency",
    precision: 0,
    defaultVisible: true,
    category: "derived",
  },
};

export const alternativeMetricDefinitions: Record<
  AlternativeMetricId,
  MetricDefinition<AlternativeMetricId>
> = {
  openness: {
    id: "openness",
    label: "Openness",
    shortLabel: "Open",
    description: "Licensing and user control.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives",
  },
  decentralizationFit: {
    id: "decentralizationFit",
    label: "Decentralization fit",
    shortLabel: "Decent.",
    description: "How naturally the alternative can be distributed, federated, or locally run.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives",
  },
  readiness: {
    id: "readiness",
    label: "Readiness",
    shortLabel: "Ready",
    description: "How close the alternative is to broad day-to-day viability.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives",
  },
  costLeverage: {
    id: "costLeverage",
    label: "Cost leverage",
    shortLabel: "Cost",
    description: "How much pricing pressure this alternative can impose on incumbents.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives",
  },
};

export const defaultVisibleCompanyMetrics = companyMetricIds.filter(
  (metricId) => companyMetricDefinitions[metricId].defaultVisible,
);

export const defaultVisibleAlternativeMetrics = alternativeMetricIds.filter(
  (metricId) => alternativeMetricDefinitions[metricId].defaultVisible,
);
