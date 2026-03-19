import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { BarComparisonChart } from "~/components/insights/bar-comparison-chart";
import { ChartLegend } from "~/components/insights/chart-legend";
import { DumbbellChart } from "~/components/insights/dumbbell-chart";
import { InsightKpiStrip } from "~/components/insights/insight-kpi-strip";
import { PostBubbleMobileList } from "~/components/insights/post-bubble-mobile-list";
import { Seo } from "~/components/seo";
import {
  Table,
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import { getPostBubbleDataset } from "~/lib/domain/insights";

const dataset = getPostBubbleDataset();

export default function PostBubblePage() {
  return (
    <>
      <Seo
        title="Post-bubble · Free The World"
        description="Compare IPO market caps, current market caps, and a thesis-adjusted residual cap for the companies currently published in the registry."
        route="/insights/post-bubble"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Insights · Post-bubble"
          title="How big is the business after the rent gets repriced?"
          description="This page compares IPO market cap, current market cap, and an illustrative residual cap equal to current value minus the site's directional freed-capital estimate. It is a thought experiment with receipts, not a liquidation oracle."
        />

        <InsightKpiStrip
          items={[
            {
              label: "Companies with IPO baseline",
              value: `${dataset.rows.length}`,
              note: `${dataset.excludedCompanies.length} published company currently lacks an IPO comparison point.`,
            },
            {
              label: "Current cap in sample",
              value: formatMoneyRange(dataset.totalCurrentMarketCap),
              note: "Only companies with an IPO baseline are included in this view.",
            },
            {
              label: "Illustrative residual cap",
              value: formatMoneyRange(dataset.totalResidualMarketCap),
              note: "Current cap minus the portion the model sees as most vulnerable to open pressure.",
            },
            {
              label: "Average IPO return",
              value:
                dataset.averageIpoReturnMultiplier === null
                  ? "—"
                  : formatMetricValue(dataset.averageIpoReturnMultiplier, "ratio", 1),
              note:
                dataset.averageIpoAnnualizedGrowthRate === null
                  ? "Average IPO CAGR unavailable."
                  : `Average IPO CAGR ${formatMetricValue(dataset.averageIpoAnnualizedGrowthRate, "percentage", 1)}.`,
            },
          ]}
        />

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Log-scale comparison"
            title="Then, now, and after the unwind"
            description="The chart uses a log scale so tiny IPO-era caps do not collapse into decorative dust beside today's trillion-dollar values."
          />
          <div class="space-y-3 md:hidden">
            <p class="text-sm leading-7 text-muted-foreground">
              On mobile, the main story is presented as ranked cards first so you do not have to
              pan across the full comparison chart to understand the page.
            </p>
            <PostBubbleMobileList rows={dataset.rows} />
          </div>
          <div class="hidden space-y-5 md:block">
            <ChartLegend
              items={[
                { label: "IPO market cap", swatchClass: "bg-slate-400/80" },
                { label: "Illustrative residual cap", swatchClass: "bg-success/80" },
                { label: "Current market cap", swatchClass: "bg-sky-300/90" },
              ]}
            />
            <DumbbellChart rows={dataset.rows} />
          </div>
        </ContentCard>

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Capital split"
            title="How much looks durable versus challengeable?"
            description="A second view sizes each bar by the company's current market cap, then splits the bar into residual value and the share the model believes could be repriced if substitutes compound."
          />
          <ChartLegend
            items={[
              { label: "Illustrative residual cap", swatchClass: "bg-success/80" },
              { label: "Freed-capital potential", swatchClass: "bg-warning/80" },
            ]}
          />
          <BarComparisonChart rows={dataset.rows} />
        </ContentCard>

        <ContentCard class="hidden space-y-5 md:block">
          <PageHeader
            eyebrow="Reference table"
            title="Published company comparisons"
            description="The table below keeps the underlying values visible for readers who prefer numbers before vibes."
          />
          <Table>
            <TableElement>
              <TableHeader>
                <tr>
                  <TableHead>Company</TableHead>
                  <TableHead>IPO cap</TableHead>
                  <TableHead>Current cap</TableHead>
                  <TableHead>Residual cap</TableHead>
                  <TableHead>At risk</TableHead>
                  <TableHead>IPO x</TableHead>
                  <TableHead>IPO CAGR</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                <For each={dataset.rows}>
                  {(row) => (
                    <TableRow>
                      <TableCell class="space-y-1">
                        <p class="font-semibold text-foreground">{row.company.name}</p>
                        <p class="text-sm text-muted-foreground">{row.company.ticker}</p>
                      </TableCell>
                      <TableCell>{formatMoneyRange(row.ipoMarketCap)}</TableCell>
                      <TableCell>{formatMoneyRange(row.currentMarketCap)}</TableCell>
                      <TableCell>{formatMoneyRange(row.residualMarketCap)}</TableCell>
                      <TableCell>
                        <div class="space-y-1">
                          <p>{formatMoneyRange(row.freedCapitalPotential)}</p>
                          <p class="text-xs text-muted-foreground">
                            {formatMetricValue(row.capitalAtRiskShare, "percentage", 1)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatMetricValue(row.ipoReturnMultiplier, "ratio", 1)}
                      </TableCell>
                      <TableCell>
                        {formatMetricValue(row.ipoAnnualizedGrowthRate, "percentage", 1)}
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </TableElement>
          </Table>
        </ContentCard>

        {dataset.excludedCompanies.length > 0 ? (
          <ContentCard class="space-y-4">
            <div class="space-y-2">
              <h2 class="text-2xl font-semibold tracking-tight">Current exclusions</h2>
              <p class="text-sm leading-7 text-muted-foreground sm:text-base">
                These published companies have current market-cap and freed-capital data, but they
                do not yet have a usable IPO baseline in the published corpus, so they are excluded
                from the comparison charts instead of being faked into neatness.
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <For each={dataset.excludedCompanies}>
                {(company) => (
                  <span class="rounded-full border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                    {company.name}
                  </span>
                )}
              </For>
            </div>
          </ContentCard>
        ) : null}
      </div>
    </>
  );
}
