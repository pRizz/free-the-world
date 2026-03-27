export interface MarketCapSnapshotRow {
  companySlug: string;
  companyName: string;
  ticker: string;
  companiesMarketCapUrl: string;
  marketCapUsd: number;
  marketCapDisplay: string;
  sourceKind: "live" | "published-fallback";
  sourceReportedAtLabel: string | null;
  fetchedAt: string;
  sourceNote: string | null;
}

export interface MarketCapSnapshot {
  generatedAt: string;
  sourceName: string;
  rows: MarketCapSnapshotRow[];
}
