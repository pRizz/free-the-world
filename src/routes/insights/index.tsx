import { A } from "@solidjs/router";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { InsightKpiStrip } from "~/components/insights/insight-kpi-strip";
import { Seo } from "~/components/seo";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import {
  getAlternativePressureDataset,
  getCapitalAtRiskDataset,
  getPostBubbleDataset,
} from "~/lib/domain/insights";

const postBubbleDataset = getPostBubbleDataset();
const capitalAtRiskDataset = getCapitalAtRiskDataset();
const alternativePressureDataset = getAlternativePressureDataset();

const topCapitalAtRiskPoint = capitalAtRiskDataset.points[0];
const topPressureCompany = alternativePressureDataset.companyRows.find(
  (row) => row.hasDocumentedAlternatives,
);

export default function InsightsPage() {
  return (
    <>
      <Seo
        title="Insights · Free The World"
        description="Visual arguments for the slowly free future: post-bubble comparisons, capital-at-risk maps, and the current replacement landscape."
        route="/insights"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Insights"
          title="Visual arguments for the slowly free future"
          description="The registry is useful when you want details. These pages are useful when you want the thesis to hit in one screen. Everything here is directional, auditable, and deliberately explicit about being a model rather than an oracle."
        />

        <InsightKpiStrip
          items={[
            {
              label: "IPO baselines",
              value: `${postBubbleDataset.rows.length} companies`,
              note: `${postBubbleDataset.excludedCompanies.length} published company currently lacks an IPO baseline.`,
            },
            {
              label: "Capital at risk",
              value: formatMoneyRange(capitalAtRiskDataset.totalFreedCapitalPotential),
              note: "Illustrative capital release across the current published sample.",
            },
            {
              label: "Alternatives tracked",
              value: `${alternativePressureDataset.totalAlternativeCount}`,
              note: `${alternativePressureDataset.documentedProductCount} products already have documented substitute pressure.`,
            },
            {
              label: "Average IPO CAGR",
              value:
                postBubbleDataset.averageIpoAnnualizedGrowthRate === null
                  ? "—"
                  : formatMetricValue(
                      postBubbleDataset.averageIpoAnnualizedGrowthRate,
                      "percentage",
                      1,
                    ),
              note: "Calculated across the companies that already have IPO-derived metrics.",
            },
          ]}
        />

        <div class="grid gap-6 xl:grid-cols-3">
          <ContentCard class="space-y-5">
            <div class="flex flex-wrap gap-2">
              <Badge tone="accent">Page 1</Badge>
              <Badge tone="muted">IPO vs now vs residual</Badge>
            </div>
            <div class="space-y-3">
              <h2 class="text-2xl font-semibold tracking-tight">Post-bubble</h2>
              <p class="text-sm leading-7 text-muted-foreground">
                Compare IPO market caps, today&apos;s market caps, and a thesis-adjusted residual
                cap that subtracts the share of value most exposed to open, automated, and
                decentralized competition.
              </p>
            </div>
            <div class="rounded-2xl border border-border bg-background/55 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Biggest published cap in the set
              </p>
              <p class="mt-2 text-xl font-semibold text-title-foreground">
                {postBubbleDataset.rows[0]?.company.name}
              </p>
              <p class="mt-2 text-sm leading-7 text-muted-foreground">
                {postBubbleDataset.rows[0]
                  ? `${formatMoneyRange(postBubbleDataset.rows[0].currentMarketCap)} current · ${formatMoneyRange(postBubbleDataset.rows[0].residualMarketCap)} residual`
                  : "No companies available."}
              </p>
            </div>
            <Button as="a" href="/insights/post-bubble">
              Open the post-bubble view
            </Button>
          </ContentCard>

          <ContentCard class="space-y-5">
            <div class="flex flex-wrap gap-2">
              <Badge tone="accent">Page 2</Badge>
              <Badge tone="muted">Moat vs decentralizability</Badge>
            </div>
            <div class="space-y-3">
              <h2 class="text-2xl font-semibold tracking-tight">Capital release atlas</h2>
              <p class="text-sm leading-7 text-muted-foreground">
                Plot the sample on a moat-versus-decentralizability map, size the bubbles by market
                cap, and rank the largest implied capital releases.
              </p>
            </div>
            <div class="rounded-2xl border border-border bg-background/55 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Largest current exposure
              </p>
              <p class="mt-2 text-xl font-semibold text-title-foreground">
                {topCapitalAtRiskPoint?.company.name ?? "—"}
              </p>
              <p class="mt-2 text-sm leading-7 text-muted-foreground">
                {topCapitalAtRiskPoint
                  ? `${formatMoneyRange(topCapitalAtRiskPoint.freedCapitalPotential)} exposed · ${Math.round(topCapitalAtRiskPoint.capitalAtRiskShare * 100)}% of current cap`
                  : "No companies available."}
              </p>
            </div>
            <Button as="a" href="/insights/capital-at-risk">
              Open the atlas
            </Button>
          </ContentCard>

          <ContentCard class="space-y-5">
            <div class="flex flex-wrap gap-2">
              <Badge tone="accent">Page 3</Badge>
              <Badge tone="muted">Replacement landscape</Badge>
            </div>
            <div class="space-y-3">
              <h2 class="text-2xl font-semibold tracking-tight">Alternative pressure index</h2>
              <p class="text-sm leading-7 text-muted-foreground">
                Rank products and companies by how viable the documented alternatives already look,
                with special attention to readiness and cost leverage instead of pure ideological
                niceness.
              </p>
            </div>
            <div class="rounded-2xl border border-border bg-background/55 p-4">
              <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Highest documented company pressure
              </p>
              <p class="mt-2 text-xl font-semibold text-title-foreground">
                {topPressureCompany?.company.name ?? "—"}
              </p>
              <p class="mt-2 text-sm leading-7 text-muted-foreground">
                {topPressureCompany && topPressureCompany.pressureScore !== null
                  ? `${topPressureCompany.pressureScore.toFixed(1)}/10 pressure score · ${topPressureCompany.alternativeCount} documented alternatives`
                  : "No alternatives documented yet."}
              </p>
            </div>
            <Button as="a" href="/insights/alternative-pressure">
              Open the pressure index
            </Button>
          </ContentCard>
        </div>

        <ContentCard class="space-y-5">
          <div class="space-y-3">
            <h2 class="text-2xl font-semibold tracking-tight">Why this section exists</h2>
            <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              The registry is where the evidence lives. The insights section is where the site
              admits what story it thinks the evidence is already telling. That means visual pages,
              explicit caveats, and enough structure that readers can disagree without pretending
              there is no argument here at all.
            </p>
          </div>
          <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <A href="/companies" class="hover:text-accent-foreground">
              Browse the underlying registry →
            </A>
            <A href="/methodology" class="hover:text-accent-foreground">
              Review the scoring assumptions →
            </A>
          </div>
        </ContentCard>
      </div>
    </>
  );
}
