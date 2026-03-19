import { For } from "solid-js";
import { cn } from "~/lib/utils";

export interface InsightKpiItem {
  label: string;
  value: string;
  note?: string;
}

export function InsightKpiStrip(props: { items: InsightKpiItem[]; class?: string }) {
  return (
    <div class={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-4", props.class)}>
      <For each={props.items}>
        {(item) => (
          <article class="rounded-2xl border border-border bg-card/85 p-4 shadow-lg shadow-black/10">
            <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</p>
            <p class="mt-2 text-2xl font-semibold tracking-tight text-title-foreground">
              {item.value}
            </p>
            {item.note ? (
              <p class="mt-3 text-sm leading-7 text-muted-foreground">{item.note}</p>
            ) : null}
          </article>
        )}
      </For>
    </div>
  );
}
