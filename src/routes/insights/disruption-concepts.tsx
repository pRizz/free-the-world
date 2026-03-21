import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { PageHeader } from "~/components/blocks/page-header";
import { InsightKpiStrip } from "~/components/insights/insight-kpi-strip";
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
import { getDisruptionConceptDataset } from "~/lib/domain/insights";

const dataset = getDisruptionConceptDataset();

function formatScore(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}/10`;
}

export default function DisruptionConceptsPage() {
  const topProduct = dataset.productRows.find((row) => row.hasDocumentedConcepts);
  const topCompany = dataset.companyRows.find((row) => row.hasDocumentedConcepts);

  return (
    <>
      <Seo
        title="Disruption concept index · Free The World"
        description="Rank the original product concepts in the registry by how credible, buildable, and pressure-inducing they currently look."
        route="/insights/disruption-concepts"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Insights · Disruption concepts"
          title="Which original concepts look most capable of breaking the lineup?"
          description="This page is deliberately separate from the alternative pressure index. Existing alternatives and original concepts answer different questions, so they should not share a score just because they both challenge incumbents."
        />

        <InsightKpiStrip
          items={[
            {
              label: "Concepts tracked",
              value: `${dataset.totalConceptCount}`,
              note: "Structured product ideas across the currently published bundle set.",
            },
            {
              label: "Products with concepts",
              value: `${dataset.productsWithConcepts}/${dataset.productRows.length}`,
              note: "Products without a concept should be exceptions, not silent omissions.",
            },
            {
              label: "Documented exceptions",
              value: `${dataset.productsWithExceptions}`,
              note: "Rare cases where a credible concept would currently be overstated.",
            },
            {
              label: "Average concept score",
              value: formatScore(dataset.averageConceptScore),
              note: "Weighted toward feasibility and incumbent pressure.",
            },
          ]}
        />

        <div class="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Company rankings"
              title="Who has the strongest offensive idea stack?"
              description="These cards aggregate concept metrics across each company's published products while keeping documented exceptions visible instead of treating them as missing data."
            />

            <div class="space-y-4">
              <For each={dataset.companyRows}>
                {(row) => (
                  <MetricCard
                    label={`${row.company.name} · ${row.conceptCount} concepts`}
                    value={formatScore(row.conceptScore)}
                  >
                    {row.hasDocumentedConcepts
                      ? `${row.productsWithConcepts} of ${row.productCount} published products have structured concepts. ${row.productsWithExceptions} product currently use documented exceptions.`
                      : "No structured concepts published yet."}
                    {row.highestScoringProduct ? (
                      <span>
                        {" "}
                        Highest-scoring product:{" "}
                        <span class="font-medium text-foreground">
                          {row.highestScoringProduct.product.name}
                        </span>
                        .
                      </span>
                    ) : null}
                  </MetricCard>
                )}
              </For>
            </div>
          </ContentCard>

          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Product rankings"
              title="Where the original disruption story is strongest"
              description="High scores here do not mean the concept is inevitable. They mean the mechanism looks more coherent, more buildable, and more likely to create strategic pressure if pursued seriously."
            />

            <Table>
              <TableElement>
                <TableHeader>
                  <tr>
                    <TableHead>Product</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Concepts</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                  </tr>
                </TableHeader>
                <TableBody>
                  <For each={dataset.productRows}>
                    {(row) => (
                      <TableRow>
                        <TableCell class="space-y-2">
                          <p class="font-semibold text-foreground">{row.product.name}</p>
                          {row.conceptNames.length > 0 ? (
                            <p class="max-w-sm leading-7 text-muted-foreground">
                              {row.conceptNames.join(", ")}
                            </p>
                          ) : (
                            <p class="max-w-sm leading-7 text-muted-foreground">
                              {row.exceptionReason ?? "No concept documented yet."}
                            </p>
                          )}
                        </TableCell>
                        <TableCell class="text-muted-foreground">{row.company.name}</TableCell>
                        <TableCell>{row.conceptCount}</TableCell>
                        <TableCell>{formatScore(row.conceptScore)}</TableCell>
                        <TableCell class="text-muted-foreground">
                          {row.hasDocumentedConcepts
                            ? "Concepts published"
                            : row.hasDocumentedException
                              ? "Documented exception"
                              : "Research gap"}
                        </TableCell>
                      </TableRow>
                    )}
                  </For>
                </TableBody>
              </TableElement>
            </Table>
          </ContentCard>
        </div>

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Interpretation"
            title="What this score is trying to reward"
            description="The point is not to celebrate cleverness. The point is to surface concepts that could plausibly survive contact with incentives, implementation costs, and cheating pressure."
          />
          <div class="grid gap-4 lg:grid-cols-3">
            <MetricCard label="Feasibility">
              Ideas score higher when they can be built with today's primitives instead of a future
              miracle stack.
            </MetricCard>
            <MetricCard label="Coordination">
              The best concepts explain who does the work, how they get paid, and how the system
              notices fraud.
            </MetricCard>
            <MetricCard label="Pressure">
              A concept matters more when it can change price, defaults, or bargaining power for the
              incumbent.
            </MetricCard>
          </div>
          {topProduct && topCompany ? (
            <p class="text-sm leading-7 text-muted-foreground">
              Right now the strongest published concept story belongs to{" "}
              <span class="font-medium text-foreground">{topCompany.company.name}</span>, led by{" "}
              <span class="font-medium text-foreground">{topProduct.product.name}</span>.
            </p>
          ) : null}
        </ContentCard>
      </div>
    </>
  );
}
