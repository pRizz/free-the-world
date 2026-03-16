import * as KCollapsible from "@kobalte/core/collapsible";
import { ChevronDown } from "lucide-solid";
import type { ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export const Collapsible = KCollapsible.Root;

export function CollapsibleTrigger(
  props: ParentProps<KCollapsible.CollapsibleTriggerProps & { class?: string }>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KCollapsible.Trigger
      class={cn(
        "flex w-full items-center justify-between gap-3 text-left text-sm font-medium text-foreground outline-none transition hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        local.class,
      )}
      {...rest}
    >
      <span>{local.children}</span>
      <ChevronDown class="h-4 w-4 shrink-0 transition-transform" />
    </KCollapsible.Trigger>
  );
}

export function CollapsibleContent(
  props: ParentProps<KCollapsible.CollapsibleContentProps & { class?: string }>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KCollapsible.Content class={cn("collapsible-content overflow-hidden", local.class)} {...rest}>
      {local.children}
    </KCollapsible.Content>
  );
}
