import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type LabelProps = JSX.LabelHTMLAttributes<HTMLLabelElement> & {
  class?: string;
};

export function Label(props: LabelProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <label
      class={cn("text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground", local.class)}
      {...rest}
    />
  );
}
