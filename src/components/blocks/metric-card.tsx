import type { ParentProps } from "solid-js";
import { CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function MetricCard(props: ParentProps<{ label: string; value?: string; class?: string }>) {
  return (
    <article class={cn("min-w-0 rounded-2xl border border-border bg-card p-4", props.class)}>
      <p class="break-words text-xs uppercase tracking-[0.24em] text-muted-foreground [overflow-wrap:anywhere]">
        {props.label}
      </p>
      {props.value ? (
        <CardTitle class="mt-2 min-w-0 break-words text-xl [overflow-wrap:anywhere]">
          {props.value}
        </CardTitle>
      ) : null}
      {props.children ? (
        <div class="mt-3 min-w-0 break-words text-sm leading-7 text-muted-foreground [overflow-wrap:anywhere]">
          {props.children}
        </div>
      ) : null}
    </article>
  );
}
