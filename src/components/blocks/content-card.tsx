import type { ParentProps } from "solid-js";
import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function ContentCard(props: ParentProps<{ class?: string; cardClass?: string }>) {
  return (
    <Card class={props.cardClass}>
      <CardContent class={cn(props.class)}>{props.children}</CardContent>
    </Card>
  );
}
