import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatCompanyMetric } from "~/lib/domain/formatters";
import { companyMetricDefinitions } from "~/lib/domain/metrics";
import { getIndustryLabel, getSectorLabel } from "~/lib/domain/selectors";
import type { Company, CompanyMetricId } from "~/lib/domain/types";

export function CompanyTable(props: { companies: Company[]; visibleMetricIds: CompanyMetricId[] }) {
  return (
    <Table>
      <TableElement>
        <TableHeader>
          <tr>
            <TableHead>Company</TableHead>
            <TableHead>Sector</TableHead>
            <For each={props.visibleMetricIds}>
              {(metricId) => <TableHead>{companyMetricDefinitions[metricId].shortLabel}</TableHead>}
            </For>
            <TableHead>Products</TableHead>
            <TableHead>Links</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <For each={props.companies}>
            {(company) => (
              <TableRow>
                <TableCell class="space-y-3">
                  <div class="space-y-2">
                    <A
                      href={`/companies/${company.slug}`}
                      class="text-base font-semibold hover:text-accent-foreground"
                    >
                      {company.name}
                    </A>
                    <div class="flex flex-wrap gap-2">
                      <Badge tone="accent">{company.ticker}</Badge>
                      <Badge tone="muted">Rank ≈ {company.rankApprox}</Badge>
                      <Badge tone="muted">{getIndustryLabel(company.industryId)}</Badge>
                    </div>
                  </div>
                  <p class="max-w-sm leading-7 text-muted-foreground">{company.description}</p>
                </TableCell>
                <TableCell class="text-muted-foreground">
                  <div class="space-y-2">
                    <p>{getSectorLabel(company.sectorId)}</p>
                    <p>{getIndustryLabel(company.industryId)}</p>
                  </div>
                </TableCell>
                <For each={props.visibleMetricIds}>
                  {(metricId) => {
                    const maybeMetric = company.metrics[metricId];

                    return (
                      <TableCell class="font-medium text-foreground">
                        <div class="space-y-2">
                          <p>{formatCompanyMetric(metricId, maybeMetric)}</p>
                          {maybeMetric ? (
                            <p class="max-w-[13rem] text-xs leading-6 text-muted-foreground">
                              {maybeMetric.rationale}
                            </p>
                          ) : (
                            <p class="max-w-[13rem] text-xs leading-6 text-muted-foreground">
                              Not available.
                            </p>
                          )}
                        </div>
                      </TableCell>
                    );
                  }}
                </For>
                <TableCell class="text-muted-foreground">
                  <A
                    href={`/companies/${company.slug}/products`}
                    class="hover:text-accent-foreground"
                  >
                    {company.productSlugs.length} product analyses
                  </A>
                </TableCell>
                <TableCell>
                  <div class="flex flex-col gap-2">
                    <A href={`/companies/${company.slug}`} class="hover:text-accent-foreground">
                      Details
                    </A>
                    <a
                      href={company.companiesMarketCapUrl}
                      target="_blank"
                      rel="noreferrer"
                      class="hover:text-accent-foreground"
                    >
                      CompaniesMarketCap
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </TableElement>
    </Table>
  );
}
