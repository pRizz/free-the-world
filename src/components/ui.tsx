import { cva, type VariantProps } from "class-variance-authority";
import type { Component, JSX, ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl border text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-[var(--color-accent-foreground)] shadow-lg shadow-[var(--color-accent-shadow)] hover:brightness-110",
        secondary:
          "border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-2 text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
        ghost: "border-transparent px-3 py-2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
      },
      size: {
        sm: "h-9 gap-2",
        md: "h-10 gap-2",
        lg: "h-12 gap-2 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = ParentProps<
  JSX.ButtonHTMLAttributes<HTMLButtonElement> &
    JSX.AnchorHTMLAttributes<HTMLAnchorElement> &
    VariantProps<typeof buttonVariants> & {
      as?: "button" | "a";
      href?: string;
    }
>;

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["as", "class", "variant", "size", "children"]);

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

export function Card(props: ParentProps<{ class?: string }>) {
  return (
    <section
      class={cn(
        "rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/92 p-5 shadow-xl shadow-black/15 backdrop-blur",
        props.class
      )}
    >
      {props.children}
    </section>
  );
}

export function Badge(props: ParentProps<{ class?: string; tone?: "default" | "accent" | "muted" }>) {
  const toneClasses = {
    default: "border-[var(--color-border)] bg-white/5 text-[var(--color-foreground)]",
    accent:
      "border-[color-mix(in_oklab,var(--color-accent),black_25%)] bg-[var(--color-accent-soft)] text-[var(--color-foreground)]",
    muted: "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-muted-foreground)]",
  } as const;

  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]",
        toneClasses[props.tone ?? "default"],
        props.class
      )}
    >
      {props.children}
    </span>
  );
}

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      class={cn(
        "h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-sm text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted-foreground)] focus:border-[var(--color-accent)]",
        props.class
      )}
    />
  );
}

export function Select(props: JSX.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      class={cn(
        "h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-4 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]",
        props.class
      )}
    />
  );
}

export const Table: Component<ParentProps<{ class?: string }>> = props => (
  <div class={cn("overflow-x-auto rounded-2xl border border-[var(--color-border)]", props.class)}>
    <table class="min-w-full border-collapse text-left text-sm">{props.children}</table>
  </div>
);

export const SectionHeading: Component<{
  eyebrow?: string;
  title: string;
  description?: string;
  class?: string;
}> = props => (
  <div class={cn("space-y-3", props.class)}>
    {props.eyebrow ? (
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-accent)]">
        {props.eyebrow}
      </p>
    ) : null}
    <div class="space-y-2">
      <h2 class="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
        {props.title}
      </h2>
      {props.description ? (
        <p class="max-w-3xl text-sm leading-7 text-[var(--color-muted-foreground)] sm:text-base">
          {props.description}
        </p>
      ) : null}
    </div>
  </div>
);
