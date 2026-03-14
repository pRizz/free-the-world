import type { SourceCitation } from "~/lib/domain/types";
import { Card, SectionHeading } from "~/components/ui";

export function SourceList(props: { title?: string; description?: string; sources: SourceCitation[] }) {
  return (
    <Card class="space-y-5">
      <SectionHeading
        eyebrow="Paper trail"
        title={props.title ?? "Visible evidence trail"}
        description={
          props.description ??
          "These sources shaped the scoring and writing. The site is opinionated, but it should not behave like it is improvising facts in a dark room."
        }
      />

      <div class="space-y-4">
        {props.sources.map(source => (
          <article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="space-y-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  class="text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
                >
                  {source.title}
                </a>
                <p class="text-sm text-[var(--color-muted-foreground)]">
                  {source.publisher} · {source.kind.replaceAll("-", " ")}
                </p>
                <p class="text-sm leading-7 text-[var(--color-muted-foreground)]">{source.note}</p>
              </div>
              <p class="shrink-0 text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
                Reviewed {source.accessedOn}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
