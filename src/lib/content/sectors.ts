import type { IndexDefinition, Industry, Region, Sector } from "~/lib/domain/types";

export const regions: Region[] = [{ id: "us", label: "United States" }];

export const indices: IndexDefinition[] = [
  {
    id: "sp500-top10",
    label: "S&P 500 · Top 10 by market cap",
    regionId: "us",
    description:
      "A curated snapshot of the ten largest S&P 500 constituents by market capitalization.",
  },
];

export const sectors: Sector[] = [
  { id: "information-technology", label: "Information Technology" },
  { id: "communication-services", label: "Communication Services" },
  { id: "consumer-discretionary", label: "Consumer Discretionary" },
  { id: "financials", label: "Financials" },
  { id: "consumer-staples", label: "Consumer Staples" },
];

export const industries: Industry[] = [
  { id: "semiconductors", sectorId: "information-technology", label: "Semiconductors" },
  {
    id: "technology-hardware",
    sectorId: "information-technology",
    label: "Technology Hardware, Storage & Peripherals",
  },
  { id: "software-cloud", sectorId: "information-technology", label: "Software & Cloud Platforms" },
  {
    id: "interactive-media-services",
    sectorId: "communication-services",
    label: "Interactive Media & Services",
  },
  { id: "broadline-retail", sectorId: "consumer-discretionary", label: "Broadline Retail" },
  {
    id: "automobile-manufacturers",
    sectorId: "consumer-discretionary",
    label: "Automobile Manufacturers",
  },
  { id: "multi-sector-holdings", sectorId: "financials", label: "Multi-Sector Holdings" },
  {
    id: "consumer-staples-retail",
    sectorId: "consumer-staples",
    label: "Consumer Staples Distribution & Retail",
  },
];
