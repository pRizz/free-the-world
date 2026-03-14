import { For } from "solid-js";
import { companyTableMetricOptions } from "~/lib/domain/table-state";
import type { CompanyMetricId } from "~/lib/domain/types";
import type { Industry, Sector } from "~/lib/domain/types";
import { Badge, Card, Input, Select } from "~/components/ui";

interface ToolbarProps {
  search: string;
  sectorId: string;
  industryId: string;
  sortMetricId: CompanyMetricId;
  sortDirection: "asc" | "desc";
  visibleMetricIds: CompanyMetricId[];
  sectors: Sector[];
  industries: Industry[];
  onSearch: (value: string) => void;
  onSector: (value: string) => void;
  onIndustry: (value: string) => void;
  onSortMetric: (value: CompanyMetricId) => void;
  onSortDirection: (value: "asc" | "desc") => void;
  onToggleMetric: (value: CompanyMetricId) => void;
}

export function CompanyTableToolbar(props: ToolbarProps) {
  return (
    <Card class="space-y-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div class="flex-1 space-y-2">
          <label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
            Search companies
          </label>
          <Input
            value={props.search}
            onInput={event => props.onSearch(event.currentTarget.value)}
            placeholder="Search by name, ticker, sector, or thesis"
          />
        </div>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
              Sector
            </label>
            <Select value={props.sectorId} onChange={event => props.onSector(event.currentTarget.value)}>
              <option value="all">All sectors</option>
              <For each={props.sectors}>{sector => <option value={sector.id}>{sector.label}</option>}</For>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
              Industry
            </label>
            <Select value={props.industryId} onChange={event => props.onIndustry(event.currentTarget.value)}>
              <option value="all">All industries</option>
              <For each={props.industries}>{industry => <option value={industry.id}>{industry.label}</option>}</For>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
              Sort metric
            </label>
            <Select
              value={props.sortMetricId}
              onChange={event => props.onSortMetric(event.currentTarget.value as CompanyMetricId)}
            >
              <For each={companyTableMetricOptions}>
                {metric => <option value={metric.id}>{metric.label}</option>}
              </For>
            </Select>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
              Direction
            </label>
            <Select
              value={props.sortDirection}
              onChange={event => props.onSortDirection(event.currentTarget.value as "asc" | "desc")}
            >
              <option value="desc">Highest first</option>
              <option value="asc">Lowest first</option>
            </Select>
          </div>
        </div>
      </div>

      <details class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
        <summary class="cursor-pointer list-none text-sm font-medium text-[var(--color-foreground)]">
          Toggle visible columns
        </summary>
        <div class="mt-4 flex flex-wrap gap-2">
          <For each={companyTableMetricOptions}>
            {metric => (
              <button
                type="button"
                class="cursor-pointer"
                onClick={() => props.onToggleMetric(metric.id)}
              >
                <Badge tone={props.visibleMetricIds.includes(metric.id) ? "accent" : "muted"}>{metric.label}</Badge>
              </button>
            )}
          </For>
        </div>
      </details>
    </Card>
  );
}
