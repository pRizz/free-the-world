import { For } from "solid-js";
import { formatMoneyRange } from "~/lib/domain/formatters";
import type { CapitalAtRiskPoint } from "~/lib/domain/insights";

export function QuadrantChart(props: { points: CapitalAtRiskPoint[] }) {
  const viewBoxWidth = 760;
  const viewBoxHeight = 560;
  const marginLeft = 84;
  const marginTop = 36;
  const marginRight = 42;
  const marginBottom = 90;
  const plotWidth = viewBoxWidth - marginLeft - marginRight;
  const plotHeight = viewBoxHeight - marginTop - marginBottom;
  const maxMarketCap = Math.max(...props.points.map((point) => point.marketCap), 1);
  const midpointX = marginLeft + plotWidth / 2;
  const midpointY = marginTop + plotHeight / 2;

  function scaleX(value: number) {
    return marginLeft + (value / 10) * plotWidth;
  }

  function scaleY(value: number) {
    return marginTop + plotHeight - (value / 10) * plotHeight;
  }

  function radiusFor(point: CapitalAtRiskPoint) {
    return 10 + Math.sqrt(point.marketCap / maxMarketCap) * 22;
  }

  function fillOpacityFor(point: CapitalAtRiskPoint) {
    return 0.35 + point.capitalAtRiskShare * 0.45;
  }

  return (
    <div class="overflow-x-auto rounded-2xl border border-border bg-background/45 p-4">
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        class="min-w-[700px]"
        role="img"
        aria-label="Quadrant chart plotting company moat against decentralizability, with bubble size representing market cap."
      >
        <rect
          x={marginLeft}
          y={marginTop}
          width={plotWidth / 2}
          height={plotHeight / 2}
          fill="rgb(15 23 42 / 0.18)"
        />
        <rect
          x={midpointX}
          y={marginTop}
          width={plotWidth / 2}
          height={plotHeight / 2}
          fill="rgb(56 189 248 / 0.08)"
        />
        <rect
          x={marginLeft}
          y={midpointY}
          width={plotWidth / 2}
          height={plotHeight / 2}
          fill="rgb(30 41 59 / 0.12)"
        />
        <rect
          x={midpointX}
          y={midpointY}
          width={plotWidth / 2}
          height={plotHeight / 2}
          fill="rgb(234 179 8 / 0.08)"
        />

        <For each={[0, 2, 4, 6, 8, 10]}>
          {(tick) => (
            <g>
              <line
                x1={scaleX(tick)}
                x2={scaleX(tick)}
                y1={marginTop}
                y2={marginTop + plotHeight}
                stroke="rgb(148 163 184 / 0.18)"
                stroke-width="1"
              />
              <line
                x1={marginLeft}
                x2={marginLeft + plotWidth}
                y1={scaleY(tick)}
                y2={scaleY(tick)}
                stroke="rgb(148 163 184 / 0.18)"
                stroke-width="1"
              />
              <text
                x={scaleX(tick)}
                y={marginTop + plotHeight + 24}
                class="fill-muted-foreground text-[12px]"
                text-anchor="middle"
              >
                {tick}
              </text>
              <text
                x={marginLeft - 18}
                y={scaleY(tick) + 4}
                class="fill-muted-foreground text-[12px]"
                text-anchor="end"
              >
                {tick}
              </text>
            </g>
          )}
        </For>

        <line
          x1={marginLeft}
          x2={marginLeft + plotWidth}
          y1={marginTop + plotHeight}
          y2={marginTop + plotHeight}
          stroke="rgb(226 232 240 / 0.4)"
          stroke-width="2"
        />
        <line
          x1={marginLeft}
          x2={marginLeft}
          y1={marginTop}
          y2={marginTop + plotHeight}
          stroke="rgb(226 232 240 / 0.4)"
          stroke-width="2"
        />
        <line
          x1={midpointX}
          x2={midpointX}
          y1={marginTop}
          y2={marginTop + plotHeight}
          stroke="rgb(226 232 240 / 0.24)"
          stroke-dasharray="6 8"
          stroke-width="2"
        />
        <line
          x1={marginLeft}
          x2={marginLeft + plotWidth}
          y1={midpointY}
          y2={midpointY}
          stroke="rgb(226 232 240 / 0.24)"
          stroke-dasharray="6 8"
          stroke-width="2"
        />

        <text
          x={marginLeft + plotWidth / 2}
          y={viewBoxHeight - 22}
          class="fill-muted-foreground text-[13px] tracking-[0.22em] uppercase"
          text-anchor="middle"
        >
          Decentralizability
        </text>
        <text
          x={20}
          y={marginTop + plotHeight / 2}
          class="fill-muted-foreground text-[13px] tracking-[0.22em] uppercase"
          text-anchor="middle"
          transform={`rotate(-90 20 ${marginTop + plotHeight / 2})`}
        >
          Moat
        </text>

        <text x={marginLeft + 14} y={marginTop + 22} class="fill-muted-foreground text-[12px]">
          Defensive now
        </text>
        <text
          x={marginLeft + plotWidth - 14}
          y={marginTop + 22}
          class="fill-muted-foreground text-[12px]"
          text-anchor="end"
        >
          Strong moat, open attack surface
        </text>
        <text
          x={marginLeft + plotWidth - 14}
          y={marginTop + plotHeight - 12}
          class="fill-muted-foreground text-[12px]"
          text-anchor="end"
        >
          Easy to unbundle
        </text>

        <For each={props.points}>
          {(point) => {
            const x = scaleX(point.decentralizability);
            const y = scaleY(point.moat);
            const radius = radiusFor(point);

            return (
              <g>
                <title>
                  {`${point.company.name}: moat ${point.moat}/10, decentralizability ${point.decentralizability}/10, market cap ${formatMoneyRange(point.marketCap)}, freed-capital potential ${formatMoneyRange(point.freedCapitalPotential)}`}
                </title>
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  fill={`rgb(125 211 252 / ${fillOpacityFor(point)})`}
                  stroke="rgb(226 232 240 / 0.55)"
                  stroke-width="1.5"
                />
                <text
                  x={x}
                  y={y + 4}
                  class="fill-foreground text-[11px] font-medium"
                  text-anchor="middle"
                >
                  {point.company.ticker}
                </text>
              </g>
            );
          }}
        </For>
      </svg>
    </div>
  );
}
