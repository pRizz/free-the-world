import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { PageHeader } from "~/components/blocks/page-header";
import { companyMetricDefinitions } from "~/lib/domain/metrics";
import { formatCompanyMetric } from "~/lib/domain/formatters";
import type { Company } from "~/lib/domain/types";

export function CompanyMetricsPanel(props: { company: Company }) {
  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow="Metrics"
        title="Scoring view"
        description="Every metric is paired with a short rationale. The numbers are deliberate, not divine."
      />
      <div class="metric-grid">
        <For each={Object.entries(props.company.metrics)}>
          {([metricId, assessment]) => (
            <MetricCard
              label={companyMetricDefinitions[metricId as keyof typeof companyMetricDefinitions].label}
              value={formatCompanyMetric(metricId as keyof typeof companyMetricDefinitions, assessment)}
            >
              {assessment.rationale}
            </MetricCard>
          )}
        </For>
      </div>
    </ContentCard>
  );
}
