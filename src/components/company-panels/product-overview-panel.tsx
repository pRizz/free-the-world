import { For } from "solid-js";
import { ActionRow } from "~/components/blocks/action-row";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { ProductImplementationDialog } from "~/components/product-implementation-dialog";
import { Button, ButtonLink } from "~/components/ui/button";
import type { Company, Product } from "~/lib/domain/types";

export function ProductOverviewPanel(props: { product: Product; company: Company }) {
  return (
    <ContentCard class="space-y-5">
      <PageHeader
        eyebrow={props.product.category}
        title={props.product.name}
        description={props.product.summary}
      />
      <div class="space-y-4 prose-block">
        <p>{props.product.whyItMatters}</p>
        <div>
          <p class="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Replacement sketch
          </p>
          <ul class="mt-3 space-y-2 text-sm leading-7 text-muted-foreground">
            <For each={props.product.replacementSketch}>
              {(paragraph) => <li>• {paragraph}</li>}
            </For>
          </ul>
        </div>
        <ActionRow>
          <ProductImplementationDialog company={props.company} product={props.product} />
          <Button
            as="a"
            href={props.product.homepageUrl}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
          >
            Product homepage
          </Button>
          <ButtonLink href={`/companies/${props.company.slug}/products`} variant="ghost">
            Back to {props.company.name} products
          </ButtonLink>
        </ActionRow>
      </div>
    </ContentCard>
  );
}
