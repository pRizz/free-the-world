import { For } from "solid-js";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import { type CapitalAtRiskPoint, getCapitalAtRiskDataset } from "~/lib/domain/insights";

const dataset = getCapitalAtRiskDataset();
const highlightedPoints = dataset.points.slice(0, 3);
const maxMarketCap = Math.max(...dataset.points.map((point) => point.marketCap), 1);

function scaleX(value: number) {
  return 52 + (value / 10) * 236;
}

function scaleY(value: number) {
  return 26 + 166 - (value / 10) * 166;
}

function radiusFor(point: CapitalAtRiskPoint) {
  return 7 + Math.sqrt(point.marketCap / maxMarketCap) * 10;
}

function opacityFor(point: CapitalAtRiskPoint) {
  return 0.35 + point.capitalAtRiskShare * 0.45;
}

export function CapitalAtRiskPreview() {
  if (dataset.points.length === 0) {
    return (
      <div class="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-sm leading-7 text-muted-foreground">
        The capital-at-risk preview will appear once more company metrics are published.
      </div>
    );
  }

  return (
    <div class="space-y-4">
      <div class="rounded-2xl border border-border bg-background/55 p-4">
        <svg
          viewBox="0 0 320 226"
          class="w-full"
          role="img"
          aria-label="Preview map plotting company moat against decentralizability with bubble size representing market cap."
        >
          <rect x="52" y="26" width="118" height="83" fill="rgb(15 23 42 / 0.18)" rx="16" />
          <rect x="170" y="26" width="118" height="83" fill="rgb(56 189 248 / 0.08)" rx="16" />
          <rect x="52" y="109" width="118" height="83" fill="rgb(30 41 59 / 0.12)" rx="16" />
          <rect x="170" y="109" width="118" height="83" fill="rgb(234 179 8 / 0.08)" rx="16" />

          <For each={[0, 5, 10]}>
            {(tick) => (
              <g>
                <line
                  x1={scaleX(tick)}
                  x2={scaleX(tick)}
                  y1="26"
                  y2="192"
                  stroke="rgb(148 163 184 / 0.18)"
                  stroke-width="1"
                />
                <line
                  x1="52"
                  x2="288"
                  y1={scaleY(tick)}
                  y2={scaleY(tick)}
                  stroke="rgb(148 163 184 / 0.18)"
                  stroke-width="1"
                />
                <text
                  x={scaleX(tick)}
                  y="210"
                  class="fill-muted-foreground text-[11px]"
                  text-anchor="middle"
                >
                  {tick}
                </text>
                <text
                  x="38"
                  y={scaleY(tick) + 4}
                  class="fill-muted-foreground text-[11px]"
                  text-anchor="end"
                >
                  {tick}
                </text>
              </g>
            )}
          </For>

          <line
            x1="170"
            x2="170"
            y1="26"
            y2="192"
            stroke="rgb(226 232 240 / 0.24)"
            stroke-dasharray="6 8"
            stroke-width="2"
          />
          <line
            x1="52"
            x2="288"
            y1="109"
            y2="109"
            stroke="rgb(226 232 240 / 0.24)"
            stroke-dasharray="6 8"
            stroke-width="2"
          />

          <text
            x="170"
            y="224"
            class="fill-muted-foreground text-[11px] tracking-[0.18em] uppercase"
            text-anchor="middle"
          >
            Decentralizability
          </text>
          <text
            x="16"
            y="109"
            class="fill-muted-foreground text-[11px] tracking-[0.18em] uppercase"
            text-anchor="middle"
            transform="rotate(-90 16 109)"
          >
            Moat
          </text>

          <For each={dataset.points}>
            {(point) => (
              <g>
                <title>
                  {`${point.company.name}: moat ${point.moat}/10, decentralizability ${point.decentralizability}/10, freed-capital potential ${formatMoneyRange(point.freedCapitalPotential)}`}
                </title>
                <circle
                  cx={scaleX(point.decentralizability)}
                  cy={scaleY(point.moat)}
                  r={radiusFor(point)}
                  fill={`rgb(125 211 252 / ${opacityFor(point)})`}
                  stroke="rgb(226 232 240 / 0.55)"
                  stroke-width="1.5"
                />
                <text
                  x={scaleX(point.decentralizability)}
                  y={scaleY(point.moat) + 3}
                  class="fill-foreground text-[9px] font-medium"
                  text-anchor="middle"
                >
                  {point.company.ticker}
                </text>
              </g>
            )}
          </For>
        </svg>
      </div>

      <div class="grid gap-2 sm:grid-cols-3">
        <For each={highlightedPoints}>
          {(point) => (
            <article class="rounded-2xl border border-border bg-card/70 p-3">
              <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {point.company.ticker}
              </p>
              <p class="mt-2 text-sm font-semibold text-title-foreground">{point.company.name}</p>
              <p class="mt-2 text-sm text-muted-foreground">
                {formatMoneyRange(point.freedCapitalPotential)} exposed
              </p>
              <p class="text-xs text-muted-foreground">
                {formatMetricValue(point.capitalAtRiskShare, "percentage", 0)} of current cap
              </p>
            </article>
          )}
        </For>
      </div>
    </div>
  );
}
