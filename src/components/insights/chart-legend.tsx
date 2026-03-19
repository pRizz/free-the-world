import { For } from "solid-js";
import { cn } from "~/lib/utils";

export interface ChartLegendItem {
  label: string;
  swatchClass?: string;
}

export function ChartLegend(props: { items: ChartLegendItem[]; class?: string }) {
  return (
    <div class={cn("flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3", props.class)}>
      <For each={props.items}>
        {(item) => (
          <div class="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
            <span
              aria-hidden="true"
              class={cn(
                "inline-flex h-3 w-3 rounded-full border border-border bg-white/10",
                item.swatchClass,
              )}
            />
            <span>{item.label}</span>
          </div>
        )}
      </For>
    </div>
  );
}
