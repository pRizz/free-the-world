import type { ParentProps } from "solid-js";
import { PageHeader } from "~/components/blocks/page-header";
import { ButtonLink } from "~/components/ui/button";
import { Card, CardFooter } from "~/components/ui/card";

export function EmptyState(
  props: ParentProps<{
    title: string;
    description?: string;
    eyebrow?: string;
    actionLabel?: string;
    actionRoute?: string;
    class?: string;
  }>,
) {
  return (
    <Card class={props.class}>
      <div class="space-y-4">
        <PageHeader eyebrow={props.eyebrow} title={props.title} description={props.description} />
        {props.children}
        {props.actionLabel && props.actionRoute ? (
          <CardFooter>
            <ButtonLink href={props.actionRoute} variant="secondary">
              {props.actionLabel}
            </ButtonLink>
          </CardFooter>
        ) : null}
      </div>
    </Card>
  );
}
