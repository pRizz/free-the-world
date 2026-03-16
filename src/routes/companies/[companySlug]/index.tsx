import { A, useParams } from "@solidjs/router";
import { ActionRow } from "~/components/blocks/action-row";
import { ContentCard } from "~/components/blocks/content-card";
import { EmptyState } from "~/components/blocks/empty-state";
import { PageHeader } from "~/components/blocks/page-header";
import {
  CompanyMetadataPanel,
  CompanyMetricsPanel,
  CompanyProductsPanel,
  TechnologyWavePanel,
} from "~/components/company-panels";
import { Seo } from "~/components/seo";
import { SourceList } from "~/components/source-list";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { withBasePath } from "~/lib/config";
import {
  getCompanyBySlug,
  getProductsForCompany,
  getSourcesByIds,
  getTechnologyWavesByIds,
} from "~/lib/domain/selectors";

export default function CompanyPage() {
  const params = useParams();
  const companySlug = () => params.companySlug ?? "";
  const company = () => getCompanyBySlug(companySlug());
  const maybeCompany = company();

  if (!maybeCompany) {
    return (
      <>
        <Seo
          title="Company not found · Free The World"
          description="The requested company slug does not exist in the current registry snapshot."
          route="/404"
          maybeNoIndex={true}
        />
        <EmptyState
          title="Company not found"
          description="The requested company slug does not exist in the current registry snapshot."
          actionLabel="Back to registry"
          actionHref={withBasePath("/companies")}
        />
      </>
    );
  }

  const companyData = maybeCompany;
  const relatedProducts = getProductsForCompany(companyData.slug);
  const companySources = getSourcesByIds(companyData.sourceIds);
  const waves = getTechnologyWavesByIds(companyData.technologyWaveIds);

  return (
    <>
      <Seo
        title={`${companyData.name} · Free The World`}
        description={companyData.description}
        route={`/companies/${companyData.slug}`}
      />

      <div class="space-y-8">
        <section class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Badge tone="accent">{companyData.ticker}</Badge>
            <Badge tone="muted">{companyData.snapshotNote}</Badge>
          </div>
          <div class="space-y-4">
            <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{companyData.name}</h1>
            <p class="max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
              {companyData.description}
            </p>
          </div>
          <ActionRow>
            <Button
              as="a"
              href={companyData.companiesMarketCapUrl}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              CompaniesMarketCap
            </Button>
            <Button as="a" href={withBasePath(`/companies/${companyData.slug}/products`)}>
              Product analyses
            </Button>
          </ActionRow>
        </section>

        <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <CompanyMetadataPanel company={companyData} />
          <CompanyMetricsPanel company={companyData} />
        </section>

        <ContentCard class="space-y-6">
          <PageHeader
            eyebrow="Narrative"
            title="Why the company matters"
            description="A short editorial overview plus the current thesis on moat strength and decentralization pressure."
          />
          <div class="space-y-6">
            {companyData.overview.map((section) => (
              <article class="space-y-3 prose-block">
                <h2 class="text-2xl font-semibold tracking-tight">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p>{paragraph}</p>
                ))}
              </article>
            ))}
            <div class="grid gap-5 lg:grid-cols-2">
              <article class="rounded-2xl border border-border bg-card p-5">
                <h3 class="text-lg font-medium">Moat reading</h3>
                <div class="mt-3 prose-block">
                  {companyData.moatNarrative.map((paragraph) => (
                    <p>{paragraph}</p>
                  ))}
                </div>
              </article>
              <article class="rounded-2xl border border-border bg-card p-5">
                <h3 class="text-lg font-medium">Decentralization reading</h3>
                <div class="mt-3 prose-block">
                  {companyData.decentralizationNarrative.map((paragraph) => (
                    <p>{paragraph}</p>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </ContentCard>

        <CompanyProductsPanel company={companyData} products={relatedProducts} />
        <TechnologyWavePanel waves={waves} />
        <SourceList sources={companySources} />

        <div class="text-sm text-muted-foreground">
          <A href="/companies" class="hover:text-accent-foreground">
            ← Back to registry
          </A>
        </div>
      </div>
    </>
  );
}
