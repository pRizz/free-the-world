import { For } from "solid-js";
import type {
  AlternativeMetricAverages,
  AlternativePressureProductRow,
} from "~/lib/domain/insights";

function formatScore(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}/10`;
}

function metricValue(
  averages: AlternativeMetricAverages | null,
  metric: keyof AlternativeMetricAverages,
) {
  return averages ? averages[metric] : null;
}

function widthFor(value: number | null) {
  return `${Math.max(0, Math.min(100, (value ?? 0) * 10))}%`;
}

function MetricBar(props: { label: string; value: number | null }) {
  return (
    <div class="min-w-0 space-y-2">
      <div class="flex min-w-0 items-center justify-between gap-3 text-sm">
        <span class="min-w-0 break-words text-muted-foreground [overflow-wrap:anywhere]">
          {props.label}
        </span>
        <span class="shrink-0 font-medium text-foreground">{formatScore(props.value)}</span>
      </div>
      <div class="h-2 rounded-full bg-secondary/85">
        <div
          class="h-full rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,0.7),rgba(74,222,128,0.7))]"
          style={{ width: widthFor(props.value) }}
        />
      </div>
    </div>
  );
}

export function AlternativePressureMobileCards(props: { rows: AlternativePressureProductRow[] }) {
  return (
    <div class="min-w-0 space-y-4 md:hidden">
      <For each={props.rows}>
        {(row) => (
          <article class="min-w-0 max-w-full rounded-2xl border border-border bg-card/60 p-4">
            <div class="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0 space-y-1">
                <h3 class="break-words text-lg font-semibold tracking-tight [overflow-wrap:anywhere]">
                  {row.product.name}
                </h3>
                <p class="break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">
                  {row.company.name} · {row.product.category}
                </p>
              </div>
              <div class="min-w-0 w-full rounded-2xl border border-border bg-background/55 px-3 py-2 text-left sm:w-auto sm:shrink-0 sm:text-right">
                <p class="break-words text-xs uppercase tracking-[0.22em] text-muted-foreground [overflow-wrap:anywhere]">
                  Pressure
                </p>
                <p class="mt-1 break-words text-base font-semibold [overflow-wrap:anywhere]">
                  {formatScore(row.pressureScore)}
                </p>
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="min-w-0 rounded-2xl border border-border bg-background/55 p-3">
                <p class="break-words text-xs uppercase tracking-[0.22em] text-muted-foreground [overflow-wrap:anywhere]">
                  Alternatives
                </p>
                <p class="mt-2 break-words text-base font-medium [overflow-wrap:anywhere]">
                  {row.alternativeCount}
                </p>
              </div>
              <div class="min-w-0 rounded-2xl border border-border bg-background/55 p-3">
                <p class="break-words text-xs uppercase tracking-[0.22em] text-muted-foreground [overflow-wrap:anywhere]">
                  Status
                </p>
                <p class="mt-2 break-words text-base font-medium [overflow-wrap:anywhere]">
                  {row.hasDocumentedAlternatives ? "Documented pressure" : "Research gap"}
                </p>
              </div>
            </div>

            <div class="mt-4 min-w-0 space-y-3">
              <MetricBar label="Readiness" value={metricValue(row.averages, "readiness")} />
              <MetricBar label="Cost leverage" value={metricValue(row.averages, "costLeverage")} />
              <MetricBar label="Openness" value={metricValue(row.averages, "openness")} />
              <MetricBar
                label="Decentralization fit"
                value={metricValue(row.averages, "decentralizationFit")}
              />
            </div>

            <div class="mt-4 min-w-0 break-words rounded-2xl border border-border bg-background/55 p-3 text-sm leading-7 text-muted-foreground [overflow-wrap:anywhere]">
              {row.hasDocumentedAlternatives
                ? row.alternativeNames.join(", ")
                : "No meaningful alternatives documented yet."}
            </div>
          </article>
        )}
      </For>
    </div>
  );
}
