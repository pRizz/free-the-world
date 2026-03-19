import { For } from "solid-js";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import type { CapitalAtRiskPoint } from "~/lib/domain/insights";

function scoreBarWidth(score: number) {
  return `${Math.max(0, Math.min(100, score * 10))}%`;
}

export function CapitalAtRiskMobileList(props: { points: CapitalAtRiskPoint[] }) {
  return (
    <div class="space-y-4 md:hidden">
      <For each={props.points}>
        {(point) => (
          <article class="rounded-2xl border border-border bg-card/60 p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold tracking-tight">{point.company.name}</h3>
                <p class="text-sm leading-7 text-muted-foreground">{point.company.description}</p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 px-3 py-2 text-right">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">At risk</p>
                <p class="mt-1 text-base font-semibold">
                  {formatMoneyRange(point.freedCapitalPotential)}
                </p>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <div>
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-muted-foreground">Moat</span>
                  <span class="font-medium text-foreground">{point.moat.toFixed(1)}/10</span>
                </div>
                <div class="mt-2 h-2 rounded-full bg-secondary/85">
                  <div class="h-full rounded-full bg-sky-300/85" style={{ width: scoreBarWidth(point.moat) }} />
                </div>
              </div>
              <div>
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="text-muted-foreground">Decentralizability</span>
                  <span class="font-medium text-foreground">
                    {point.decentralizability.toFixed(1)}/10
                  </span>
                </div>
                <div class="mt-2 h-2 rounded-full bg-secondary/85">
                  <div
                    class="h-full rounded-full bg-warning/85"
                    style={{ width: scoreBarWidth(point.decentralizability) }}
                  />
                </div>
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Current cap
                </p>
                <p class="mt-2 text-base font-medium">{formatMoneyRange(point.marketCap)}</p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Share challenged
                </p>
                <p class="mt-2 text-base font-medium">
                  {formatMetricValue(point.capitalAtRiskShare, "percentage", 1)}
                </p>
              </div>
            </div>
          </article>
        )}
      </For>
    </div>
  );
}
