import { For } from "solid-js";
import { FilterPanel } from "~/components/blocks/filter-panel";
import { Badge } from "~/components/ui/badge";
import {
  Checkbox,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxInput,
  CheckboxLabel,
} from "~/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectField,
  SelectHidden,
  SelectIcon,
  SelectItem,
  SelectLabel,
  SelectListbox,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TextField, TextFieldInput, TextFieldLabel } from "~/components/ui/text-field";
import { companyTableMetricOptions } from "~/lib/domain/table-state";
import type { CompanyMetricId, Industry, Sector } from "~/lib/domain/types";

interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

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

function ToolbarSelect<T extends string>(props: {
  label: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}) {
  const selectedOption = () =>
    props.options.find((option) => option.value === props.value) ?? props.options[0] ?? null;
  const testId = `toolbar-select-${props.label
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "")}`;

  return (
    <SelectField>
      <Select<SelectOption<T>>
        options={props.options}
        optionValue="value"
        optionTextValue="label"
        value={selectedOption()}
        onChange={(option) => {
          if (option) {
            props.onChange(option.value);
          }
        }}
        itemComponent={(itemProps) => (
          <SelectItem item={itemProps.item}>{itemProps.item.rawValue.label}</SelectItem>
        )}
      >
        <SelectLabel>{props.label}</SelectLabel>
        <SelectHidden />
        <SelectTrigger data-testid={testId}>
          <SelectValue>
            {(state) => {
              const selectedOption = state.selectedOption() as SelectOption<T> | undefined;
              return selectedOption?.label ?? "";
            }}
          </SelectValue>
          <SelectIcon />
        </SelectTrigger>
        <SelectContent>
          <SelectListbox />
        </SelectContent>
      </Select>
    </SelectField>
  );
}

export function CompanyTableToolbar(props: ToolbarProps) {
  const sectorOptions: SelectOption[] = [
    { value: "all", label: "All sectors" },
    ...props.sectors.map((sector) => ({ value: sector.id, label: sector.label })),
  ];
  const industryOptions: SelectOption[] = [
    { value: "all", label: "All industries" },
    ...props.industries.map((industry) => ({ value: industry.id, label: industry.label })),
  ];
  const sortMetricOptions: SelectOption<CompanyMetricId>[] = companyTableMetricOptions.map(
    (metric) => ({
      value: metric.id,
      label: metric.label,
    }),
  );
  const sortDirectionOptions: SelectOption<"asc" | "desc">[] = [
    { value: "desc", label: "Highest first" },
    { value: "asc", label: "Lowest first" },
  ];

  return (
    <FilterPanel>
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end">
        <TextField value={props.search} onChange={props.onSearch} class="flex-1">
          <TextFieldLabel>Search companies</TextFieldLabel>
          <TextFieldInput placeholder="Search by name, ticker, sector, or thesis" />
        </TextField>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ToolbarSelect
            label="Sector"
            value={props.sectorId}
            options={sectorOptions}
            onChange={props.onSector}
          />
          <ToolbarSelect
            label="Industry"
            value={props.industryId}
            options={industryOptions}
            onChange={props.onIndustry}
          />
          <ToolbarSelect
            label="Sort metric"
            value={props.sortMetricId}
            options={sortMetricOptions}
            onChange={props.onSortMetric}
          />
          <ToolbarSelect
            label="Direction"
            value={props.sortDirection}
            options={sortDirectionOptions}
            onChange={props.onSortDirection}
          />
        </div>
      </div>

      <Collapsible>
        <div class="rounded-2xl border border-border bg-card p-4">
          <CollapsibleTrigger>Toggle visible columns</CollapsibleTrigger>
          <CollapsibleContent class="mt-4">
            <div class="flex flex-wrap gap-2">
              <For each={companyTableMetricOptions}>
                {(metric) => (
                  <Checkbox
                    checked={props.visibleMetricIds.includes(metric.id)}
                    onChange={() => props.onToggleMetric(metric.id)}
                  >
                    <CheckboxInput class="sr-only" />
                    <CheckboxControl class="sr-only">
                      <CheckboxIndicator />
                    </CheckboxControl>
                    <CheckboxLabel class="cursor-pointer">
                      <Badge tone={props.visibleMetricIds.includes(metric.id) ? "accent" : "muted"}>
                        {metric.label}
                      </Badge>
                    </CheckboxLabel>
                  </Checkbox>
                )}
              </For>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </FilterPanel>
  );
}
