import { Title } from "@solidjs/meta";
import { A, useParams } from "@solidjs/router";
import { ContentCard } from "~/components/blocks/content-card";
import { EmptyState } from "~/components/blocks/empty-state";
import { PageHeader } from "~/components/blocks/page-header";
import { AlternativeTable, ProductOverviewPanel, SourceSummaryCard, TechnologyWavePanel } from "~/components/company-panels";
import { Badge } from "~/components/ui/badge";
import { withBasePath } from "~/lib/config";
import {
  getAlternativesForProduct,
  getCompanyBySlug,
  getProductBySlug,
  getSourcesByIds,
  getTechnologyWavesByIds,
} from "~/lib/domain/selectors";

export default function ProductPage() {
  const params = useParams();
  const companySlug = () => params.companySlug ?? "";
  const productSlug = () => params.productSlug ?? "";
  const company = () => getCompanyBySlug(companySlug());
  const product = () => getProductBySlug(productSlug());

  if (!company() || !product() || product()!.companySlug !== company()!.slug) {
    return (
      <EmptyState
        title="Product not found"
        description="The requested company or product slug does not exist in the current registry snapshot."
        actionLabel="Back to registry"
        actionHref={withBasePath("/companies")}
      />
    );
  }

  const companyData = company()!;
  const productData = product()!;
  const productAlternatives = getAlternativesForProduct(productData.slug);
  const productSources = getSourcesByIds(productData.sourceIds);
  const waveData = getTechnologyWavesByIds(productData.technologyWaveIds);

  return (
    <>
      <Title>
        {productData.name} · {companyData.name} · Free The World
      </Title>

      <div class="space-y-8">
        <section class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Badge tone="accent">{companyData.name}</Badge>
            <Badge tone="muted">{productData.category}</Badge>
          </div>
          <div class="space-y-3">
            <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">{productData.name}</h1>
            <p class="max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
              The question here is simple: which parts of this product are genuinely hard, and which parts are mostly
              a very profitable coordination habit?
            </p>
          </div>
        </section>

        <ProductOverviewPanel product={productData} company={companyData} />

        <ContentCard class="space-y-5">
          <PageHeader
            eyebrow="Alternatives"
            title="Replacement landscape"
            description="These alternatives are not always drop-in replacements. They do, however, show where the incumbent's pricing power starts facing open pressure."
          />
          <AlternativeTable alternatives={productAlternatives} />
        </ContentCard>

        <TechnologyWavePanel waves={waveData} />
        <SourceSummaryCard title="Product research sources" sources={productSources} />

        <div class="text-sm text-muted-foreground">
          <A href={`/companies/${companyData.slug}/products`} class="hover:text-accent-foreground">
            ← Back to {companyData.name} products
          </A>
        </div>
      </div>
    </>
  );
}
