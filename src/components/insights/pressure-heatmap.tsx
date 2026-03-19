import { For } from "solid-js";
import {
  Table,
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type {
  AlternativeMetricAverages,
  AlternativePressureProductRow,
} from "~/lib/domain/insights";

function formatScore(value: number) {
  return `${value.toFixed(1)}/10`;
}

function MetricCell(props: { label: string; maybeValue: number | null }) {
  if (props.maybeValue === null) {
    return <span class="text-muted-foreground">—</span>;
  }

  return (
    <div class="min-w-[7rem] space-y-2">
      <div class="flex items-center justify-between gap-3">
        <span class="sr-only">{props.label}</span>
        <span class="text-sm font-medium text-foreground">{formatScore(props.maybeValue)}</span>
      </div>
      <div class="h-2 rounded-full bg-secondary/85">
        <div
          class="h-full rounded-full bg-[linear-gradient(90deg,rgba(125,211,252,0.7),rgba(74,222,128,0.7))]"
          style={{ width: `${Math.max(0, Math.min(100, props.maybeValue * 10))}%` }}
        />
      </div>
    </div>
  );
}

function averageMetricValue(
  averages: AlternativeMetricAverages | null,
  metricName: keyof AlternativeMetricAverages,
) {
  return averages ? averages[metricName] : null;
}

export function PressureHeatmap(props: { rows: AlternativePressureProductRow[] }) {
  return (
    <Table>
      <TableElement>
        <TableHeader>
          <tr>
            <TableHead>Product</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Alts</TableHead>
            <TableHead>Pressure</TableHead>
            <TableHead>Ready</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Open</TableHead>
            <TableHead>Decent.</TableHead>
            <TableHead>Notes</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <For each={props.rows}>
            {(row) => (
              <TableRow>
                <TableCell class="space-y-2">
                  <p class="font-semibold text-foreground">{row.product.name}</p>
                  <p class="max-w-xs text-sm leading-7 text-muted-foreground">
                    {row.product.category}
                  </p>
                </TableCell>
                <TableCell class="text-muted-foreground">{row.company.name}</TableCell>
                <TableCell class="font-medium text-foreground">{row.alternativeCount}</TableCell>
                <TableCell>
                  <MetricCell label="Pressure score" maybeValue={row.pressureScore} />
                </TableCell>
                <TableCell>
                  <MetricCell
                    label="Readiness"
                    maybeValue={averageMetricValue(row.averages, "readiness")}
                  />
                </TableCell>
                <TableCell>
                  <MetricCell
                    label="Cost leverage"
                    maybeValue={averageMetricValue(row.averages, "costLeverage")}
                  />
                </TableCell>
                <TableCell>
                  <MetricCell
                    label="Openness"
                    maybeValue={averageMetricValue(row.averages, "openness")}
                  />
                </TableCell>
                <TableCell>
                  <MetricCell
                    label="Decentralization fit"
                    maybeValue={averageMetricValue(row.averages, "decentralizationFit")}
                  />
                </TableCell>
                <TableCell class="max-w-sm text-sm leading-7 text-muted-foreground">
                  {row.hasDocumentedAlternatives ? (
                    row.alternativeNames.join(", ")
                  ) : (
                    <span>No meaningful alternatives documented yet.</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </TableElement>
    </Table>
  );
}
