import { For, type JSX } from "solid-js";
import { cn } from "~/lib/utils";

interface MetadataItem {
  label: string;
  value: JSX.Element;
}

export function MetadataGrid(props: { items: MetadataItem[]; class?: string }) {
  return (
    <dl class={cn("grid gap-4 sm:grid-cols-2", props.class)}>
      <For each={props.items}>
        {(item) => (
          <div>
            <dt class="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.label}</dt>
            <dd class="mt-2 text-base font-medium">{item.value}</dd>
          </div>
        )}
      </For>
    </dl>
  );
}
