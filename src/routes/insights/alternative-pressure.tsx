import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { AlternativePressureMobileCards } from "~/components/insights/alternative-pressure-mobile-cards";
import { PageHeader } from "~/components/blocks/page-header";
import { InsightKpiStrip } from "~/components/insights/insight-kpi-strip";
import { PressureHeatmap } from "~/components/insights/pressure-heatmap";
import { Seo } from "~/components/seo";
import { getAlternativePressureDataset } from "~/lib/domain/insights";

const dataset = getAlternativePressureDataset();

function formatScore(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}/10`;
}

export default function AlternativePressurePage() {
  const topProduct = dataset.productRows.find((row) => row.hasDocumentedAlternatives);
  const topCompany = dataset.companyRows.find((row) => row.hasDocumentedAlternatives);

  return (
    <>
      <Seo
        title="Alternative pressure index · Free The World"
        description="See which products and companies in the published registry already face the strongest documented substitute pressure from open, decentralized, and cooperative alternatives."
        route="/insights/alternative-pressure"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Insights · Alternative pressure"
          title="Which products already have a real replacement story?"
          description="This page weights readiness and cost leverage more heavily than ideological purity. An alternative only creates real pressure if people can plausibly use it and if its existence changes the incumbent's pricing conversation."
        />

        <InsightKpiStrip
          items={[
            {
              label: "Alternatives tracked",
              value: `${dataset.totalAlternativeCount}`,
              note: "Documented across the currently published product set.",
            },
            {
              label: "Products with pressure",
              value: `${dataset.documentedProductCount}/${dataset.productRows.length}`,
              note: `${dataset.undocumentedProductCount} product currently sits in the research-gap bucket.`,
            },
            {
              label: "Average pressure score",
              value: formatScore(dataset.averagePressureScore),
              note: "Computed only across the products with documented alternatives.",
            },
            {
              label: "Highest-pressure product",
              value: topProduct?.product.name ?? "—",
              note: topProduct
                ? `${formatScore(topProduct.pressureScore)} pressure score.`
                : "No products available.",
            },
          ]}
        />

        <div class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Company rankings"
              title="Who already has a serious substitute narrative?"
              description="These cards aggregate the alternative metrics across each published company's products, while keeping undocumented zones separate from low-scoring zones."
            />

            <div class="space-y-4">
              <For each={dataset.companyRows}>
                {(row) => (
                  <MetricCard label={`${row.company.name} · ${row.alternativeCount} alternatives`}>
                    <div class="space-y-3">
                      <p class="text-xl font-semibold tracking-tight text-title-foreground">
                        {formatScore(row.pressureScore)}
                      </p>
                      <p>
                        {row.hasDocumentedAlternatives
                          ? `${row.productsWithDocumentedAlternatives} of ${row.productCount} published products currently show documented pressure.`
                          : "No meaningful alternatives documented yet; this is a research gap, not a defensive victory lap."}
                      </p>
                      {row.highestPressureProduct ? (
                        <p>
                          Highest-pressure product:{" "}
                          <span class="font-medium text-foreground">
                            {row.highestPressureProduct.product.name}
                          </span>
                          .
                        </p>
                      ) : null}
                    </div>
                  </MetricCard>
                )}
              </For>
            </div>
          </ContentCard>

          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Product heatmap"
              title="Where the substitute story is already concrete"
              description="Rows with dashes are not low-pressure rows. They are simply products whose alternatives have not yet been documented in the published bundle set."
            />
            <div class="md:hidden">
              <AlternativePressureMobileCards rows={dataset.productRows} />
            </div>
            <div class="hidden md:block">
              <PressureHeatmap rows={dataset.productRows} />
            </div>
          </ContentCard>
        </div>

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Interpretation"
            title="What the score is trying to capture"
            description="Pressure rises when alternatives are both credibly deployable and economically awkward for the incumbent to ignore."
          />
          <div class="grid gap-4 lg:grid-cols-3">
            <MetricCard label="Readiness">
              If the substitute is still mostly a demo, it does not deserve a victory parade yet.
            </MetricCard>
            <MetricCard label="Cost leverage">
              A merely admirable project is less important than one that can change pricing power.
            </MetricCard>
            <MetricCard label="Research gaps">
              Blank rows are invitations to publish more evidence, not excuses to assume the moat is
              unbreakable.
            </MetricCard>
          </div>
          {topCompany ? (
            <p class="text-sm leading-7 text-muted-foreground">
              Right now the strongest published company-level pressure story belongs to{" "}
              <span class="font-medium text-foreground">{topCompany.company.name}</span>, led by{" "}
              <span class="font-medium text-foreground">
                {topCompany.highestPressureProduct?.product.name}
              </span>
              .
            </p>
          ) : null}
        </ContentCard>
      </div>
    </>
  );
}
