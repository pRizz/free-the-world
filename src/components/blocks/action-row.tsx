import type { ParentProps } from "solid-js";
import { cn } from "~/lib/utils";

export function ActionRow(props: ParentProps<{ class?: string }>) {
  return <div class={cn("flex flex-wrap gap-3", props.class)}>{props.children}</div>;
}
