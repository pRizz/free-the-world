import { A } from "@solidjs/router";
import { For } from "solid-js";
import { ActionRow } from "~/components/blocks/action-row";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { Button } from "~/components/ui/button";
import { withBasePath } from "~/lib/config";
import type { Company, Product } from "~/lib/domain/types";

export function CompanyProductsPanel(props: { company: Company; products: Product[] }) {
  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow="Products"
        title="Where the moat actually touches users"
        description="These pages zoom into the products and services that matter most to each company and the alternatives already nibbling at them."
      />
      <div class="space-y-4">
        <For each={props.products}>
          {product => (
            <article class="rounded-2xl border border-border bg-card p-4">
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="space-y-2">
                  <A href={`/companies/${props.company.slug}/products/${product.slug}`} class="text-lg font-medium hover:text-accent-foreground">
                    {product.name}
                  </A>
                  <p class="text-sm uppercase tracking-[0.22em] text-muted-foreground">{product.category}</p>
                  <p class="max-w-3xl text-sm leading-7 text-muted-foreground">{product.summary}</p>
                </div>
                <ActionRow class="shrink-0">
                  <Button as="a" href={withBasePath(`/companies/${props.company.slug}/products/${product.slug}`)} variant="secondary">
                    Open analysis
                  </Button>
                </ActionRow>
              </div>
            </article>
          )}
        </For>
      </div>
    </ContentCard>
  );
}
