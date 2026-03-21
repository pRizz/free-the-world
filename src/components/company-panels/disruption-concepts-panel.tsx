import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { PageHeader } from "~/components/blocks/page-header";
import { Badge } from "~/components/ui/badge";
import { formatConceptMetric } from "~/lib/domain/formatters";
import { getConceptAnglesByIds, getSourcesByIds } from "~/lib/domain/selectors";
import type { DisruptionConcept, DisruptionException } from "~/lib/domain/types";

export function DisruptionConceptsPanel(props: {
  concepts: DisruptionConcept[];
  maybeException: DisruptionException | null;
}) {
  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow="Disruptive concepts"
        title="Original attack vectors"
        description="These are not just existing alternatives. They are structured product ideas for how open coordination, Bitcoin rails, or decentralized production could attack the incumbent's capture points."
      />

      {props.maybeException ? (
        <article class="rounded-2xl border border-border bg-card p-5">
          <div class="flex flex-wrap gap-2">
            <Badge tone="muted">Documented exception</Badge>
            <Badge tone="accent">Reviewed {props.maybeException.lastReviewedOn}</Badge>
          </div>
          <p class="mt-3 text-sm leading-7 text-muted-foreground">{props.maybeException.reason}</p>
          <div class="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <For each={getSourcesByIds(props.maybeException.sourceIds)}>
              {(source) => (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  class="hover:text-accent-foreground"
                >
                  {source.title}
                </a>
              )}
            </For>
          </div>
        </article>
      ) : null}

      <div class="grid gap-5">
        <For each={props.concepts}>
          {(concept) => {
            const angles = getConceptAnglesByIds(concept.angleIds);
            const conceptSources = getSourcesByIds(concept.sourceIds);

            return (
              <article class="rounded-2xl border border-border bg-card p-5">
                <div class="space-y-4">
                  <div class="space-y-3">
                    <div class="flex flex-wrap gap-2">
                      <For each={angles}>
                        {(angle) => <Badge tone="muted">{angle.label}</Badge>}
                      </For>
                      <Badge tone="accent">{concept.confidence}</Badge>
                    </div>
                    <div>
                      <h3 class="text-2xl font-semibold tracking-tight">{concept.name}</h3>
                      <p class="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">
                        {concept.summary}
                      </p>
                    </div>
                  </div>

                  <div class="grid gap-4 lg:grid-cols-2">
                    <MetricCard label="Thesis">{concept.thesis}</MetricCard>
                    <MetricCard label="Bitcoin / decentralization role">
                      {concept.bitcoinOrDecentralizationRole}
                    </MetricCard>
                    <MetricCard label="Coordination mechanism">
                      {concept.coordinationMechanism}
                    </MetricCard>
                    <MetricCard label="Verification / trust model">
                      {concept.verificationOrTrustModel}
                    </MetricCard>
                  </div>

                  <div class="grid gap-4 lg:grid-cols-2">
                    <MetricCard label="Failure modes">
                      <ul class="space-y-2">
                        <For each={concept.failureModes}>
                          {(failureMode) => <li>• {failureMode}</li>}
                        </For>
                      </ul>
                    </MetricCard>
                    <MetricCard label="Adoption path">
                      <ul class="space-y-2">
                        <For each={concept.adoptionPath}>
                          {(adoptionStep) => <li>• {adoptionStep}</li>}
                        </For>
                      </ul>
                    </MetricCard>
                  </div>

                  <div class="grid gap-4 lg:grid-cols-4">
                    <MetricCard
                      label="Decentralization fit"
                      value={formatConceptMetric(
                        "decentralizationFit",
                        concept.metrics.decentralizationFit,
                      )}
                    >
                      {concept.metrics.decentralizationFit.rationale}
                    </MetricCard>
                    <MetricCard
                      label="Coordination credibility"
                      value={formatConceptMetric(
                        "coordinationCredibility",
                        concept.metrics.coordinationCredibility,
                      )}
                    >
                      {concept.metrics.coordinationCredibility.rationale}
                    </MetricCard>
                    <MetricCard
                      label="Implementation feasibility"
                      value={formatConceptMetric(
                        "implementationFeasibility",
                        concept.metrics.implementationFeasibility,
                      )}
                    >
                      {concept.metrics.implementationFeasibility.rationale}
                    </MetricCard>
                    <MetricCard
                      label="Incumbent pressure"
                      value={formatConceptMetric(
                        "incumbentPressure",
                        concept.metrics.incumbentPressure,
                      )}
                    >
                      {concept.metrics.incumbentPressure.rationale}
                    </MetricCard>
                  </div>

                  <div class="space-y-2">
                    <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sources</p>
                    <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <For each={conceptSources}>
                        {(source) => (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            class="hover:text-accent-foreground"
                          >
                            {source.title}
                          </a>
                        )}
                      </For>
                    </div>
                  </div>
                </div>
              </article>
            );
          }}
        </For>
      </div>
    </ContentCard>
  );
}
