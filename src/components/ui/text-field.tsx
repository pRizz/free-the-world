import * as KTextField from "@kobalte/core/text-field";
import type { ComponentProps, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type RootProps = ParentProps<KTextField.TextFieldRootProps & { class?: string }>;

export function TextField(props: RootProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KTextField.Root class={cn("space-y-2", local.class)} {...rest}>
      {local.children}
    </KTextField.Root>
  );
}

export function TextFieldLabel(props: KTextField.TextFieldLabelProps & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KTextField.Label
      class={cn(
        "text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

export function TextFieldInput(
  props: ComponentProps<typeof KTextField.Input> & { class?: string },
) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KTextField.Input
      class={cn(
        "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring",
        local.class,
      )}
      {...rest}
    />
  );
}

export function TextFieldDescription(
  props: KTextField.TextFieldDescriptionProps & { class?: string },
) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KTextField.Description class={cn("text-sm text-muted-foreground", local.class)} {...rest} />
  );
}

export function TextFieldErrorMessage(
  props: KTextField.TextFieldErrorMessageProps & { class?: string },
) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KTextField.ErrorMessage class={cn("text-sm text-destructive", local.class)} {...rest} />;
}
