import { For } from "solid-js";
import { Badge } from "~/components/ui/badge";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import type { TechnologyWave } from "~/lib/domain/types";

export function TechnologyWavePanel(props: { waves: TechnologyWave[] }) {
  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow="Technology waves"
        title="Strategic lenses"
        description="These are the repo's explicit bias terms: the technologies expected to keep making incumbents less inevitable over time."
      />
      <div class="space-y-4">
        <For each={props.waves}>
          {wave => (
            <article class="rounded-2xl border border-border bg-card p-4">
              <div class="space-y-3">
                <div class="flex flex-wrap gap-2">
                  <Badge tone="accent">{wave.label}</Badge>
                </div>
                <p class="text-sm leading-7 text-muted-foreground">{wave.summary}</p>
                <ul class="space-y-2 text-sm leading-7 text-muted-foreground">
                  <For each={wave.implications}>{implication => <li>• {implication}</li>}</For>
                </ul>
              </div>
            </article>
          )}
        </For>
      </div>
    </ContentCard>
  );
}
