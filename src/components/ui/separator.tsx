import * as KSeparator from "@kobalte/core/separator";
import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

type SeparatorProps = ComponentProps<typeof KSeparator.Root> & {
  class?: string;
};

export function Separator(props: SeparatorProps) {
  const [local, rest] = splitProps(props, ["class", "orientation"]);

  return (
    <KSeparator.Root
      orientation={local.orientation ?? "horizontal"}
      class={cn(
        local.orientation === "vertical"
          ? "h-full w-px shrink-0 bg-border"
          : "h-px w-full shrink-0 bg-border",
        local.class,
      )}
      {...rest}
    />
  );
}
