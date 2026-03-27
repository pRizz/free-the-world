import { For } from "solid-js";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import { getMarketCapCoverageDataset } from "~/lib/domain/insights";

const dataset = getMarketCapCoverageDataset();
const highlightedRows = dataset.rows.slice(0, 3);
const pieRadius = 82;
const pieCircumference = 2 * Math.PI * pieRadius;
const disruptedShare = dataset.totalCurrentMarketCap
  ? dataset.totalDisruptedMarketCap / dataset.totalCurrentMarketCap
  : 0;
const residualShare = Math.max(0, 1 - disruptedShare);
const disruptedStrokeLength = pieCircumference * disruptedShare;
const residualStrokeLength = pieCircumference * residualShare;

export function MarketCapDisruptionPreview() {
  if (dataset.rows.length === 0 || dataset.totalCurrentMarketCap <= 0) {
    return (
      <div class="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-sm leading-7 text-muted-foreground">
        The market-cap disruption preview will appear once the registry has an analyzed S&amp;P 500
        sample with market-cap coverage.
      </div>
    );
  }

  return (
    <div class="space-y-4">
      <div class="grid gap-3 sm:grid-cols-[0.95fr_1.05fr]">
        <div class="rounded-2xl border border-border bg-background/55 p-4">
          <svg
            viewBox="0 0 220 220"
            class="mx-auto max-w-[15rem]"
            role="img"
            aria-label="Pie chart showing the analyzed S&P 500 market cap split between thesis-adjusted disrupted value and residual value."
          >
            <circle
              cx="110"
              cy="110"
              r={pieRadius}
              fill="none"
              stroke="rgb(51 65 85 / 0.35)"
              stroke-width="32"
            />
            <circle
              cx="110"
              cy="110"
              r={pieRadius}
              fill="none"
              stroke="rgb(245 158 11 / 0.88)"
              stroke-width="32"
              stroke-dasharray={`${disruptedStrokeLength} ${pieCircumference}`}
              stroke-linecap="butt"
              transform="rotate(-90 110 110)"
            />
            <circle
              cx="110"
              cy="110"
              r={pieRadius}
              fill="none"
              stroke="rgb(125 211 252 / 0.9)"
              stroke-width="32"
              stroke-dasharray={`${residualStrokeLength} ${pieCircumference}`}
              stroke-dashoffset={-disruptedStrokeLength}
              stroke-linecap="butt"
              transform="rotate(-90 110 110)"
            />
            <circle cx="110" cy="110" r="54" fill="rgb(2 6 23 / 0.92)" />
            <text
              x="110"
              y="104"
              text-anchor="middle"
              class="fill-muted-foreground text-[11px] uppercase tracking-[0.24em]"
            >
              Disrupted
            </text>
            <text
              x="110"
              y="126"
              text-anchor="middle"
              class="fill-foreground text-[22px] font-semibold"
            >
              {formatMetricValue(disruptedShare, "percentage", 0)}
            </text>
          </svg>
        </div>

        <div class="grid gap-2">
          <article class="rounded-2xl border border-border bg-background/55 p-3">
            <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Analyzed S&amp;P 500 sample
            </p>
            <p class="mt-2 text-lg font-semibold text-title-foreground">
              {formatMoneyRange(dataset.totalCurrentMarketCap)}
            </p>
            <p class="mt-2 text-sm text-muted-foreground">
              {dataset.analyzedCompanyCount} published companies with both thesis coverage and
              market caps.
            </p>
          </article>
          <article class="rounded-2xl border border-border bg-background/55 p-3">
            <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Predicted disruption
            </p>
            <p class="mt-2 text-lg font-semibold text-title-foreground">
              {formatMoneyRange(dataset.totalDisruptedMarketCap)}
            </p>
            <p class="mt-2 text-sm text-muted-foreground">
              Fresh caps multiplied by the site's existing disruption-share analysis.
            </p>
          </article>
          <article class="rounded-2xl border border-border bg-background/55 p-3">
            <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Latest cap refresh
            </p>
            <p class="mt-2 text-lg font-semibold text-title-foreground">
              {dataset.latestMarketCapSnapshotAt?.slice(0, 10) ?? "Published sample"}
            </p>
            <p class="mt-2 text-sm text-muted-foreground">
              {dataset.staleThesisCompanyCount} company thesis review
              {dataset.staleThesisCompanyCount === 1 ? "" : "s"} may trail the freshest tape.
            </p>
          </article>
        </div>
      </div>

      <div class="grid gap-2 sm:grid-cols-3">
        <For each={highlightedRows}>
          {(row) => (
            <article class="rounded-2xl border border-border bg-card/70 p-3">
              <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {row.company.ticker}
              </p>
              <p class="mt-2 text-sm font-semibold text-title-foreground">{row.company.name}</p>
              <p class="mt-2 text-sm text-muted-foreground">
                {formatMoneyRange(row.disruptedMarketCap)} disrupted
              </p>
              <p class="text-xs text-muted-foreground">
                {formatMetricValue(row.disruptionShare, "percentage", 0)} of{" "}
                {formatMoneyRange(row.currentMarketCap)}
              </p>
            </article>
          )}
        </For>
      </div>
    </div>
  );
}
