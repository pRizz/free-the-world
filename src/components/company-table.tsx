import { For } from "solid-js";
import { A } from "@solidjs/router";
import { companyMetricDefinitions } from "~/lib/domain/metrics";
import { formatCompanyMetric } from "~/lib/domain/formatters";
import type { Company, CompanyMetricId } from "~/lib/domain/types";
import { Badge, Table } from "~/components/ui";
import { getIndustryLabel, getSectorLabel } from "~/lib/domain/selectors";

export function CompanyTable(props: { companies: Company[]; visibleMetricIds: CompanyMetricId[] }) {
  return (
    <Table>
      <thead class="bg-[var(--color-surface-elevated)] text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
        <tr>
          <th class="px-4 py-4 font-medium">Company</th>
          <th class="px-4 py-4 font-medium">Sector</th>
          <For each={props.visibleMetricIds}>
            {metricId => <th class="px-4 py-4 font-medium">{companyMetricDefinitions[metricId].shortLabel}</th>}
          </For>
          <th class="px-4 py-4 font-medium">Products</th>
          <th class="px-4 py-4 font-medium">Links</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.companies}>
          {company => (
            <tr class="border-t border-[var(--color-border)] align-top">
              <td class="space-y-3 px-4 py-4">
                <div class="space-y-2">
                  <A href={`/companies/${company.slug}`} class="text-base font-semibold hover:text-[var(--color-accent)]">
                    {company.name}
                  </A>
                  <div class="flex flex-wrap gap-2">
                    <Badge tone="accent">{company.ticker}</Badge>
                    <Badge tone="muted">Rank ≈ {company.rankApprox}</Badge>
                    <Badge tone="muted">{getIndustryLabel(company.industryId)}</Badge>
                  </div>
                </div>
                <p class="max-w-sm text-sm leading-7 text-[var(--color-muted-foreground)]">{company.description}</p>
              </td>
              <td class="px-4 py-4 text-sm text-[var(--color-muted-foreground)]">
                <div class="space-y-2">
                  <p>{getSectorLabel(company.sectorId)}</p>
                  <p>{getIndustryLabel(company.industryId)}</p>
                </div>
              </td>
              <For each={props.visibleMetricIds}>
                {metricId => (
                  <td class="px-4 py-4 text-sm font-medium text-[var(--color-foreground)]">
                    <div class="space-y-2">
                      <p>{formatCompanyMetric(metricId, company.metrics[metricId])}</p>
                      <p class="max-w-[13rem] text-xs leading-6 text-[var(--color-muted-foreground)]">
                        {company.metrics[metricId].rationale}
                      </p>
                    </div>
                  </td>
                )}
              </For>
              <td class="px-4 py-4 text-sm text-[var(--color-muted-foreground)]">
                <A href={`/companies/${company.slug}/products`} class="hover:text-[var(--color-accent)]">
                  {company.productSlugs.length} product analyses
                </A>
              </td>
              <td class="px-4 py-4 text-sm">
                <div class="flex flex-col gap-2">
                  <A href={`/companies/${company.slug}`} class="hover:text-[var(--color-accent)]">
                    Details
                  </A>
                  <a href={company.companiesMarketCapUrl} target="_blank" rel="noreferrer" class="hover:text-[var(--color-accent)]">
                    CompaniesMarketCap
                  </a>
                </div>
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </Table>
  );
}
