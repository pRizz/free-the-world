import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "~/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary px-4 py-2 text-primary-foreground shadow-lg shadow-[var(--color-primary-shadow)] hover:brightness-110",
        secondary:
          "border-border bg-card px-4 py-2 text-foreground hover:border-accent-foreground hover:text-accent-foreground",
        ghost: "border-transparent px-3 py-2 text-muted-foreground hover:text-foreground",
      },
      size: {
        sm: "h-9",
        md: "h-10",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps<T extends ValidComponent = "button"> = ParentProps<
  {
    as?: T;
    class?: string;
  } & VariantProps<typeof buttonVariants> &
    ComponentProps<T>
>;

export function Button<T extends ValidComponent = "button">(props: ButtonProps<T>) {
  const [local, rest] = splitProps(props as ButtonProps, ["as", "class", "variant", "size", "children"]);

  return (
    <Dynamic
      component={local.as ?? "button"}
      class={cn(buttonVariants({ variant: local.variant, size: local.size }), local.class)}
      {...rest}
    >
      {local.children}
    </Dynamic>
  );
}
