import type { ParentProps } from "solid-js";
import { CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function MetricCard(props: ParentProps<{ label: string; value?: string; class?: string }>) {
  return (
    <article class={cn("rounded-2xl border border-border bg-card p-4", props.class)}>
      <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">{props.label}</p>
      {props.value ? <CardTitle class="mt-2 text-xl">{props.value}</CardTitle> : null}
      {props.children ? (
        <div class="mt-3 text-sm leading-7 text-muted-foreground">{props.children}</div>
      ) : null}
    </article>
  );
}
