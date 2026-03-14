import { Title } from "@solidjs/meta";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { PageHeader } from "~/components/blocks/page-header";
import { technologyWaves } from "~/lib/content/technology-waves";
import { methodologyPrinciples } from "~/lib/content/site";
import { companyMetricDefinitions } from "~/lib/domain/metrics";

export default function MethodologyPage() {
  return (
    <>
      <Title>Methodology · Free The World</Title>

      <div class="space-y-8">
        <PageHeader
          eyebrow="Methodology"
          title="How the scores are produced"
          description="The registry mixes structured research, directional valuation context, and a deliberately explicit technology thesis. The goal is not sterile objectivity. The goal is auditable judgment."
        />

        <ContentCard class="space-y-4">
          <h2 class="text-2xl font-semibold tracking-tight">Core principles</h2>
          <div class="space-y-3">
            {methodologyPrinciples.map(principle => (
              <article class="rounded-2xl border border-border bg-card p-4 text-sm leading-7 text-muted-foreground">
                {principle}
              </article>
            ))}
          </div>
        </ContentCard>

        <ContentCard class="space-y-5">
          <h2 class="text-2xl font-semibold tracking-tight">Metric definitions</h2>
          <div class="grid gap-4 lg:grid-cols-2">
            {Object.values(companyMetricDefinitions).map(metric => (
              <MetricCard label={metric.shortLabel} class="[&>p:first-child]:text-accent-foreground">
                <h3 class="mt-0 text-lg font-medium text-foreground">{metric.label}</h3>
                <p class="mt-3">{metric.description}</p>
              </MetricCard>
            ))}
          </div>
        </ContentCard>

        <ContentCard class="space-y-5">
          <h2 class="text-2xl font-semibold tracking-tight">Technology-wave assumptions</h2>
          <p class="text-sm leading-7 text-muted-foreground">
            These are the repo's declared biases. They prevent the writing from quietly smuggling in a static-world
            worldview while pretending to evaluate decentralization objectively.
          </p>
          <div class="space-y-4">
            {technologyWaves.map(wave => (
              <article class="rounded-2xl border border-border bg-card p-4">
                <h3 class="text-lg font-medium">{wave.label}</h3>
                <p class="mt-2 text-sm leading-7 text-muted-foreground">{wave.summary}</p>
                <ul class="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
                  {wave.implications.map(implication => (
                    <li>• {implication}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </ContentCard>
      </div>
    </>
  );
}
