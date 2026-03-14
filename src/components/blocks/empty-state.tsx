import type { ParentProps } from "solid-js";
import { Button } from "~/components/ui/button";
import { Card, CardFooter } from "~/components/ui/card";
import { PageHeader } from "~/components/blocks/page-header";

export function EmptyState(
  props: ParentProps<{
    title: string;
    description?: string;
    eyebrow?: string;
    actionLabel?: string;
    actionHref?: string;
    class?: string;
  }>
) {
  return (
    <Card class={props.class}>
      <div class="space-y-4">
        <PageHeader eyebrow={props.eyebrow} title={props.title} description={props.description} />
        {props.children}
        {props.actionLabel && props.actionHref ? (
          <CardFooter>
            <Button as="a" href={props.actionHref} variant="secondary">
              {props.actionLabel}
            </Button>
          </CardFooter>
        ) : null}
      </div>
    </Card>
  );
}
