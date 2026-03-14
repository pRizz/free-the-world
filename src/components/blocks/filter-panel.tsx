import type { ParentProps } from "solid-js";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function FilterPanel(props: ParentProps<{ class?: string }>) {
  return <Card class={cn("space-y-5", props.class)}>{props.children}</Card>;
}
