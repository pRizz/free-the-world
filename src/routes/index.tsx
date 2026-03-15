import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { ContentCard } from "~/components/blocks/content-card";
import { MetricCard } from "~/components/blocks/metric-card";
import { PageHeader } from "~/components/blocks/page-header";
import { NewsletterSignup } from "~/components/newsletter-signup";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { companies } from "~/lib/content-graph";
import { withBasePath } from "~/lib/config";
import { sortCompaniesByMetric } from "~/lib/domain/company-metrics";
import { formatCompanyMetric } from "~/lib/domain/formatters";
import { landingHighlights, methodologyPrinciples } from "~/lib/content/site";

export default function Home() {
  const mostDecentralizable = sortCompaniesByMetric(companies, "decentralizability", "desc")[0]!;
  const mostCapitalAtRisk = sortCompaniesByMetric(companies, "freedCapitalPotential", "desc")[0]!;

  return (
    <>
      <Title>Free The World</Title>

      <div class="space-y-10">
        <section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card class="space-y-6">
            <div class="space-y-4">
              <Badge tone="accent">Top 10 S&amp;P 500 snapshot</Badge>
              <div class="space-y-4">
                <h1 class="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Price the moat honestly. Then imagine what happens when more of the world becomes free.
                </h1>
                <p class="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Free The World is a research-driven registry of major public companies and the products they still
                  monetize as if AI, open source, Bitcoin-native coordination, and distributed manufacturing were
                  optional side quests instead of the main plot.
                </p>
              </div>
            </div>

            <div class="grid gap-3 sm:grid-cols-3">
              {landingHighlights.map(highlight => (
                <article class="rounded-2xl border border-border bg-card p-4 text-sm leading-7 text-muted-foreground">
                  {highlight}
                </article>
              ))}
            </div>

            <div class="flex flex-wrap gap-3">
              <Button as="a" href={withBasePath("/companies")}>
                Explore the registry
              </Button>
              <Button as="a" href={withBasePath("/methodology")} variant="secondary">
                Read the methodology
              </Button>
            </div>
          </Card>

          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Snapshot highlights"
              title="A few early signals"
              description="The point is not to predict a single date when incumbents lose. The point is to notice which categories are already becoming harder to justify at current prices."
            />
            <div class="space-y-4">
              <MetricCard
                label="Most decentralizable large-cap in the launch set"
                value={mostDecentralizable.name}
                class="[&>p:first-child]:tracking-[0.22em]"
              >
                {formatCompanyMetric("decentralizability", mostDecentralizable.metrics.decentralizability)} —{" "}
                {mostDecentralizable.metrics.decentralizability!.rationale}
              </MetricCard>
              <MetricCard
                label="Largest implied capital release opportunity"
                value={mostCapitalAtRisk.name}
                class="[&>p:first-child]:tracking-[0.22em]"
              >
                {formatCompanyMetric("freedCapitalPotential", mostCapitalAtRisk.metrics.freedCapitalPotential)} —{" "}
                {mostCapitalAtRisk.metrics.freedCapitalPotential!.rationale}
              </MetricCard>
            </div>
          </ContentCard>
        </section>

        <section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Motivation"
              title="The thesis in one page"
              description="Many digital products still charge like scarcity is real. Many physical products still charge like production must remain giant, centralized, and slow. Both assumptions are under pressure."
            />
            <div class="space-y-4 prose-block">
              <p>
                AI keeps compressing expertise. Open source keeps compressing software margins. Bitcoin and Lightning
                offer payment and anti-spam primitives that make more permissionless systems viable. Distributed
                manufacturing keeps moving the minimum useful factory closer to local, automated, and weirdly compact.
              </p>
              <p>
                The result is not that every incumbent disappears. It is that a growing share of incumbents should
                expect to defend prices that become less philosophically persuasive and less economically durable.
              </p>
            </div>
          </ContentCard>

          <ContentCard class="space-y-5">
            <PageHeader
              eyebrow="Operating rules"
              title="How the registry thinks"
              description="The methodology is explicit so readers can audit the assumptions instead of pretending a clean table appeared from the heavens."
            />
            <div class="space-y-3">
              {methodologyPrinciples.map(principle => (
                <article class="rounded-2xl border border-border bg-card p-4 text-sm leading-7 text-muted-foreground">
                  {principle}
                </article>
              ))}
            </div>
          </ContentCard>
        </section>

        <NewsletterSignup />

        <section class="rounded-3xl border border-border bg-card p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-3">
              <Badge tone="muted">Professional with a light satirical aftertaste</Badge>
              <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                If a trillion-dollar company is mostly monetizing convenience and inertia, that is still a moat. It is
                just not necessarily an eternal one.
              </h2>
            </div>
            <A href="/companies" class="text-sm font-medium text-accent-foreground hover:underline">
              Go to the company registry →
            </A>
          </div>
        </section>
      </div>
    </>
  );
}
