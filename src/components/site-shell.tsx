import { A, useLocation } from "@solidjs/router";
import type { ParentProps } from "solid-js";
import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/utils";
import { Badge, Button } from "~/components/ui";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Registry" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
] as const;

function NavLink(props: { href: string; label: string }) {
  const location = useLocation();
  const isActive = () =>
    props.href === "/"
      ? location.pathname === props.href
      : location.pathname === props.href || location.pathname.startsWith(`${props.href}/`);

  return (
    <A
      href={props.href}
      class={cn(
        "rounded-full px-4 py-2 text-sm transition",
        isActive()
          ? "bg-[var(--color-accent-soft)] text-[var(--color-foreground)]"
          : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      )}
    >
      {props.label}
    </A>
  );
}

export function SiteShell(props: ParentProps) {
  return (
    <div class="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header class="sticky top-0 z-20 mt-4 border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-background),transparent_10%)]/90 px-4 py-4 backdrop-blur sm:px-6 rounded-2xl">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="space-y-2">
              <A href="/" class="inline-flex items-center gap-3">
                <Badge tone="accent">Dark mode by default</Badge>
                <span class="text-lg font-semibold tracking-[0.18em] uppercase">{siteConfig.name}</span>
              </A>
              <p class="max-w-xl text-sm text-[var(--color-muted-foreground)]">
                A running ledger of corporate moats, decentralizability, and the capital still trapped
                inside products that insist on charging rent for what should soon be free.
              </p>
            </div>

            <div class="flex flex-col gap-3 lg:items-end">
              <nav class="flex flex-wrap items-center gap-2">
                {navigation.map(item => (
                  <NavLink href={item.href} label={item.label} />
                ))}
              </nav>
              <Button as="a" href={siteConfig.publicationUrl} target="_blank" rel="noreferrer" variant="secondary">
                Newsletter on Substack
              </Button>
            </div>
          </div>
        </header>

        <main class="flex-1 py-10">{props.children}</main>

        <footer class="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium">{siteConfig.name}</p>
              <p class="max-w-2xl text-sm text-[var(--color-muted-foreground)]">
                Built as a research surface for tracking how AI, open source, Bitcoin rails, and distributed
                manufacturing steadily make legacy pricing models look like an elaborate historical accident.
              </p>
            </div>
            <p class="text-xs uppercase tracking-[0.28em] text-[var(--color-muted-foreground)]">
              {siteConfig.snapshotLabel}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
