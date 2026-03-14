import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { SourceCard } from "~/components/blocks/source-card";
import type { SourceCitation } from "~/lib/domain/types";

export function SourceSummaryCard(props: { title: string; sources: SourceCitation[] }) {
  return (
    <ContentCard class="space-y-4">
      <PageHeader eyebrow="Sources" title={props.title} />
      <div class="space-y-3">
        <For each={props.sources}>{source => <SourceCard source={source} />}</For>
      </div>
    </ContentCard>
  );
}
