import { For } from "solid-js";
import { Table, TableBody, TableCell, TableElement, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { formatAlternativeMetric } from "~/lib/domain/formatters";
import type { Alternative } from "~/lib/domain/types";

export function AlternativeTable(props: { alternatives: Alternative[] }) {
  return (
    <Table>
      <TableElement>
        <TableHeader class="tracking-[0.22em]">
          <tr>
            <TableHead>Alternative</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Open</TableHead>
            <TableHead>Decent.</TableHead>
            <TableHead>Ready</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Links</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <For each={props.alternatives}>
            {alternative => (
              <TableRow>
                <TableCell class="space-y-2">
                  <p class="font-semibold text-foreground">{alternative.name}</p>
                  <p class="max-w-sm leading-7 text-muted-foreground">{alternative.summary}</p>
                </TableCell>
                <TableCell class="text-muted-foreground">{alternative.kind}</TableCell>
                <TableCell>{formatAlternativeMetric("openness", alternative.metrics.openness)}</TableCell>
                <TableCell>{formatAlternativeMetric("decentralizationFit", alternative.metrics.decentralizationFit)}</TableCell>
                <TableCell>{formatAlternativeMetric("readiness", alternative.metrics.readiness)}</TableCell>
                <TableCell>{formatAlternativeMetric("costLeverage", alternative.metrics.costLeverage)}</TableCell>
                <TableCell>
                  <div class="flex flex-col gap-2">
                    {alternative.homepageUrl ? (
                      <a href={alternative.homepageUrl} target="_blank" rel="noreferrer" class="hover:text-accent-foreground">
                        Homepage
                      </a>
                    ) : null}
                    {alternative.repoUrl ? (
                      <a href={alternative.repoUrl} target="_blank" rel="noreferrer" class="hover:text-accent-foreground">
                        Repository
                      </a>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </For>
        </TableBody>
      </TableElement>
    </Table>
  );
}
