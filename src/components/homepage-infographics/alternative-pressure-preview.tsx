import { For } from "solid-js";
import { getAlternativePressureDataset } from "~/lib/domain/insights";

const dataset = getAlternativePressureDataset();
const previewRows = dataset.companyRows.filter((row) => row.hasDocumentedAlternatives).slice(0, 4);

function formatScore(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}/10`;
}

function metricWidth(value: number | null) {
  if (value === null) {
    return "0%";
  }

  return `${Math.max(0, Math.min(100, value * 10))}%`;
}

export function AlternativePressurePreview() {
  if (previewRows.length === 0) {
    return (
      <div class="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-sm leading-7 text-muted-foreground">
        The pressure index will appear once substitute analysis is published.
      </div>
    );
  }

  return (
    <div class="space-y-4">
      <div class="grid gap-2 sm:grid-cols-2">
        <article class="rounded-2xl border border-border bg-background/55 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Alternatives</p>
          <p class="mt-2 text-lg font-semibold text-title-foreground">
            {dataset.totalAlternativeCount}
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Spanning {dataset.documentedProductCount} products in the current sample.
          </p>
        </article>
        <article class="rounded-2xl border border-border bg-background/55 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Average pressure</p>
          <p class="mt-2 text-lg font-semibold text-title-foreground">
            {formatScore(dataset.averagePressureScore)}
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Weighted toward readiness and cost leverage, not just ideological niceness.
          </p>
        </article>
      </div>

      <div class="space-y-3">
        <For each={previewRows}>
          {(row) => (
            <article class="rounded-2xl border border-border bg-card/70 p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-medium text-foreground">{row.company.name}</p>
                  <p class="text-sm text-muted-foreground">
                    {row.alternativeCount} documented alternatives {"·"}{" "}
                    {row.productsWithDocumentedAlternatives}/{row.productCount} products covered
                  </p>
                </div>
                <p class="text-sm font-semibold text-title-foreground">
                  {formatScore(row.pressureScore)}
                </p>
              </div>

              <div class="mt-3 space-y-2">
                <div>
                  <div class="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Pressure</span>
                    <span>{formatScore(row.pressureScore)}</span>
                  </div>
                  <div class="h-2 rounded-full bg-secondary/85">
                    <div
                      class="h-full rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,0.7),rgba(74,222,128,0.8))]"
                      style={{ width: metricWidth(row.pressureScore) }}
                    />
                  </div>
                </div>
                <div class="grid gap-2 sm:grid-cols-2">
                  <div>
                    <div class="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Ready</span>
                      <span>{formatScore(row.averages?.readiness ?? null)}</span>
                    </div>
                    <div class="h-2 rounded-full bg-secondary/85">
                      <div
                        class="h-full rounded-full bg-sky-300/75"
                        style={{ width: metricWidth(row.averages?.readiness ?? null) }}
                      />
                    </div>
                  </div>
                  <div>
                    <div class="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Cost</span>
                      <span>{formatScore(row.averages?.costLeverage ?? null)}</span>
                    </div>
                    <div class="h-2 rounded-full bg-secondary/85">
                      <div
                        class="h-full rounded-full bg-success/80"
                        style={{ width: metricWidth(row.averages?.costLeverage ?? null) }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}
        </For>
      </div>
    </div>
  );
}
