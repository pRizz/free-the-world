import { For } from "solid-js";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import { getPostBubbleDataset } from "~/lib/domain/insights";

const dataset = getPostBubbleDataset();
const previewRows = dataset.rows.slice(0, 4);
const maxCurrentMarketCap = Math.max(...previewRows.map((row) => row.currentMarketCap), 1);

export function PostBubblePreview() {
  if (previewRows.length === 0) {
    return (
      <div class="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-sm leading-7 text-muted-foreground">
        The repricing preview will appear once companies with IPO baselines are published.
      </div>
    );
  }

  return (
    <div class="space-y-4">
      <div class="grid gap-2 sm:grid-cols-2">
        <article class="rounded-2xl border border-border bg-background/55 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Sample</p>
          <p class="mt-2 text-lg font-semibold text-title-foreground">
            {dataset.rows.length} IPO baselines
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            {dataset.excludedCompanies.length} published company still missing the IPO comparison.
          </p>
        </article>
        <article class="rounded-2xl border border-border bg-background/55 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">At risk</p>
          <p class="mt-2 text-lg font-semibold text-title-foreground">
            {formatMoneyRange(dataset.totalFreedCapitalPotential)}
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Directional value currently modeled as challengeable.
          </p>
        </article>
      </div>

      <div class="space-y-3">
        <For each={previewRows}>
          {(row) => {
            const currentWidthPercent = (row.currentMarketCap / maxCurrentMarketCap) * 100;
            const residualWidthPercent = (row.residualMarketCap / row.currentMarketCap) * 100;
            const atRiskWidthPercent = (row.freedCapitalPotential / row.currentMarketCap) * 100;

            return (
              <article class="rounded-2xl border border-border bg-card/70 p-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p class="font-medium text-foreground">{row.company.name}</p>
                    <p class="text-sm text-muted-foreground">
                      {formatMoneyRange(row.currentMarketCap)} now {"·"}{" "}
                      {formatMoneyRange(row.residualMarketCap)} residual
                    </p>
                  </div>
                  <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {formatMetricValue(row.capitalAtRiskShare, "percentage", 0)} challenged
                  </p>
                </div>

                <div class="mt-3 rounded-full border border-border/70 bg-background/60 p-1">
                  <div
                    class="flex h-3 overflow-hidden rounded-full bg-secondary/85"
                    style={{ width: `${currentWidthPercent}%` }}
                    title={`${row.company.name}: ${formatMoneyRange(row.freedCapitalPotential)} at risk`}
                  >
                    <div
                      class="bg-success/80"
                      style={{ width: `${Math.max(0, residualWidthPercent)}%` }}
                    />
                    <div
                      class="bg-[color-mix(in_hsl,var(--warning),transparent_18%)]"
                      style={{ width: `${Math.max(0, atRiskWidthPercent)}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          }}
        </For>
      </div>
    </div>
  );
}
