import * as KCheckbox from "@kobalte/core/checkbox";
import { Check } from "lucide-solid";
import type { ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export const Checkbox = KCheckbox.Root;
export const CheckboxInput = KCheckbox.Input;

export function CheckboxControl(
  props: ParentProps<KCheckbox.CheckboxControlProps & { class?: string }>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KCheckbox.Control
      class={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-card text-primary-foreground transition data-[checked]:border-primary data-[checked]:bg-primary",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </KCheckbox.Control>
  );
}

export function CheckboxIndicator(props: KCheckbox.CheckboxIndicatorProps & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KCheckbox.Indicator class={cn("text-current", local.class)} {...rest}>
      <Check class="h-3.5 w-3.5" />
    </KCheckbox.Indicator>
  );
}

export function CheckboxLabel(
  props: ParentProps<KCheckbox.CheckboxLabelProps & { class?: string }>,
) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <KCheckbox.Label class={cn("text-sm text-foreground", local.class)} {...rest}>
      {local.children}
    </KCheckbox.Label>
  );
}
