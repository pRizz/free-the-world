import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  MarketCapSnapshot,
  MarketCapSnapshotRow,
} from "../../src/lib/domain/market-cap-snapshots";
import type { Company } from "../../src/lib/domain/types";
import { rootDir } from "./content";

export const marketCapSnapshotSourceName = "CompaniesMarketCap";
export const publicMarketCapCsvPath = "/data/market-cap-snapshots-latest.csv";
export const generatedMarketCapSnapshotFile = path.join(
  rootDir,
  "src",
  "lib",
  "generated",
  "market-cap-snapshots.ts",
);
export const publicMarketCapCsvFile = path.join(rootDir, "public", publicMarketCapCsvPath.slice(1));

const ogDescriptionPattern = /<meta\s+property="og:description"\s+content="([^"]+)"\s*\/?>/i;
const marketCapInfoBoxPattern =
  /<div class="info-box"><div class="line1">\s*([^<]+?)\s*<\/div><div class="line2">Marketcap<\/div><\/div>/i;
const reportedDatePattern = /On <strong>([^<]+)<\/strong> the market cap of/i;
const monthlyReportedDatePattern = /As of ([A-Za-z]+\s+\d{4})/i;
const companiesMarketCapTooltipPattern =
  /by <a href="https:\/\/companiesmarketcap\.com\/">CompaniesMarketCap<\/a>.*?tooltip-title="([^"]+)"/is;

export interface ParsedCompaniesMarketCapPage {
  marketCapDisplay: string;
  marketCapUsd: number;
  sourceReportedAtLabel: string | null;
  sourceNote: string | null;
}

export interface GenerateMarketCapSnapshotOptions {
  fetchedAt?: string;
  fetchImpl?: (input: string) => Promise<Response>;
  log?: Pick<Console, "warn" | "log">;
}

export function formatCompactMarketCap(value: number) {
  if (!Number.isFinite(value)) {
    throw new Error(`Expected a finite USD value, received ${String(value)}.`);
  }

  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000_000) {
    return `$${formatCompactNumber(value / 1_000_000_000_000)} T`;
  }

  if (absValue >= 1_000_000_000) {
    return `$${formatCompactNumber(value / 1_000_000_000)} B`;
  }

  if (absValue >= 1_000_000) {
    return `$${formatCompactNumber(value / 1_000_000)} M`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseMarketCapDisplayToUsd(input: string) {
  const normalizedInput = normalizeWhitespace(input)
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/\s+USD$/i, "")
    .trim();
  const maybeMatch =
    normalizedInput.match(/^([\d.]+)\s*(T|B|M|K|Trillion|Billion|Million|Thousand)?$/i) ??
    normalizedInput.match(/^([\d.]+)$/i);

  if (!maybeMatch) {
    throw new Error(`Could not parse market-cap display "${input}".`);
  }

  const numericValue = Number.parseFloat(maybeMatch[1] ?? "");
  const rawUnit = (maybeMatch[2] ?? "").toUpperCase();
  const unitMultiplierBySuffix: Record<string, number> = {
    T: 1_000_000_000_000,
    TRILLION: 1_000_000_000_000,
    B: 1_000_000_000,
    BILLION: 1_000_000_000,
    M: 1_000_000,
    MILLION: 1_000_000,
    K: 1_000,
    THOUSAND: 1_000,
    "": 1,
  };
  const multiplier = unitMultiplierBySuffix[rawUnit];

  if (!Number.isFinite(numericValue) || multiplier === undefined) {
    throw new Error(`Could not parse market-cap display "${input}".`);
  }

  return Math.round(numericValue * multiplier);
}

export function parseCompaniesMarketCapPage(html: string): ParsedCompaniesMarketCapPage {
  const maybeMarketCapDisplay =
    marketCapInfoBoxPattern.exec(html)?.[1] ?? extractMarketCapFromOgDescription(html);

  if (!maybeMarketCapDisplay) {
    throw new Error("Could not find the market-cap display inside the CompaniesMarketCap page.");
  }

  return {
    marketCapDisplay: normalizeWhitespace(maybeMarketCapDisplay),
    marketCapUsd: parseMarketCapDisplayToUsd(maybeMarketCapDisplay),
    sourceReportedAtLabel:
      reportedDatePattern.exec(html)?.[1] ?? monthlyReportedDatePattern.exec(html)?.[1] ?? null,
    sourceNote: companiesMarketCapTooltipPattern.exec(html)?.[1] ?? null,
  };
}

export function buildFallbackMarketCapSnapshotRow(
  company: Company,
  fetchedAt: string,
  sourceNote = "Fell back to the latest published market-cap metric already stored in the registry.",
): MarketCapSnapshotRow | null {
  const maybePublishedMarketCap = company.metrics.marketCap;
  if (!maybePublishedMarketCap) {
    return null;
  }

  return {
    companySlug: company.slug,
    companyName: company.name,
    ticker: company.ticker,
    companiesMarketCapUrl: company.companiesMarketCapUrl,
    marketCapUsd: maybePublishedMarketCap.value,
    marketCapDisplay: formatCompactMarketCap(maybePublishedMarketCap.value),
    sourceKind: "published-fallback",
    sourceReportedAtLabel: maybePublishedMarketCap.lastReviewedOn,
    fetchedAt,
    sourceNote,
  };
}

export async function fetchMarketCapSnapshotRow(
  company: Company,
  options: {
    fetchedAt: string;
    fetchImpl?: (input: string) => Promise<Response>;
    log?: Pick<Console, "warn">;
  },
): Promise<MarketCapSnapshotRow | null> {
  const fetchImpl = options.fetchImpl ?? fetch;

  try {
    const response = await fetchImpl(company.companiesMarketCapUrl);
    if (!response.ok) {
      throw new Error(`Received ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const parsedPage = parseCompaniesMarketCapPage(html);

    return {
      companySlug: company.slug,
      companyName: company.name,
      ticker: company.ticker,
      companiesMarketCapUrl: company.companiesMarketCapUrl,
      marketCapUsd: parsedPage.marketCapUsd,
      marketCapDisplay: parsedPage.marketCapDisplay,
      sourceKind: "live",
      sourceReportedAtLabel: parsedPage.sourceReportedAtLabel,
      fetchedAt: options.fetchedAt,
      sourceNote: parsedPage.sourceNote,
    };
  } catch (error) {
    options.log?.warn(
      `[market-cap-snapshots] Falling back to the published market cap for ${company.slug}: ${getErrorMessage(error)}`,
    );

    return buildFallbackMarketCapSnapshotRow(
      company,
      options.fetchedAt,
      `Live fetch failed; used the latest published market-cap metric instead. ${getErrorMessage(error)}`,
    );
  }
}

export async function generateMarketCapSnapshot(
  inputCompanies: Company[],
  options: GenerateMarketCapSnapshotOptions = {},
): Promise<MarketCapSnapshot> {
  const fetchedAt = options.fetchedAt ?? new Date().toISOString();
  const rows: MarketCapSnapshotRow[] = [];

  for (const company of [...inputCompanies].sort(compareCompanies)) {
    const maybeRow = await fetchMarketCapSnapshotRow(company, {
      fetchedAt,
      fetchImpl: options.fetchImpl,
      log: options.log,
    });

    if (maybeRow) {
      rows.push(maybeRow);
    }
  }

  const sortedRows = [...rows].sort(compareSnapshotRows);
  const liveCount = sortedRows.filter((row) => row.sourceKind === "live").length;
  const fallbackCount = sortedRows.length - liveCount;
  options.log?.log(
    `[market-cap-snapshots] Generated ${sortedRows.length} rows (${liveCount} live, ${fallbackCount} fallback).`,
  );

  return {
    generatedAt: fetchedAt,
    sourceName: marketCapSnapshotSourceName,
    rows: sortedRows,
  };
}

export function serializeMarketCapSnapshotModule(snapshot: MarketCapSnapshot) {
  return [
    "/* eslint-disable */",
    "// This file is auto-generated by scripts/refresh-market-cap-snapshots.ts. Do not edit by hand.",
    'import type { MarketCapSnapshot } from "~/lib/domain/market-cap-snapshots";',
    "",
    `export const marketCapSnapshot: MarketCapSnapshot = ${JSON.stringify(snapshot, null, 2)};`,
    "",
    "export const marketCapSnapshotRows = marketCapSnapshot.rows;",
    `export const marketCapSnapshotCsvPath = "${publicMarketCapCsvPath}";`,
    "",
  ].join("\n");
}

export function serializeMarketCapSnapshotCsv(snapshot: MarketCapSnapshot) {
  const header = [
    "company_slug",
    "company_name",
    "ticker",
    "market_cap_usd",
    "market_cap_display",
    "source_kind",
    "source_reported_at_label",
    "fetched_at",
    "companies_market_cap_url",
    "source_note",
  ];
  const bodyRows = snapshot.rows.map((row) => [
    row.companySlug,
    row.companyName,
    row.ticker,
    row.marketCapUsd.toString(),
    row.marketCapDisplay,
    row.sourceKind,
    row.sourceReportedAtLabel ?? "",
    row.fetchedAt,
    row.companiesMarketCapUrl,
    row.sourceNote ?? "",
  ]);

  return `${[header, ...bodyRows]
    .map((columns) => columns.map(escapeCsvCell).join(","))
    .join("\n")}\n`;
}

export async function writeMarketCapSnapshotArtifacts(snapshot: MarketCapSnapshot) {
  const generatedModuleSource = serializeMarketCapSnapshotModule(snapshot);
  const csvSource = serializeMarketCapSnapshotCsv(snapshot);

  await mkdir(path.dirname(generatedMarketCapSnapshotFile), { recursive: true });
  await mkdir(path.dirname(publicMarketCapCsvFile), { recursive: true });
  await writeFile(generatedMarketCapSnapshotFile, generatedModuleSource, "utf8");
  await writeFile(publicMarketCapCsvFile, csvSource, "utf8");
}

function compareCompanies(left: Company, right: Company) {
  if (left.rankApprox !== right.rankApprox) {
    return left.rankApprox - right.rankApprox;
  }

  return left.name.localeCompare(right.name);
}

function compareSnapshotRows(left: MarketCapSnapshotRow, right: MarketCapSnapshotRow) {
  if (right.marketCapUsd !== left.marketCapUsd) {
    return right.marketCapUsd - left.marketCapUsd;
  }

  return left.companyName.localeCompare(right.companyName);
}

function extractMarketCapFromOgDescription(html: string) {
  const maybeDescription = ogDescriptionPattern.exec(html)?.[1];
  if (!maybeDescription) {
    return null;
  }

  return maybeDescription.match(/market cap of (\$[^.]+? USD)/i)?.[1] ?? null;
}

function formatCompactNumber(value: number) {
  const absValue = Math.abs(value);
  const maximumFractionDigits = absValue >= 100 ? 1 : absValue >= 10 ? 2 : 3;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

function normalizeWhitespace(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeCsvCell(value: string) {
  if (!/[",\n]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '""')}"`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}
