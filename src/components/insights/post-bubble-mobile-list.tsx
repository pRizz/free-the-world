import { For } from "solid-js";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import type { PostBubbleRow } from "~/lib/domain/insights";

export function PostBubbleMobileList(props: { rows: PostBubbleRow[] }) {
  return (
    <div class="space-y-4 md:hidden">
      <For each={props.rows}>
        {(row) => (
          <article class="rounded-2xl border border-border bg-card/60 p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold tracking-tight">{row.company.name}</h3>
                <p class="text-sm text-muted-foreground">{row.company.ticker}</p>
              </div>
              <div class="rounded-full border border-border bg-background/55 px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {formatMetricValue(row.capitalAtRiskShare, "percentage", 1)} challenged
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">IPO cap</p>
                <p class="mt-2 text-lg font-semibold">{formatMoneyRange(row.ipoMarketCap)}</p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Current cap
                </p>
                <p class="mt-2 text-lg font-semibold">{formatMoneyRange(row.currentMarketCap)}</p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Residual cap
                </p>
                <p class="mt-2 text-lg font-semibold">{formatMoneyRange(row.residualMarketCap)}</p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">At risk</p>
                <p class="mt-2 text-lg font-semibold">
                  {formatMoneyRange(row.freedCapitalPotential)}
                </p>
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">IPO x</p>
                <p class="mt-2 text-base font-medium">
                  {formatMetricValue(row.ipoReturnMultiplier, "ratio", 1)}
                </p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">IPO CAGR</p>
                <p class="mt-2 text-base font-medium">
                  {formatMetricValue(row.ipoAnnualizedGrowthRate, "percentage", 1)}
                </p>
              </div>
            </div>
          </article>
        )}
      </For>
    </div>
  );
}
