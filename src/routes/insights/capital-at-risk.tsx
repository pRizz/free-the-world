import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { PageHeader } from "~/components/blocks/page-header";
import { ChartLegend } from "~/components/insights/chart-legend";
import { InsightKpiStrip } from "~/components/insights/insight-kpi-strip";
import { QuadrantChart } from "~/components/insights/quadrant-chart";
import { Seo } from "~/components/seo";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import { getCapitalAtRiskDataset } from "~/lib/domain/insights";

const dataset = getCapitalAtRiskDataset();

export default function CapitalAtRiskPage() {
  const topExposure = dataset.points[0];
  const mostOpen = [...dataset.points].sort(
    (left, right) => right.decentralizability - left.decentralizability,
  )[0];
  const deepestMoat = [...dataset.points].sort((left, right) => right.moat - left.moat)[0];

  return (
    <>
      <Seo
        title="Capital release atlas · Free The World"
        description="A moat-versus-decentralizability map of the published companies, with market-cap-sized bubbles and freed-capital exposure rankings."
        route="/insights/capital-at-risk"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Insights · Capital release atlas"
          title="Where the largest repricing arguments live"
          description="The atlas plots moat against decentralizability, sizes each bubble by current market cap, and highlights where the current published sample appears most exposed to open, local, and protocol-native substitution."
        />

        <InsightKpiStrip
          items={[
            {
              label: "Current cap in sample",
              value: formatMoneyRange(dataset.totalCurrentMarketCap),
              note: "Published companies with enough metric coverage to map cleanly.",
            },
            {
              label: "Capital at risk",
              value: formatMoneyRange(dataset.totalFreedCapitalPotential),
              note: "Directional freed-capital estimate across the current published sample.",
            },
            {
              label: "Average at-risk share",
              value:
                dataset.averageCapitalAtRiskShare === null
                  ? "—"
                  : formatMetricValue(dataset.averageCapitalAtRiskShare, "percentage", 1),
              note: "Mean challenged share of current market cap across the plotted companies.",
            },
            {
              label: "Largest exposure",
              value: topExposure?.company.name ?? "—",
              note: topExposure
                ? `${formatMoneyRange(topExposure.freedCapitalPotential)} challenged`
                : "No companies available.",
            },
          ]}
        />

        <div class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Quadrant map"
              title="Moat on the vertical, decentralizability on the horizontal"
              description="Upper-right is the danger zone for a consensus that still assumes the moat is immortal. Bubble size tracks current market cap rather than thesis intensity."
            />
            <ChartLegend
              items={[
                {
                  label: "Bubble position = moat and decentralizability",
                  swatchClass: "bg-sky-300/90",
                },
                { label: "Bubble size = current market cap", swatchClass: "bg-slate-400/80" },
              ]}
            />
            <QuadrantChart points={dataset.points} />
          </ContentCard>

          <ContentCard class="space-y-4">
            <PageHeader
              eyebrow="Quick reads"
              title="A few obvious takeaways"
              description="Sometimes the point of a chart is not nuance. It is to force the right comparison."
            />
            <MetricCard label="Largest current exposure" value={topExposure?.company.name}>
              {topExposure
                ? `${formatMoneyRange(topExposure.freedCapitalPotential)} challenged, or ${formatMetricValue(topExposure.capitalAtRiskShare, "percentage", 1)} of current cap.`
                : "No companies available."}
            </MetricCard>
            <MetricCard label="Most decentralizable giant" value={mostOpen?.company.name}>
              {mostOpen
                ? `${mostOpen.decentralizability.toFixed(1)}/10 decentralizability with a ${mostOpen.moat.toFixed(1)}/10 moat.`
                : "No companies available."}
            </MetricCard>
            <MetricCard label="Deepest moat in sample" value={deepestMoat?.company.name}>
              {deepestMoat
                ? `${deepestMoat.moat.toFixed(1)}/10 moat with ${formatMoneyRange(deepestMoat.marketCap)} in current equity value.`
                : "No companies available."}
            </MetricCard>
          </ContentCard>
        </div>

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Ranked exposures"
            title="Who matters most if the rents compress?"
            description="This list ranks the currently published companies by the model's freed-capital estimate, then keeps the underlying moat and decentralizability scores visible beside it."
          />
          <div class="grid gap-4 lg:grid-cols-2">
            <For each={dataset.points}>
              {(point) => (
                <article class="rounded-2xl border border-border bg-card/55 p-4">
                  <div class="flex items-start justify-between gap-4">
                    <div class="space-y-2">
                      <h3 class="text-lg font-semibold tracking-tight">{point.company.name}</h3>
                      <p class="text-sm leading-7 text-muted-foreground">
                        {point.company.description}
                      </p>
                    </div>
                    <div class="rounded-2xl border border-border bg-background/55 px-3 py-2 text-right">
                      <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        At risk
                      </p>
                      <p class="mt-1 text-lg font-semibold text-title-foreground">
                        {formatMoneyRange(point.freedCapitalPotential)}
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 grid gap-3 sm:grid-cols-3">
                    <div class="rounded-2xl border border-border bg-background/55 p-3">
                      <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Moat</p>
                      <p class="mt-2 text-lg font-semibold">{point.moat.toFixed(1)}/10</p>
                    </div>
                    <div class="rounded-2xl border border-border bg-background/55 p-3">
                      <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Decentral.
                      </p>
                      <p class="mt-2 text-lg font-semibold">
                        {point.decentralizability.toFixed(1)}/10
                      </p>
                    </div>
                    <div class="rounded-2xl border border-border bg-background/55 p-3">
                      <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Share challenged
                      </p>
                      <p class="mt-2 text-lg font-semibold">
                        {formatMetricValue(point.capitalAtRiskShare, "percentage", 1)}
                      </p>
                    </div>
                  </div>
                </article>
              )}
            </For>
          </div>
        </ContentCard>
      </div>
    </>
  );
}
