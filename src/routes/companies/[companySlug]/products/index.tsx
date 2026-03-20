import { A, useParams } from "@solidjs/router";
import { EmptyState } from "~/components/blocks/empty-state";
import { CompanyProductsPanel } from "~/components/company-panels";
import { Seo } from "~/components/seo";
import { SourceList } from "~/components/source-list";
import { Badge } from "~/components/ui/badge";
import { getCompanyBySlug, getProductsForCompany, getSourcesByIds } from "~/lib/domain/selectors";

export default function CompanyProductsPage() {
  const params = useParams();
  const companySlug = () => params.companySlug ?? "";
  const company = () => getCompanyBySlug(companySlug());
  const maybeCompany = company();

  if (!maybeCompany) {
    return (
      <>
        <Seo
          title="Company products not found · Free The World"
          description="The requested company slug does not exist in the current registry snapshot."
          route="/404"
          maybeNoIndex={true}
        />
        <EmptyState
          title="Company not found"
          description="The requested company slug does not exist in the current registry snapshot."
          actionLabel="Back to registry"
          actionRoute="/companies"
        />
      </>
    );
  }

  const companyData = maybeCompany;
  const productRecords = getProductsForCompany(companyData.slug);
  const sources = getSourcesByIds(companyData.sourceIds);

  return (
    <>
      <Seo
        title={`${companyData.name} products · Free The World`}
        description={`A tighter look at the products that matter most to ${companyData.name}, along with the free, open, decentralized, or cooperative alternatives already creating pricing pressure.`}
        route={`/companies/${companyData.slug}/products`}
      />

      <div class="space-y-8">
        <section class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <Badge tone="accent">Products</Badge>
            <Badge tone="muted">{companyData.name}</Badge>
          </div>
          <div class="space-y-3">
            <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">
              {companyData.name} product analyses
            </h1>
            <p class="max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
              A tighter look at the products that matter most to {companyData.name}, along with the
              free, open, decentralized, or cooperative alternatives already creating pricing
              pressure.
            </p>
          </div>
        </section>

        <CompanyProductsPanel company={companyData} products={productRecords} />
        <SourceList title="Company-level source stack" sources={sources} />

        <div class="text-sm text-muted-foreground">
          <A href={`/companies/${companyData.slug}`} class="hover:text-accent-foreground">
            ← Back to {companyData.name}
          </A>
        </div>
      </div>
    </>
  );
}
