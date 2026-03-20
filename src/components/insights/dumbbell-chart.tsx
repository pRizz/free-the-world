import { For } from "solid-js";
import { formatMoneyRange } from "~/lib/domain/formatters";
import type { PostBubbleRow } from "~/lib/domain/insights";

const axisTicks = [
  10_000_000, 100_000_000, 1_000_000_000, 10_000_000_000, 100_000_000_000, 1_000_000_000_000,
  10_000_000_000_000,
];

export function DumbbellChart(props: { rows: PostBubbleRow[] }) {
  const viewBoxWidth = 860;
  const viewBoxHeight = props.rows.length * 58 + 96;
  const labelWidth = 190;
  const plotStart = 220;
  const plotEnd = 760;
  const rightValueX = 785;
  const minValue = axisTicks[0];
  const maxValue = axisTicks[axisTicks.length - 1];

  function scale(value: number) {
    const minLog = Math.log10(minValue);
    const maxLog = Math.log10(maxValue);
    const safeValue = Math.max(value, minValue);
    const normalized = (Math.log10(safeValue) - minLog) / (maxLog - minLog);
    return plotStart + normalized * (plotEnd - plotStart);
  }

  return (
    <div class="overflow-x-auto rounded-2xl border border-border bg-background/45 p-4">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        class="min-w-[780px]"
        role="img"
        aria-label="Post-bubble comparison chart showing thesis-adjusted residual cap and current market cap on a log scale."
      >
        <defs>
          <linearGradient id="post-bubble-line" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stop-color="hsl(150 45% 42%)" />
            <stop offset="100%" stop-color="rgb(125 211 252 / 0.85)" />
          </linearGradient>
        </defs>

        <text
          x={labelWidth}
          y={24}
          class="fill-muted-foreground text-[12px] tracking-[0.24em] uppercase"
          text-anchor="end"
        >
          Company
        </text>
        <text
          x={plotStart}
          y={24}
          class="fill-muted-foreground text-[12px] tracking-[0.24em] uppercase"
        >
          Market cap markers
        </text>
        <text
          x={rightValueX}
          y={24}
          class="fill-muted-foreground text-[12px] tracking-[0.24em] uppercase"
          text-anchor="end"
        >
          Current cap
        </text>

        <For each={axisTicks}>
          {(tick) => {
            const x = scale(tick);

            return (
              <g>
                <line
                  x1={x}
                  x2={x}
                  y1={38}
                  y2={viewBoxHeight - 22}
                  stroke="rgb(148 163 184 / 0.15)"
                  stroke-width="1"
                />
                <text x={x} y={48} class="fill-muted-foreground text-[11px]" text-anchor="middle">
                  {formatMoneyRange(tick)}
                </text>
              </g>
            );
          }}
        </For>

        <For each={props.rows}>
          {(row, index) => {
            const y = index() * 58 + 88;
            const residualX = scale(row.residualMarketCap);
            const currentX = scale(row.currentMarketCap);

            return (
              <g>
                <title>
                  {`${row.company.name}: residual ${formatMoneyRange(row.residualMarketCap)}, current ${formatMoneyRange(row.currentMarketCap)}`}
                </title>
                <text
                  x={labelWidth}
                  y={y - 7}
                  class="fill-title-foreground text-[14px]"
                  text-anchor="end"
                >
                  {row.company.name}
                </text>
                <text
                  x={labelWidth}
                  y={y + 11}
                  class="fill-muted-foreground text-[11px]"
                  text-anchor="end"
                >
                  {row.company.ticker} · {Math.round(row.capitalAtRiskShare * 100)}% challenged
                </text>

                <line
                  x1={plotStart}
                  x2={plotEnd}
                  y1={y}
                  y2={y}
                  stroke="rgb(148 163 184 / 0.12)"
                  stroke-width="2"
                />
                <line
                  x1={residualX}
                  x2={currentX}
                  y1={y}
                  y2={y}
                  stroke="url(#post-bubble-line)"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <circle cx={residualX} cy={y} r="7" fill="hsl(150 45% 42%)" />
                <circle cx={currentX} cy={y} r="8" fill="rgb(125 211 252 / 0.95)" />
                <text
                  x={rightValueX}
                  y={y + 5}
                  class="fill-foreground text-[12px]"
                  text-anchor="end"
                >
                  {formatMoneyRange(row.currentMarketCap)}
                </text>
              </g>
            );
          }}
        </For>
      </svg>
    </div>
  );
}
