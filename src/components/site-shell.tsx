import { A, useLocation } from "@solidjs/router";
import { ChevronDown } from "lucide-solid";
import { createEffect, createSignal, type ParentProps } from "solid-js";
import { RepositoryLink } from "~/components/repository-link";
import { Button } from "~/components/ui/button";
import { siteConfig } from "~/lib/config";
import { cn } from "~/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Registry" },
  { href: "/insights", label: "Insights" },
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
        props.class,
      )}
    >
      {props.label}
    </A>
  );
}

function SiteNav(props: { ariaLabel: string; class?: string; linkClass?: string }) {
  return (
    <nav aria-label={props.ariaLabel} class={cn("flex items-center gap-1.5", props.class)}>
      {navigation.map((item) => (
        <NavLink href={item.href} label={item.label} class={props.linkClass} />
      ))}
    </nav>
  );
}

export function SiteShell(props: ParentProps) {
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = createSignal(false);
  const buildInfo = siteConfig.buildInfo;
  const shortCommitSha = buildInfo?.commitSha.slice(0, 7);
  const mobileMenuId = "site-mobile-menu";

  createEffect(() => {
    location.pathname;
    setIsMobileNavOpen(false);
  });

  return (
    <div class="min-h-screen bg-background text-foreground">
      <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 sm:px-6 lg:px-8">
        <header class="sticky top-3 z-20 mt-3 rounded-xl border border-border bg-[color-mix(in_hsl,var(--background),transparent_10%)]/92 px-3 py-3 shadow-xl shadow-black/15 backdrop-blur sm:px-4 lg:px-5">
          <div class="flex items-center justify-between gap-3">
            <A href="/" class="min-w-0">
              <span class="block whitespace-nowrap text-sm font-semibold tracking-[0.22em] uppercase text-title-foreground sm:text-base lg:text-lg">
                {siteConfig.name}
              </span>
            </A>

            <div class="hidden items-center gap-2 lg:flex">
              <SiteNav ariaLabel="Primary" />
              <RepositoryLink size="sm" class="shrink-0" />
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

            <button
              type="button"
              class="flex w-auto shrink-0 items-center justify-between gap-3 rounded-full border border-border bg-card px-3 py-2 text-left text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase outline-none transition hover:border-accent-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
              aria-controls={mobileMenuId}
              aria-expanded={isMobileNavOpen()}
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileNavOpen((isOpen) => !isOpen)}
            >
              <span>Menu</span>
              <ChevronDown
                class={cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  isMobileNavOpen() ? "rotate-180" : null,
                )}
              />
            </button>
          </div>

          <div id={mobileMenuId} class="lg:hidden" hidden={!isMobileNavOpen()}>
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
              <RepositoryLink class="mt-2 w-full" />
            </div>
          </div>
        </header>

        <main class="flex-1 py-8 sm:py-10">{props.children}</main>

        <footer class="mt-8 rounded-2xl border border-border bg-card px-5 py-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div class="space-y-2">
              <p class="text-sm font-medium">{siteConfig.name}</p>
              <p class="max-w-2xl text-sm text-muted-foreground">
                Built as a research surface for tracking how AI, open source, Bitcoin rails, and
                distributed manufacturing steadily make legacy pricing models look like an elaborate
                historical accident.
              </p>
            </div>
            <div class="space-y-1 sm:text-right">
              <p class="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                {siteConfig.snapshotLabel}
              </p>
              <RepositoryLink
                tone="inline"
                class="justify-start text-xs text-muted-foreground hover:text-foreground sm:justify-end"
              />
              {buildInfo && shortCommitSha ? (
                <p class="text-xs text-muted-foreground">
                  Commit{" "}
                  <a
                    href={buildInfo.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                    class="font-mono text-foreground underline decoration-border underline-offset-4 transition hover:text-accent-foreground"
                    title={buildInfo.commitSha}
                  >
                    {shortCommitSha}
                  </a>{" "}
                  {"·"}{" "}
                  <time dateTime={buildInfo.commitTimestamp} title={buildInfo.commitTimestamp}>
                    {buildInfo.commitTimestampLabel}
                  </time>
                </p>
              ) : null}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
