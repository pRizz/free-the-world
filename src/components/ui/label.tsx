import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type LabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement> & {
  class?: string;
};

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: This shared primitive is associated by callers via htmlFor or wrapped controls.
    <label
      class={cn(
        "text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}
