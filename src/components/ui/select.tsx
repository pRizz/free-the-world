import * as KSelect from "@kobalte/core/select";
import { Check, ChevronDown } from "lucide-solid";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export const Select = KSelect.Root;

export function SelectLabel(props: KSelect.SelectLabelProps & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KSelect.Label
      class={cn(
        "text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

export function SelectTrigger(props: ComponentProps<typeof KSelect.Trigger> & { class?: string }) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KSelect.Trigger
      class={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
        local.class,
      )}
      {...rest}
    >
      {local.children}
    </KSelect.Trigger>
  );
}

export function SelectValue(props: ComponentProps<typeof KSelect.Value> & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KSelect.Value class={cn("truncate text-left", local.class)} {...rest} />;
}

export function SelectIcon(props: ComponentProps<"span"> & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span class={cn("pointer-events-none shrink-0 text-muted-foreground", local.class)} {...rest}>
      <ChevronDown class="h-4 w-4" />
    </span>
  );
}

export function SelectContent(props: ComponentProps<typeof KSelect.Content> & { class?: string }) {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <KSelect.Portal>
      <KSelect.Content
        class={cn(
          "z-50 overflow-hidden rounded-2xl border border-border bg-card p-1 text-foreground shadow-2xl shadow-black/30",
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </KSelect.Content>
    </KSelect.Portal>
  );
}

export function SelectListbox(props: ComponentProps<typeof KSelect.Listbox> & { class?: string }) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <KSelect.Listbox class={cn("max-h-80 overflow-y-auto", local.class)} {...rest}>
      {local.children}
    </KSelect.Listbox>
  );
}

export function SelectItem(
  props: ComponentProps<typeof KSelect.Item> & {
    class?: string;
    indicatorClass?: string;
  },
) {
  const [local, rest] = splitProps(props, ["class", "children", "indicatorClass"]);

  return (
    <KSelect.Item
      class={cn(
        "relative flex cursor-default select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-secondary data-[disabled]:opacity-50",
        local.class,
      )}
      {...rest}
    >
      <KSelect.ItemLabel>{local.children}</KSelect.ItemLabel>
      <KSelect.ItemIndicator
        class={cn("absolute right-3 inline-flex items-center", local.indicatorClass)}
      >
        <Check class="h-4 w-4" />
      </KSelect.ItemIndicator>
    </KSelect.Item>
  );
}

export function SelectHidden(props: KSelect.SelectHiddenSelectProps) {
  return <KSelect.HiddenSelect {...props} />;
}

export function SelectField(props: {
  children?: ComponentProps<"div">["children"];
  class?: string;
}) {
  return <div class={cn("space-y-2", props.class)}>{props.children}</div>;
}
