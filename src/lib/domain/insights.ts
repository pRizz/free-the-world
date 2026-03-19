import { alternatives, companies, products } from "~/lib/content-graph";
import type { Alternative, Company, Product } from "~/lib/domain/types";

export interface PostBubbleRow {
  company: Company;
  ipoMarketCap: number;
  currentMarketCap: number;
  freedCapitalPotential: number;
  residualMarketCap: number;
  ipoReturnMultiplier: number;
  ipoAnnualizedGrowthRate: number;
  capitalAtRiskShare: number;
}

export interface PostBubbleDataset {
  rows: PostBubbleRow[];
  excludedCompanies: Company[];
  totalCurrentMarketCap: number;
  totalFreedCapitalPotential: number;
  totalResidualMarketCap: number;
  averageIpoReturnMultiplier: number | null;
  averageIpoAnnualizedGrowthRate: number | null;
}

export interface CapitalAtRiskPoint {
  company: Company;
  moat: number;
  decentralizability: number;
  profitability: number;
  peRatio: number;
  marketCap: number;
  freedCapitalPotential: number;
  capitalAtRiskShare: number;
}

export interface CapitalAtRiskDataset {
  points: CapitalAtRiskPoint[];
  totalCurrentMarketCap: number;
  totalFreedCapitalPotential: number;
  averageCapitalAtRiskShare: number | null;
}

export interface AlternativeMetricAverages {
  openness: number;
  decentralizationFit: number;
  readiness: number;
  costLeverage: number;
}

export interface AlternativePressureProductRow {
  company: Company;
  product: Product;
  alternativeCount: number;
  alternativeNames: string[];
  averages: AlternativeMetricAverages | null;
  pressureScore: number | null;
  hasDocumentedAlternatives: boolean;
}

export interface AlternativePressureCompanyRow {
  company: Company;
  productCount: number;
  productsWithDocumentedAlternatives: number;
  alternativeCount: number;
  averages: AlternativeMetricAverages | null;
  pressureScore: number | null;
  highestPressureProduct: AlternativePressureProductRow | null;
  hasDocumentedAlternatives: boolean;
}

export interface AlternativePressureDataset {
  productRows: AlternativePressureProductRow[];
  companyRows: AlternativePressureCompanyRow[];
  documentedProductCount: number;
  undocumentedProductCount: number;
  totalAlternativeCount: number;
  averagePressureScore: number | null;
}

export function calculateResidualMarketCap(currentMarketCap: number, freedCapitalPotential: number) {
  return Math.max(0, currentMarketCap - freedCapitalPotential);
}

export function calculateCapitalAtRiskShare(
  currentMarketCap: number,
  freedCapitalPotential: number,
) {
  if (!Number.isFinite(currentMarketCap) || currentMarketCap <= 0) {
    return null;
  }

  return Math.max(0, Math.min(1, freedCapitalPotential / currentMarketCap));
}

export function getPostBubbleDataset(inputCompanies: Company[] = companies): PostBubbleDataset {
  const rows: PostBubbleRow[] = [];
  const excludedCompanies: Company[] = [];

  for (const company of inputCompanies) {
    const maybeCurrentMarketCap = company.metrics.marketCap?.value;
    const maybeFreedCapitalPotential = company.metrics.freedCapitalPotential?.value;
    const maybeIpoMarketCap = company.metrics.ipoMarketCap?.value;
    const maybeIpoReturnMultiplier = company.metrics.ipoReturnMultiplier?.value;
    const maybeIpoAnnualizedGrowthRate = company.metrics.ipoAnnualizedGrowthRate?.value;
    const maybeCapitalAtRiskShare =
      maybeCurrentMarketCap && maybeFreedCapitalPotential
        ? calculateCapitalAtRiskShare(maybeCurrentMarketCap, maybeFreedCapitalPotential)
        : null;

    if (
      maybeCurrentMarketCap === undefined ||
      maybeFreedCapitalPotential === undefined ||
      maybeIpoMarketCap === undefined ||
      maybeIpoReturnMultiplier === undefined ||
      maybeIpoAnnualizedGrowthRate === undefined ||
      maybeCapitalAtRiskShare === null
    ) {
      excludedCompanies.push(company);
      continue;
    }

    rows.push({
      company,
      ipoMarketCap: maybeIpoMarketCap,
      currentMarketCap: maybeCurrentMarketCap,
      freedCapitalPotential: maybeFreedCapitalPotential,
      residualMarketCap: calculateResidualMarketCap(
        maybeCurrentMarketCap,
        maybeFreedCapitalPotential,
      ),
      ipoReturnMultiplier: maybeIpoReturnMultiplier,
      ipoAnnualizedGrowthRate: maybeIpoAnnualizedGrowthRate,
      capitalAtRiskShare: maybeCapitalAtRiskShare,
    });
  }

  const sortedRows = [...rows].sort((left, right) => {
    if (right.currentMarketCap !== left.currentMarketCap) {
      return right.currentMarketCap - left.currentMarketCap;
    }

    return left.company.name.localeCompare(right.company.name);
  });

  const totalCurrentMarketCap = sum(sortedRows.map((row) => row.currentMarketCap));
  const totalFreedCapitalPotential = sum(sortedRows.map((row) => row.freedCapitalPotential));
  const totalResidualMarketCap = sum(sortedRows.map((row) => row.residualMarketCap));

  return {
    rows: sortedRows,
    excludedCompanies: [...excludedCompanies].sort((left, right) =>
      left.name.localeCompare(right.name),
    ),
    totalCurrentMarketCap,
    totalFreedCapitalPotential,
    totalResidualMarketCap,
    averageIpoReturnMultiplier: average(sortedRows.map((row) => row.ipoReturnMultiplier)),
    averageIpoAnnualizedGrowthRate: average(
      sortedRows.map((row) => row.ipoAnnualizedGrowthRate),
    ),
  };
}

export function getCapitalAtRiskDataset(
  inputCompanies: Company[] = companies,
): CapitalAtRiskDataset {
  const points = inputCompanies
    .map((company) => {
      const maybeMoat = company.metrics.moat?.value;
      const maybeDecentralizability = company.metrics.decentralizability?.value;
      const maybeProfitability = company.metrics.profitability?.value;
      const maybePeRatio = company.metrics.peRatio?.value;
      const maybeMarketCap = company.metrics.marketCap?.value;
      const maybeFreedCapitalPotential = company.metrics.freedCapitalPotential?.value;
      const maybeCapitalAtRiskShare =
        maybeMarketCap && maybeFreedCapitalPotential
          ? calculateCapitalAtRiskShare(maybeMarketCap, maybeFreedCapitalPotential)
          : null;

      if (
        maybeMoat === undefined ||
        maybeDecentralizability === undefined ||
        maybeProfitability === undefined ||
        maybePeRatio === undefined ||
        maybeMarketCap === undefined ||
        maybeFreedCapitalPotential === undefined ||
        maybeCapitalAtRiskShare === null
      ) {
        return null;
      }

      return {
        company,
        moat: maybeMoat,
        decentralizability: maybeDecentralizability,
        profitability: maybeProfitability,
        peRatio: maybePeRatio,
        marketCap: maybeMarketCap,
        freedCapitalPotential: maybeFreedCapitalPotential,
        capitalAtRiskShare: maybeCapitalAtRiskShare,
      } satisfies CapitalAtRiskPoint;
    })
    .filter((point): point is CapitalAtRiskPoint => point !== null)
    .sort((left, right) => {
      if (right.freedCapitalPotential !== left.freedCapitalPotential) {
        return right.freedCapitalPotential - left.freedCapitalPotential;
      }

      return left.company.name.localeCompare(right.company.name);
    });

  return {
    points,
    totalCurrentMarketCap: sum(points.map((point) => point.marketCap)),
    totalFreedCapitalPotential: sum(points.map((point) => point.freedCapitalPotential)),
    averageCapitalAtRiskShare: average(points.map((point) => point.capitalAtRiskShare)),
  };
}

export function getAlternativeMetricAverages(
  inputAlternatives: Alternative[],
): AlternativeMetricAverages | null {
  if (inputAlternatives.length === 0) {
    return null;
  }

  return {
    openness: average(inputAlternatives.map((alternative) => alternative.metrics.openness.value)) ?? 0,
    decentralizationFit:
      average(
        inputAlternatives.map((alternative) => alternative.metrics.decentralizationFit.value),
      ) ?? 0,
    readiness: average(inputAlternatives.map((alternative) => alternative.metrics.readiness.value)) ?? 0,
    costLeverage:
      average(inputAlternatives.map((alternative) => alternative.metrics.costLeverage.value)) ?? 0,
  };
}

/**
 * We weight readiness and cost leverage more heavily because "pressure" is most useful when a
 * substitute is both deployable and capable of changing the incumbent's pricing conversation.
 */
export function calculateAlternativePressureScore(averages: AlternativeMetricAverages) {
  return (
    averages.readiness * 0.35 +
    averages.costLeverage * 0.35 +
    averages.openness * 0.15 +
    averages.decentralizationFit * 0.15
  );
}

export function getAlternativePressureDataset(
  inputCompanies: Company[] = companies,
  inputProducts: Product[] = products,
  inputAlternatives: Alternative[] = alternatives,
): AlternativePressureDataset {
  const companyBySlug = new Map(inputCompanies.map((company) => [company.slug, company]));
  const alternativesByProductSlug = new Map<string, Alternative[]>();

  for (const alternative of inputAlternatives) {
    const existingAlternatives = alternativesByProductSlug.get(alternative.productSlug) ?? [];
    existingAlternatives.push(alternative);
    alternativesByProductSlug.set(alternative.productSlug, existingAlternatives);
  }

  const productRows = inputProducts
    .map((product) => {
      const company = companyBySlug.get(product.companySlug);
      if (!company) {
        return null;
      }

      const productAlternatives = alternativesByProductSlug.get(product.slug) ?? [];
      const averages = getAlternativeMetricAverages(productAlternatives);

      return {
        company,
        product,
        alternativeCount: productAlternatives.length,
        alternativeNames: productAlternatives.map((alternative) => alternative.name),
        averages,
        pressureScore: averages ? calculateAlternativePressureScore(averages) : null,
        hasDocumentedAlternatives: productAlternatives.length > 0,
      } satisfies AlternativePressureProductRow;
    })
    .filter((row): row is AlternativePressureProductRow => row !== null)
    .sort(compareAlternativePressureRows);

  const productRowsByCompanySlug = new Map<string, AlternativePressureProductRow[]>();
  for (const row of productRows) {
    const existingRows = productRowsByCompanySlug.get(row.company.slug) ?? [];
    existingRows.push(row);
    productRowsByCompanySlug.set(row.company.slug, existingRows);
  }

  const companyRows = inputCompanies
    .map((company) => {
      const companyProductRows = productRowsByCompanySlug.get(company.slug) ?? [];
      const documentedProductRows = companyProductRows.filter((row) => row.hasDocumentedAlternatives);
      const companyAlternatives = documentedProductRows.flatMap((row) =>
        (alternativesByProductSlug.get(row.product.slug) ?? []).map((alternative) => alternative),
      );
      const averages = getAlternativeMetricAverages(companyAlternatives);

      return {
        company,
        productCount: companyProductRows.length,
        productsWithDocumentedAlternatives: documentedProductRows.length,
        alternativeCount: companyAlternatives.length,
        averages,
        pressureScore: averages ? calculateAlternativePressureScore(averages) : null,
        highestPressureProduct: documentedProductRows[0] ?? null,
        hasDocumentedAlternatives: documentedProductRows.length > 0,
      } satisfies AlternativePressureCompanyRow;
    })
    .sort((left, right) => {
      if (left.hasDocumentedAlternatives !== right.hasDocumentedAlternatives) {
        return left.hasDocumentedAlternatives ? -1 : 1;
      }

      if (left.pressureScore !== null && right.pressureScore !== null) {
        if (right.pressureScore !== left.pressureScore) {
          return right.pressureScore - left.pressureScore;
        }
      }

      return left.company.name.localeCompare(right.company.name);
    });

  const documentedProductRows = productRows.filter((row) => row.hasDocumentedAlternatives);

  return {
    productRows,
    companyRows,
    documentedProductCount: documentedProductRows.length,
    undocumentedProductCount: productRows.length - documentedProductRows.length,
    totalAlternativeCount: inputAlternatives.length,
    averagePressureScore: average(
      documentedProductRows
        .map((row) => row.pressureScore)
        .filter((score): score is number => score !== null),
    ),
  };
}

function compareAlternativePressureRows(
  left: AlternativePressureProductRow,
  right: AlternativePressureProductRow,
) {
  if (left.hasDocumentedAlternatives !== right.hasDocumentedAlternatives) {
    return left.hasDocumentedAlternatives ? -1 : 1;
  }

  if (left.pressureScore !== null && right.pressureScore !== null) {
    if (right.pressureScore !== left.pressureScore) {
      return right.pressureScore - left.pressureScore;
    }
  }

  if (right.alternativeCount !== left.alternativeCount) {
    return right.alternativeCount - left.alternativeCount;
  }

  return `${left.company.name} ${left.product.name}`.localeCompare(
    `${right.company.name} ${right.product.name}`,
  );
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]) {
  if (values.length === 0) {
    return null;
  }

  return sum(values) / values.length;
}
