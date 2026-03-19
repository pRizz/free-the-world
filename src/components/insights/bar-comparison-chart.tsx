import { For } from "solid-js";
import { formatMoneyRange } from "~/lib/domain/formatters";
import type { PostBubbleRow } from "~/lib/domain/insights";

export function BarComparisonChart(props: {
  rows: PostBubbleRow[];
  title?: string;
  description?: string;
}) {
  const maxCurrentMarketCap = Math.max(...props.rows.map((row) => row.currentMarketCap), 1);

  return (
    <section class="space-y-4" aria-labelledby="bar-comparison-chart-title">
      {props.title ? (
        <div class="space-y-2">
          <h3 id="bar-comparison-chart-title" class="text-xl font-semibold tracking-tight">
            {props.title}
          </h3>
          {props.description ? (
            <p class="text-sm leading-7 text-muted-foreground">{props.description}</p>
          ) : null}
        </div>
      ) : null}

      <div class="space-y-4">
        <For each={props.rows}>
          {(row) => {
            const widthPercent = (row.currentMarketCap / maxCurrentMarketCap) * 100;
            const residualPercent = (row.residualMarketCap / row.currentMarketCap) * 100;
            const atRiskPercent = (row.freedCapitalPotential / row.currentMarketCap) * 100;

            return (
              <article class="space-y-2 rounded-2xl border border-border bg-card/55 p-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p class="font-medium text-foreground">{row.company.name}</p>
                    <p class="text-sm text-muted-foreground">
                      Residual {formatMoneyRange(row.residualMarketCap)} · At risk{" "}
                      {formatMoneyRange(row.freedCapitalPotential)}
                    </p>
                  </div>
                  <p class="text-sm text-muted-foreground">
                    Current market cap {formatMoneyRange(row.currentMarketCap)}
                  </p>
                </div>

                <div class="rounded-2xl border border-border/70 bg-background/55 p-3">
                  <div class="h-4 rounded-full bg-secondary/85" style={{ width: `${widthPercent}%` }}>
                    <div
                      class="flex h-full overflow-hidden rounded-full"
                      title={`${row.company.name}: residual ${formatMoneyRange(row.residualMarketCap)}, at risk ${formatMoneyRange(row.freedCapitalPotential)}`}
                    >
                      <div
                        class="bg-success/75"
                        style={{ width: `${Math.max(0, residualPercent)}%` }}
                      />
                      <div
                        class="bg-[color-mix(in_hsl,var(--warning),transparent_18%)]"
                        style={{ width: `${Math.max(0, atRiskPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          }}
        </For>
      </div>
    </section>
  );
}
