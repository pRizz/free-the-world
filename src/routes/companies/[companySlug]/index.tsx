import { Title } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import {
  CompanyMetadataPanel,
  CompanyMetricsPanel,
  CompanyProductsPanel,
  TechnologyWavePanel,
} from "~/components/company-panels";
import { SourceList } from "~/components/source-list";
import { Badge, Button, Card, SectionHeading } from "~/components/ui";
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

  if (!company()) {
    return (
      <Card class="space-y-4">
        <SectionHeading title="Company not found" description="The requested company slug does not exist in the current registry snapshot." />
        <Button as="a" href={withBasePath("/companies")} variant="secondary">
          Back to registry
        </Button>
      </Card>
    );
  }

  const companyData = company()!;
  const relatedProducts = getProductsForCompany(companyData.slug);
  const companySources = getSourcesByIds(companyData.sourceIds);
  const waves = getTechnologyWavesByIds(companyData.technologyWaveIds);

  return (
    <>
      <Title>{companyData.name} · Free The World</Title>

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
          <div class="flex flex-wrap gap-3">
            <Button as="a" href={companyData.companiesMarketCapUrl} target="_blank" rel="noreferrer" variant="secondary">
              CompaniesMarketCap
            </Button>
            <Button as="a" href={withBasePath(`/companies/${companyData.slug}/products`)}>
              Product analyses
            </Button>
          </div>
        </section>

        <section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <CompanyMetadataPanel company={companyData} />
          <CompanyMetricsPanel company={companyData} />
        </section>

        <Card class="space-y-6">
          <SectionHeading
            eyebrow="Narrative"
            title="Why the company matters"
            description="A short editorial overview plus the current thesis on moat strength and decentralization pressure."
          />
          <div class="space-y-6">
            {companyData.overview.map(section => (
              <article class="space-y-3 prose-block">
                <h2 class="text-2xl font-semibold tracking-tight">{section.title}</h2>
                {section.paragraphs.map(paragraph => (
                  <p>{paragraph}</p>
                ))}
              </article>
            ))}
            <div class="grid gap-5 lg:grid-cols-2">
              <article class="rounded-2xl border border-border bg-card p-5">
                <h3 class="text-lg font-medium">Moat reading</h3>
                <div class="mt-3 prose-block">
                  {companyData.moatNarrative.map(paragraph => (
                    <p>{paragraph}</p>
                  ))}
                </div>
              </article>
              <article class="rounded-2xl border border-border bg-card p-5">
                <h3 class="text-lg font-medium">Decentralization reading</h3>
                <div class="mt-3 prose-block">
                  {companyData.decentralizationNarrative.map(paragraph => (
                    <p>{paragraph}</p>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </Card>

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
