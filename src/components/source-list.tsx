import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { RepositoryLink } from "~/components/repository-link";
import type { SourceCitation } from "~/lib/domain/types";

export function SourceList(props: {
  title?: string;
  description?: string;
  sources: SourceCitation[];
}) {
  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow="Paper trail"
        title={props.title ?? "Visible evidence trail"}
        description={
          props.description ??
          "These sources shaped the scoring and writing. The site is opinionated, but it should not behave like it is improvising facts in a dark room."
        }
        actions={<RepositoryLink size="sm" class="w-full sm:w-auto" />}
      />

      <div class="space-y-4">
        {props.sources.map((source) => (
          <article class="rounded-2xl border border-border bg-card p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="space-y-2">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  class="text-base font-medium text-foreground hover:text-accent-foreground"
                >
                  {source.title}
                </a>
                <p class="text-sm text-muted-foreground">
                  {source.publisher} · {source.kind.replaceAll("-", " ")}
                </p>
                <p class="text-sm leading-7 text-muted-foreground">{source.note}</p>
              </div>
              <p class="shrink-0 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Reviewed {source.accessedOn}
              </p>
            </div>
          </article>
        ))}
      </div>
    </ContentCard>
  );
}
