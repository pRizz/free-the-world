import { createMemo, createSignal } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { CompanyTable } from "~/components/company-table";
import { CompanyTableToolbar } from "~/components/company-table-toolbar";
import { Seo } from "~/components/seo";
import { companies, industries, sectors } from "~/lib/content-graph";
import { sortCompaniesByMetric } from "~/lib/domain/company-metrics";
import { getIndustryLabel, getSectorLabel } from "~/lib/domain/selectors";
import { defaultCompanyTableState } from "~/lib/domain/table-state";
import type { CompanyMetricId } from "~/lib/domain/types";

export default function CompaniesPage() {
  const [search, setSearch] = createSignal(defaultCompanyTableState.search);
  const [sectorId, setSectorId] = createSignal(defaultCompanyTableState.sectorId);
  const [industryId, setIndustryId] = createSignal(defaultCompanyTableState.industryId);
  const [sortMetricId, setSortMetricId] = createSignal<CompanyMetricId>(
    defaultCompanyTableState.sortMetricId,
  );
  const [sortDirection, setSortDirection] = createSignal(defaultCompanyTableState.sortDirection);
  const [visibleMetricIds, setVisibleMetricIds] = createSignal(
    defaultCompanyTableState.visibleMetricIds,
  );
  const registryDescription =
    "A growing registry of major public companies, starting with the largest S&P 500 names and expanding over time without turning the data layer into soup.";

  const filteredCompanies = createMemo(() => {
    const term = search().trim().toLowerCase();

    const matchingCompanies = companies.filter((company) => {
      const searchHaystack = [
        company.name,
        company.ticker,
        company.description,
        getSectorLabel(company.sectorId),
        getIndustryLabel(company.industryId),
      ]
        .join(" ")
        .toLowerCase();

      const matchesTerm = !term || searchHaystack.includes(term);
      const matchesSector = sectorId() === "all" || company.sectorId === sectorId();
      const matchesIndustry = industryId() === "all" || company.industryId === industryId();

      return matchesTerm && matchesSector && matchesIndustry;
    });

    return sortCompaniesByMetric(matchingCompanies, sortMetricId(), sortDirection());
  });
  const companyCountLabel = createMemo(() => {
    const count = filteredCompanies().length;
    return `${count} ${count === 1 ? "company" : "companies"} shown`;
  });

  function toggleMetric(metricId: CompanyMetricId) {
    setVisibleMetricIds((currentMetricIds) =>
      currentMetricIds.includes(metricId)
        ? currentMetricIds.filter((id) => id !== metricId)
        : [...currentMetricIds, metricId],
    );
  }

  return (
    <>
      <Seo
        title="Company Registry · Free The World"
        description={registryDescription}
        route="/companies"
      />

      <div class="space-y-8">
        <PageHeader eyebrow="Registry" title="Company Registry" description={registryDescription} />

        <CompanyTableToolbar
          search={search()}
          sectorId={sectorId()}
          industryId={industryId()}
          sortMetricId={sortMetricId()}
          sortDirection={sortDirection()}
          visibleMetricIds={visibleMetricIds()}
          sectors={sectors}
          industries={industries}
          onSearch={setSearch}
          onSector={setSectorId}
          onIndustry={setIndustryId}
          onSortMetric={setSortMetricId}
          onSortDirection={setSortDirection}
          onToggleMetric={toggleMetric}
        />

        <ContentCard class="space-y-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p aria-live="polite" role="status" class="text-sm font-medium text-foreground">
                {companyCountLabel()}
              </p>
              <p class="text-sm text-muted-foreground">
                Currently showing {filteredCompanies().length} of {companies.length} published
                companies. Sorted by {sortMetricId()} ({sortDirection()})
              </p>
            </div>
            <p class="text-sm text-muted-foreground">
              Column toggles let the table stay dense without becoming unreadable.
            </p>
          </div>
          <CompanyTable companies={filteredCompanies()} visibleMetricIds={visibleMetricIds()} />
        </ContentCard>
      </div>
    </>
  );
}
