const companyMetricIds = ["moat", "decentralizability", "profitability", "peRatio", "marketCap", "freedCapitalPotential"];
const alternativeMetricIds = ["openness", "decentralizationFit", "readiness", "costLeverage"];
const companyMetricDefinitions = {
  moat: {
    id: "moat",
    label: "Moat",
    shortLabel: "Moat",
    description: "How difficult the company is to dislodge with product, distribution, or regulatory pressure.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "scores"
  },
  decentralizability: {
    id: "decentralizability",
    label: "Decentralizability",
    shortLabel: "Decentral.",
    description: "How feasible it is to replace the company\u2019s core value capture with open-source, self-hosted, federated, or Bitcoin-adjacent alternatives.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "scores"
  },
  profitability: {
    id: "profitability",
    label: "Profitability",
    shortLabel: "Profit",
    description: "Editorial score for profit quality and staying power rather than a single accounting ratio.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "scores"
  },
  peRatio: {
    id: "peRatio",
    label: "Price / Earnings",
    shortLabel: "P/E",
    description: "Approximate forward or blended price-to-earnings snapshot for context, not a precise valuation service.",
    valueType: "ratio",
    precision: 1,
    defaultVisible: true,
    category: "finance"
  },
  marketCap: {
    id: "marketCap",
    label: "Market cap",
    shortLabel: "Mkt cap",
    description: "Approximate equity value snapshot in USD.",
    valueType: "currency",
    precision: 0,
    defaultVisible: true,
    category: "finance"
  },
  freedCapitalPotential: {
    id: "freedCapitalPotential",
    label: "Freed-up capital potential",
    shortLabel: "Freed cap",
    description: "Derived estimate of how much market value could be challenged if open, automated, and decentralized substitutes ate away at the rent-heavy parts of the business.",
    valueType: "currency",
    precision: 0,
    defaultVisible: true,
    category: "derived"
  }
};
const alternativeMetricDefinitions = {
  openness: {
    id: "openness",
    label: "Openness",
    shortLabel: "Open",
    description: "Licensing and user control.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives"
  },
  decentralizationFit: {
    id: "decentralizationFit",
    label: "Decentralization fit",
    shortLabel: "Decent.",
    description: "How naturally the alternative can be distributed, federated, or locally run.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives"
  },
  readiness: {
    id: "readiness",
    label: "Readiness",
    shortLabel: "Ready",
    description: "How close the alternative is to broad day-to-day viability.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives"
  },
  costLeverage: {
    id: "costLeverage",
    label: "Cost leverage",
    shortLabel: "Cost",
    description: "How much pricing pressure this alternative can impose on incumbents.",
    valueType: "score",
    precision: 1,
    defaultVisible: true,
    category: "alternatives"
  }
};
const defaultVisibleCompanyMetrics = companyMetricIds.filter((metricId) => companyMetricDefinitions[metricId].defaultVisible);
alternativeMetricIds.filter((metricId) => alternativeMetricDefinitions[metricId].defaultVisible);

export { alternativeMetricDefinitions as a, companyMetricDefinitions as c, defaultVisibleCompanyMetrics as d };
//# sourceMappingURL=metrics-Dua0ydrl.mjs.map
