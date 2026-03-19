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
    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3 text-sm">
        <span class="text-muted-foreground">{props.label}</span>
        <span class="font-medium text-foreground">{formatScore(props.value)}</span>
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
    <div class="space-y-4 md:hidden">
      <For each={props.rows}>
        {(row) => (
          <article class="rounded-2xl border border-border bg-card/60 p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold tracking-tight">{row.product.name}</h3>
                <p class="text-sm text-muted-foreground">
                  {row.company.name} · {row.product.category}
                </p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 px-3 py-2 text-right">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Pressure</p>
                <p class="mt-1 text-base font-semibold">{formatScore(row.pressureScore)}</p>
              </div>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Alternatives
                </p>
                <p class="mt-2 text-base font-medium">{row.alternativeCount}</p>
              </div>
              <div class="rounded-2xl border border-border bg-background/55 p-3">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Status</p>
                <p class="mt-2 text-base font-medium">
                  {row.hasDocumentedAlternatives ? "Documented pressure" : "Research gap"}
                </p>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <MetricBar label="Readiness" value={metricValue(row.averages, "readiness")} />
              <MetricBar label="Cost leverage" value={metricValue(row.averages, "costLeverage")} />
              <MetricBar label="Openness" value={metricValue(row.averages, "openness")} />
              <MetricBar
                label="Decentralization fit"
                value={metricValue(row.averages, "decentralizationFit")}
              />
            </div>

            <div class="mt-4 rounded-2xl border border-border bg-background/55 p-3 text-sm leading-7 text-muted-foreground">
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
