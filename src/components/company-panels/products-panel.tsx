import { A } from "@solidjs/router";
import { For } from "solid-js";
import { ActionRow } from "~/components/blocks/action-row";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { Badge } from "~/components/ui/badge";
import { ButtonLink } from "~/components/ui/button";
import type { Company, Product } from "~/lib/domain/types";

export function CompanyProductsPanel(props: { company: Company; products: Product[] }) {
  const conceptCount = () =>
    props.products.reduce((total, product) => total + product.disruptionConceptSlugs.length, 0);
  const exceptionCount = () =>
    props.products.filter((product) => product.maybeDisruptionException !== null).length;

  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow="Products"
        title="Where the moat actually touches users"
        description={`These pages zoom into the products and services that matter most to each company, the alternatives already nibbling at them, and ${conceptCount()} structured disruption concept${conceptCount() === 1 ? "" : "s"} across the current product set.`}
      />
      <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span>{conceptCount()} disruption concepts tracked</span>
        <span>{exceptionCount()} documented exceptions</span>
      </div>
      <div class="space-y-4">
        <For each={props.products}>
          {(product) => (
            <article class="rounded-2xl border border-border bg-card p-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-2">
                  <A
                    href={`/companies/${props.company.slug}/products/${product.slug}`}
                    class="text-lg font-medium hover:text-accent-foreground"
                  >
                    {product.name}
                  </A>
                  <div class="flex flex-wrap gap-2">
                    <p class="text-sm uppercase tracking-[0.22em] text-muted-foreground">
                      {product.category}
                    </p>
                    <Badge tone="muted">
                      {product.disruptionConceptSlugs.length} concept
                      {product.disruptionConceptSlugs.length === 1 ? "" : "s"}
                    </Badge>
                    {product.maybeDisruptionException ? (
                      <Badge tone="accent">Documented exception</Badge>
                    ) : null}
                  </div>
                  <p class="max-w-3xl text-sm leading-7 text-muted-foreground">{product.summary}</p>
                </div>
                <ActionRow class="shrink-0">
                  <ButtonLink
                    href={`/companies/${props.company.slug}/products/${product.slug}`}
                    variant="secondary"
                  >
                    Open analysis
                  </ButtonLink>
                </ActionRow>
              </div>
            </article>
          )}
        </For>
      </div>
    </ContentCard>
  );
}
