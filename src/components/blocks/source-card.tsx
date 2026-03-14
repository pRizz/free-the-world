import type { SourceCitation } from "~/lib/domain/types";
import { cn } from "~/lib/utils";

export function SourceCard(props: { source: SourceCitation; class?: string }) {
  return (
    <article class={cn("rounded-2xl border border-border bg-card p-4", props.class)}>
      <a href={props.source.url} target="_blank" rel="noreferrer" class="font-medium hover:text-accent-foreground">
        {props.source.title}
      </a>
      <p class="mt-2 text-sm leading-7 text-muted-foreground">{props.source.note}</p>
    </article>
  );
}
