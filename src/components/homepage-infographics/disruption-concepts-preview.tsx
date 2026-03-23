import { For } from "solid-js";
import { getDisruptionConceptDataset } from "~/lib/domain/insights";

const dataset = getDisruptionConceptDataset();
const previewRows = dataset.companyRows.filter((row) => row.hasDocumentedConcepts).slice(0, 4);

function formatScore(value: number | null) {
  return value === null ? "—" : `${value.toFixed(1)}/10`;
}

function scoreWidth(value: number | null) {
  if (value === null) {
    return "0%";
  }

  return `${Math.max(0, Math.min(100, value * 10))}%`;
}

export function DisruptionConceptsPreview() {
  if (previewRows.length === 0) {
    return (
      <div class="rounded-2xl border border-dashed border-border bg-background/40 p-5 text-sm leading-7 text-muted-foreground">
        The concept index will appear once the registry publishes more original attack vectors.
      </div>
    );
  }

  return (
    <div class="space-y-4">
      <div class="grid gap-2 sm:grid-cols-2">
        <article class="rounded-2xl border border-border bg-background/55 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Concepts</p>
          <p class="mt-2 text-lg font-semibold text-title-foreground">
            {dataset.totalConceptCount}
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Covering {dataset.productsWithConcepts} products with documented build ideas.
          </p>
        </article>
        <article class="rounded-2xl border border-border bg-background/55 p-3">
          <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">Average concept</p>
          <p class="mt-2 text-lg font-semibold text-title-foreground">
            {formatScore(dataset.averageConceptScore)}
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Weighted toward feasibility, coordination credibility, and pain for incumbents.
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
                    {row.conceptCount} concepts {"·"} {row.productsWithConcepts}/{row.productCount}{" "}
                    products mapped
                  </p>
                </div>
                <p class="text-sm font-semibold text-title-foreground">
                  {formatScore(row.conceptScore)}
                </p>
              </div>

              <div class="mt-3 h-2 rounded-full bg-secondary/85">
                <div
                  class="h-full rounded-full bg-[linear-gradient(90deg,rgba(248,250,252,0.45),rgba(196,181,253,0.85),rgba(125,211,252,0.78))]"
                  style={{ width: scoreWidth(row.conceptScore) }}
                />
              </div>

              <p class="mt-3 text-sm text-muted-foreground">
                Highest-scoring product:{" "}
                <span class="font-medium text-foreground">
                  {row.highestScoringProduct?.product.name ?? "Pending"}
                </span>
              </p>
            </article>
          )}
        </For>
      </div>
    </div>
  );
}
