import type { ParentProps } from "solid-js";
import { cn } from "~/lib/utils";

const badgeToneClasses = {
  default: "border-border bg-white/5 text-foreground",
  accent: "border-[color-mix(in_hsl,var(--primary),black_25%)] bg-secondary text-foreground",
  muted: "border-border bg-card text-muted-foreground",
} as const;

export function Badge(props: ParentProps<{ class?: string; tone?: keyof typeof badgeToneClasses }>) {
  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]",
        badgeToneClasses[props.tone ?? "default"],
        props.class
      )}
    >
      {props.children}
    </span>
  );
}
