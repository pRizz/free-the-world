import { Title } from "@solidjs/meta";
import { createMemo, createSignal } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { CompanyTable } from "~/components/company-table";
import { CompanyTableToolbar } from "~/components/company-table-toolbar";
import { companies } from "~/lib/content/companies";
import { industries, sectors } from "~/lib/content/sectors";
import { getIndustryLabel, getSectorLabel } from "~/lib/domain/selectors";
import { defaultCompanyTableState } from "~/lib/domain/table-state";
import type { CompanyMetricId } from "~/lib/domain/types";

export default function CompaniesPage() {
  const [search, setSearch] = createSignal(defaultCompanyTableState.search);
  const [sectorId, setSectorId] = createSignal(defaultCompanyTableState.sectorId);
  const [industryId, setIndustryId] = createSignal(defaultCompanyTableState.industryId);
  const [sortMetricId, setSortMetricId] = createSignal<CompanyMetricId>(defaultCompanyTableState.sortMetricId);
  const [sortDirection, setSortDirection] = createSignal(defaultCompanyTableState.sortDirection);
  const [visibleMetricIds, setVisibleMetricIds] = createSignal(defaultCompanyTableState.visibleMetricIds);

  const filteredCompanies = createMemo(() => {
    const term = search().trim().toLowerCase();

    return [...companies]
      .filter(company => {
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
      })
      .sort((left, right) => {
        const leftValue = left.metrics[sortMetricId()].value;
        const rightValue = right.metrics[sortMetricId()].value;
        return sortDirection() === "desc" ? rightValue - leftValue : leftValue - rightValue;
      });
  });

  function toggleMetric(metricId: CompanyMetricId) {
    setVisibleMetricIds(currentMetricIds =>
      currentMetricIds.includes(metricId)
        ? currentMetricIds.filter(id => id !== metricId)
        : [...currentMetricIds, metricId]
    );
  }

  return (
    <>
      <Title>Company Registry · Free The World</Title>

      <div class="space-y-8">
        <PageHeader
          eyebrow="Registry"
          title="Top 10 S&P 500 companies"
          description="A curated launch set focused on the largest companies in the index. The architecture is designed to absorb more indices, regions, and private companies later without turning the data layer into soup."
        />

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
                {filteredCompanies().length} companies shown
              </p>
              <p class="text-sm text-muted-foreground">
                Sorted by {sortMetricId()} ({sortDirection()})
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
