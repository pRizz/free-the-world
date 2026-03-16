import { A, useLocation } from "@solidjs/router";
import { createEffect, createSignal, type ParentProps } from "solid-js";
import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Registry" },
  { href: "/mirrors", label: "Mirrors" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
] as const;

function NavLink(props: { href: string; label: string; class?: string }) {
  const location = useLocation();
  const isActive = () =>
    props.href === "/"
      ? location.pathname === props.href
      : location.pathname === props.href || location.pathname.startsWith(`${props.href}/`);

  return (
    <A
      href={props.href}
      class={cn(
        "rounded-full px-3 py-2 text-sm font-medium transition",
        isActive()
          ? "bg-secondary text-foreground"
          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
        props.class
      )}
    >
      {props.label}
    </A>
  );
}

function SiteNav(props: { ariaLabel: string; class?: string; linkClass?: string }) {
  return (
    <nav aria-label={props.ariaLabel} class={cn("flex items-center gap-1.5", props.class)}>
      {navigation.map(item => (
        <NavLink href={item.href} label={item.label} class={props.linkClass} />
      ))}
    </nav>
  );
}

export function SiteShell(props: ParentProps) {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = createSignal(false);

  createEffect(() => {
    location.pathname;
    setIsMobileNavOpen(false);
  });

  return (
    <div class="min-h-screen bg-background text-foreground">
      <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header class="sticky top-3 z-20 mt-3 rounded-xl border border-border bg-[color-mix(in_hsl,var(--background),transparent_10%)]/92 px-3 py-3 shadow-xl shadow-black/15 backdrop-blur sm:px-4 lg:px-5">
          <Collapsible open={isMobileNavOpen()} onOpenChange={setIsMobileNavOpen}>
            <div class="flex items-center justify-between gap-3">
              <A href="/" class="min-w-0">
                <span class="block whitespace-nowrap text-sm font-semibold tracking-[0.22em] uppercase text-title-foreground sm:text-base lg:text-lg">
                  {siteConfig.name}
                </span>
              </A>

              <div class="hidden items-center gap-2 lg:flex">
                <SiteNav ariaLabel="Primary" />
                <Button
                  as="a"
                  href={siteConfig.publicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  size="sm"
                  class="shrink-0"
                >
                  Newsletter on Substack
                </Button>
              </div>

              <CollapsibleTrigger
                class="w-auto shrink-0 rounded-full border border-border bg-card px-3 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:border-accent-foreground hover:text-foreground lg:hidden"
                aria-label="Toggle navigation menu"
              >
                Menu
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent class="lg:hidden">
              <div class="mt-4 border-t border-border pt-4">
                <SiteNav
                  ariaLabel="Mobile menu"
                  class="flex-col items-stretch gap-2"
                  linkClass="block rounded-2xl px-4 py-3 text-left text-base"
                />
                <Button
                  as="a"
                  href={siteConfig.publicationUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  class="mt-3 w-full"
                >
                  Newsletter on Substack
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </header>

        <main class="flex-1 py-8 sm:py-10">{props.children}</main>

        <footer class="mt-8 rounded-2xl border border-border bg-card px-5 py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium">{siteConfig.name}</p>
              <p class="max-w-2xl text-sm text-muted-foreground">
                Built as a research surface for tracking how AI, open source, Bitcoin rails, and distributed
                manufacturing steadily make legacy pricing models look like an elaborate historical accident.
              </p>
            </div>
            <p class="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {siteConfig.snapshotLabel}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
