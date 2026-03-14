import { A } from "@solidjs/router";
import { For } from "solid-js";
import { withBasePath } from "~/lib/config";
import { companyMetricDefinitions } from "~/lib/domain/metrics";
import { formatAlternativeMetric, formatCompanyMetric } from "~/lib/domain/formatters";
import type { Alternative, Company, Product, SourceCitation, TechnologyWave } from "~/lib/domain/types";
import { Badge, Button, Card, SectionHeading, Table } from "~/components/ui";
import { getIndustryLabel, getIndexLabels, getRegionLabel, getSectorLabel } from "~/lib/domain/selectors";

export function CompanyMetadataPanel(props: { company: Company }) {
  return (
    <Card class="space-y-4">
      <SectionHeading eyebrow="Metadata" title="Where this company sits" />
      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Ticker</dt>
          <dd class="mt-2 text-base font-medium">{props.company.ticker}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Rank snapshot</dt>
          <dd class="mt-2 text-base font-medium">≈ {props.company.rankApprox}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Sector</dt>
          <dd class="mt-2 text-base font-medium">{getSectorLabel(props.company.sectorId)}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Industry</dt>
          <dd class="mt-2 text-base font-medium">{getIndustryLabel(props.company.industryId)}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Region</dt>
          <dd class="mt-2 text-base font-medium">{getRegionLabel(props.company.regionId)}</dd>
        </div>
        <div>
          <dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Index</dt>
          <dd class="mt-2 text-base font-medium">{getIndexLabels(props.company.indexIds).join(", ")}</dd>
        </div>
      </dl>
    </Card>
  );
}

export function CompanyMetricsPanel(props: { company: Company }) {
  return (
    <Card class="space-y-5">
      <SectionHeading
        eyebrow="Metrics"
        title="Scoring view"
        description="Every metric is paired with a short rationale. The numbers are deliberate, not divine."
      />
      <div class="metric-grid">
        <For each={Object.entries(props.company.metrics)}>
          {([metricId, assessment]) => (
            <article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">
                {companyMetricDefinitions[metricId as keyof typeof companyMetricDefinitions].label}
              </p>
              <p class="mt-2 text-2xl font-semibold">
                {formatCompanyMetric(metricId as keyof typeof companyMetricDefinitions, assessment)}
              </p>
              <p class="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">{assessment.rationale}</p>
            </article>
          )}
        </For>
      </div>
    </Card>
  );
}

export function CompanyProductsPanel(props: { company: Company; products: Product[] }) {
  return (
    <Card class="space-y-5">
      <SectionHeading
        eyebrow="Products"
        title="Where the moat actually touches users"
        description="These pages zoom into the products and services that matter most to each company and the alternatives already nibbling at them."
      />
      <div class="space-y-4">
        <For each={props.products}>
          {product => (
            <article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-2">
                  <A href={`/companies/${props.company.slug}/products/${product.slug}`} class="text-lg font-medium hover:text-[var(--color-accent)]">
                    {product.name}
                  </A>
                  <p class="text-sm uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">{product.category}</p>
                  <p class="max-w-3xl text-sm leading-7 text-[var(--color-muted-foreground)]">{product.summary}</p>
                </div>
                <Button
                  as="a"
                  href={withBasePath(`/companies/${props.company.slug}/products/${product.slug}`)}
                  variant="secondary"
                >
                  Open analysis
                </Button>
              </div>
            </article>
          )}
        </For>
      </div>
    </Card>
  );
}

export function TechnologyWavePanel(props: { waves: TechnologyWave[] }) {
  return (
    <Card class="space-y-5">
      <SectionHeading
        eyebrow="Technology waves"
        title="Strategic lenses"
        description="These are the repo's explicit bias terms: the technologies expected to keep making incumbents less inevitable over time."
      />
      <div class="space-y-4">
        <For each={props.waves}>
          {wave => (
            <article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
              <div class="space-y-3">
                <div class="flex flex-wrap gap-2">
                  <Badge tone="accent">{wave.label}</Badge>
                </div>
                <p class="text-sm leading-7 text-[var(--color-muted-foreground)]">{wave.summary}</p>
                <ul class="space-y-2 text-sm leading-7 text-[var(--color-muted-foreground)]">
                  <For each={wave.implications}>{implication => <li>• {implication}</li>}</For>
                </ul>
              </div>
            </article>
          )}
        </For>
      </div>
    </Card>
  );
}

export function AlternativeTable(props: { alternatives: Alternative[] }) {
  return (
    <Table>
      <thead class="bg-[var(--color-surface-elevated)] text-xs uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">
        <tr>
          <th class="px-4 py-4 font-medium">Alternative</th>
          <th class="px-4 py-4 font-medium">Type</th>
          <th class="px-4 py-4 font-medium">Open</th>
          <th class="px-4 py-4 font-medium">Decent.</th>
          <th class="px-4 py-4 font-medium">Ready</th>
          <th class="px-4 py-4 font-medium">Cost</th>
          <th class="px-4 py-4 font-medium">Links</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.alternatives}>
          {alternative => (
            <tr class="border-t border-[var(--color-border)] align-top">
              <td class="space-y-2 px-4 py-4">
                <p class="font-semibold">{alternative.name}</p>
                <p class="max-w-sm text-sm leading-7 text-[var(--color-muted-foreground)]">{alternative.summary}</p>
              </td>
              <td class="px-4 py-4 text-sm text-[var(--color-muted-foreground)]">{alternative.kind}</td>
              <td class="px-4 py-4 text-sm">{formatAlternativeMetric("openness", alternative.metrics.openness)}</td>
              <td class="px-4 py-4 text-sm">
                {formatAlternativeMetric("decentralizationFit", alternative.metrics.decentralizationFit)}
              </td>
              <td class="px-4 py-4 text-sm">{formatAlternativeMetric("readiness", alternative.metrics.readiness)}</td>
              <td class="px-4 py-4 text-sm">{formatAlternativeMetric("costLeverage", alternative.metrics.costLeverage)}</td>
              <td class="px-4 py-4 text-sm">
                <div class="flex flex-col gap-2">
                  {alternative.homepageUrl ? (
                    <a href={alternative.homepageUrl} target="_blank" rel="noreferrer" class="hover:text-[var(--color-accent)]">
                      Homepage
                    </a>
                  ) : null}
                  {alternative.repoUrl ? (
                    <a href={alternative.repoUrl} target="_blank" rel="noreferrer" class="hover:text-[var(--color-accent)]">
                      Repository
                    </a>
                  ) : null}
                </div>
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </Table>
  );
}

export function ProductOverviewPanel(props: { product: Product; company: Company }) {
  return (
    <Card class="space-y-5">
      <SectionHeading eyebrow={props.product.category} title={props.product.name} description={props.product.summary} />
      <div class="space-y-4 prose-block">
        <p>{props.product.whyItMatters}</p>
        <div>
          <p class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Replacement sketch</p>
          <ul class="mt-3 space-y-2 text-sm leading-7 text-[var(--color-muted-foreground)]">
            <For each={props.product.replacementSketch}>{paragraph => <li>• {paragraph}</li>}</For>
          </ul>
        </div>
        <div class="flex flex-wrap gap-3">
          <Button as="a" href={props.product.homepageUrl} target="_blank" rel="noreferrer" variant="secondary">
            Product homepage
          </Button>
          <Button as="a" href={withBasePath(`/companies/${props.company.slug}/products`)} variant="ghost">
            Back to {props.company.name} products
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function SourceSummaryCard(props: { title: string; sources: SourceCitation[] }) {
  return (
    <Card class="space-y-4">
      <SectionHeading eyebrow="Sources" title={props.title} />
      <div class="space-y-3">
        <For each={props.sources}>
          {source => (
            <article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4">
              <a href={source.url} target="_blank" rel="noreferrer" class="font-medium hover:text-[var(--color-accent)]">
                {source.title}
              </a>
              <p class="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]">{source.note}</p>
            </article>
          )}
        </For>
      </div>
    </Card>
  );
}
