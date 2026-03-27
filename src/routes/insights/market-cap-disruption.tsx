import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { InsightKpiStrip } from "~/components/insights/insight-kpi-strip";
import { Seo } from "~/components/seo";
import {
  Table,
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatMetricValue, formatMoneyRange } from "~/lib/domain/formatters";
import { getMarketCapCoverageDataset } from "~/lib/domain/insights";
import { marketCapSnapshotCsvPath } from "~/lib/market-cap-snapshots";

const dataset = getMarketCapCoverageDataset();
const disruptedShare = dataset.totalCurrentMarketCap
  ? dataset.totalDisruptedMarketCap / dataset.totalCurrentMarketCap
  : 0;
const pieRadius = 108;
const pieCircumference = 2 * Math.PI * pieRadius;
const disruptedStrokeLength = pieCircumference * disruptedShare;
const residualStrokeLength = pieCircumference * Math.max(0, 1 - disruptedShare);

function formatDateLabel(value: string | null) {
  if (!value) {
    return "—";
  }

  const maybeDate = new Date(value);
  if (Number.isNaN(maybeDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: value.includes("T") ? "short" : undefined,
    timeZone: "UTC",
  }).format(maybeDate);
}

export default function MarketCapDisruptionPage() {
  return (
    <>
      <Seo
        title="Market-cap disruption · Free The World"
        description="A thesis-adjusted pie chart for the analyzed S&P 500 sample, combining fresh market-cap snapshots with the site's published disruption-share model."
        route="/insights/market-cap-disruption"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Insights · Market-cap disruption"
          title="How much of the analyzed S&P 500 sample do we think gets repriced?"
          description="This page combines the freshest committed market-cap snapshot with the site's existing moat, decentralizability, and profitability analysis. If the qualitative thesis is older than the market tape, we keep the ratio and refresh only the cap, rather than pretending stale raw disrupted-dollar numbers are somehow more honest."
        />

        <InsightKpiStrip
          items={[
            {
              label: "Analyzed sample",
              value: `${dataset.analyzedCompanyCount} companies`,
              note: "Published companies tagged to the S&P 500 sample with enough thesis coverage to compute a disruption share.",
            },
            {
              label: "Current market cap",
              value: formatMoneyRange(dataset.totalCurrentMarketCap),
              note: `${dataset.liveSnapshotCompanyCount} company cap snapshots came from the latest refresh; ${dataset.fallbackSnapshotCompanyCount} used the published fallback metric.`,
            },
            {
              label: "Predicted disrupted cap",
              value: formatMoneyRange(dataset.totalDisruptedMarketCap),
              note: `${formatMetricValue(disruptedShare, "percentage", 1)} of the analyzed sample using the current disruption-share model.`,
            },
            {
              label: "Latest refresh",
              value: formatDateLabel(dataset.latestMarketCapSnapshotAt),
              note:
                dataset.latestDisruptionReviewAt === null
                  ? "No thesis review date available."
                  : `Latest thesis review in the sample: ${formatDateLabel(dataset.latestDisruptionReviewAt)}.`,
            },
          ]}
        />

        <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Infographic page 1"
              title="A simple pie chart for the current sample"
              description="Blue is the portion the model currently treats as likely to remain durable. Amber is the portion we think could be repriced if open, automated, and decentralized substitutes keep compounding."
            />
            <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div class="rounded-3xl border border-border bg-background/55 p-6">
                <svg
                  viewBox="0 0 280 280"
                  class="mx-auto w-full max-w-[18rem]"
                  role="img"
                  aria-label="Pie chart showing the analyzed S&P 500 market cap split between thesis-adjusted disrupted value and residual value."
                >
                  <circle
                    cx="140"
                    cy="140"
                    r={pieRadius}
                    fill="none"
                    stroke="rgb(51 65 85 / 0.35)"
                    stroke-width="44"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r={pieRadius}
                    fill="none"
                    stroke="rgb(245 158 11 / 0.88)"
                    stroke-width="44"
                    stroke-dasharray={`${disruptedStrokeLength} ${pieCircumference}`}
                    transform="rotate(-90 140 140)"
                  />
                  <circle
                    cx="140"
                    cy="140"
                    r={pieRadius}
                    fill="none"
                    stroke="rgb(125 211 252 / 0.88)"
                    stroke-width="44"
                    stroke-dasharray={`${residualStrokeLength} ${pieCircumference}`}
                    stroke-dashoffset={-disruptedStrokeLength}
                    transform="rotate(-90 140 140)"
                  />
                  <circle cx="140" cy="140" r="68" fill="rgb(2 6 23 / 0.94)" />
                  <text
                    x="140"
                    y="130"
                    text-anchor="middle"
                    class="fill-muted-foreground text-[12px] uppercase tracking-[0.24em]"
                  >
                    Disrupted
                  </text>
                  <text
                    x="140"
                    y="156"
                    text-anchor="middle"
                    class="fill-foreground text-[28px] font-semibold"
                  >
                    {formatMetricValue(disruptedShare, "percentage", 0)}
                  </text>
                </svg>
              </div>

              <div class="space-y-3">
                <article class="rounded-2xl border border-border bg-background/55 p-4">
                  <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Residual market cap
                  </p>
                  <p class="mt-2 text-2xl font-semibold text-title-foreground">
                    {formatMoneyRange(dataset.totalResidualMarketCap)}
                  </p>
                  <p class="mt-2 text-sm leading-7 text-muted-foreground">
                    The portion of the analyzed sample that remains after subtracting the modeled
                    disrupted share.
                  </p>
                </article>
                <article class="rounded-2xl border border-border bg-background/55 p-4">
                  <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Why the ratio still works when caps are fresher
                  </p>
                  <p class="mt-2 text-sm leading-7 text-muted-foreground">
                    The disruption model is multiplicative. Fresh market caps can therefore be
                    multiplied by the current disruption share without having to wait for every
                    narrative paragraph and derived dollar field to be rewritten.
                  </p>
                </article>
                <article class="rounded-2xl border border-border bg-background/55 p-4">
                  <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Raw data export
                  </p>
                  <p class="mt-2 text-sm leading-7 text-muted-foreground">
                    The daily workflow commits the latest snapshot as a CSV so the chart can always
                    point to a concrete, auditable table.
                  </p>
                  <a
                    href={marketCapSnapshotCsvPath}
                    class="mt-3 inline-flex text-sm font-medium text-accent-foreground hover:underline"
                  >
                    Download the latest market-cap CSV →
                  </a>
                </article>
              </div>
            </div>
          </ContentCard>

          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Coverage notes"
              title="What is fresh, and what may be stale?"
              description="The page is explicit about provenance instead of hand-waving freshness into existence."
            />
            <div class="grid gap-3">
              <article class="rounded-2xl border border-border bg-card/55 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Live market-cap rows
                </p>
                <p class="mt-2 text-2xl font-semibold text-title-foreground">
                  {dataset.liveSnapshotCompanyCount}
                </p>
                <p class="mt-2 text-sm text-muted-foreground">
                  Fetched successfully from the latest CompaniesMarketCap refresh.
                </p>
              </article>
              <article class="rounded-2xl border border-border bg-card/55 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Published fallbacks
                </p>
                <p class="mt-2 text-2xl font-semibold text-title-foreground">
                  {dataset.fallbackSnapshotCompanyCount}
                </p>
                <p class="mt-2 text-sm text-muted-foreground">
                  Refresh failed or was unavailable, so the site used the latest published metric.
                </p>
              </article>
              <article class="rounded-2xl border border-border bg-card/55 p-4">
                <p class="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Potentially stale thesis rows
                </p>
                <p class="mt-2 text-2xl font-semibold text-title-foreground">
                  {dataset.staleThesisCompanyCount}
                </p>
                <p class="mt-2 text-sm text-muted-foreground">
                  Market caps are newer than the most recent disruption-share review for these
                  companies.
                </p>
              </article>
            </div>
          </ContentCard>
        </div>

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Reference table"
            title="Per-company market-cap coverage"
            description="This table keeps the latest cap, thesis-adjusted disrupted share, and provenance all visible in one place."
          />
          <Table>
            <TableElement>
              <TableHeader>
                <tr>
                  <TableHead>Company</TableHead>
                  <TableHead>Current cap</TableHead>
                  <TableHead>Disrupted share</TableHead>
                  <TableHead>Disrupted cap</TableHead>
                  <TableHead>Residual cap</TableHead>
                  <TableHead>Cap source</TableHead>
                  <TableHead>Thesis review</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                <For each={dataset.rows}>
                  {(row) => (
                    <TableRow>
                      <TableCell class="space-y-1">
                        <p class="font-semibold text-foreground">{row.company.name}</p>
                        <p class="text-sm text-muted-foreground">{row.company.ticker}</p>
                      </TableCell>
                      <TableCell>{formatMoneyRange(row.currentMarketCap)}</TableCell>
                      <TableCell>
                        {formatMetricValue(row.disruptionShare, "percentage", 1)}
                      </TableCell>
                      <TableCell>{formatMoneyRange(row.disruptedMarketCap)}</TableCell>
                      <TableCell>{formatMoneyRange(row.residualMarketCap)}</TableCell>
                      <TableCell>
                        <div class="space-y-1">
                          <p class="capitalize">{row.marketCapSourceKind.replace("-", " ")}</p>
                          <p class="text-xs text-muted-foreground">
                            {row.marketCapSourceReportedAtLabel ??
                              formatDateLabel(row.marketCapFetchedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div class="space-y-1">
                          <p>{formatDateLabel(row.disruptionShareLastReviewedOn)}</p>
                          {row.marketCapSourceReportedAtLabel &&
                          row.disruptionShareLastReviewedOn < row.marketCapSourceReportedAtLabel ? (
                            <p class="text-xs text-muted-foreground">Cap is newer than thesis.</p>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </For>
              </TableBody>
            </TableElement>
          </Table>
        </ContentCard>
      </div>
    </>
  );
}
