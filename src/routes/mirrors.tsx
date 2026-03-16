import { For } from "solid-js";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { Seo } from "~/components/seo";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { getSiteAccessEntries, type SiteAccessEntry } from "~/lib/deployment-config";

const siteAccessEntries = getSiteAccessEntries();

const kindBadgeTone: Record<SiteAccessEntry["kind"], "accent" | "default" | "muted"> = {
  canonical: "accent",
  live: "default",
  mirror: "default",
  redirect: "muted",
};

const kindLabel: Record<SiteAccessEntry["kind"], string> = {
  canonical: "Canonical",
  live: "Live",
  mirror: "Mirror",
  redirect: "Redirect",
};

export default function MirrorsPage() {
  return (
    <>
      <Seo
        title="Mirrors · Free The World"
        description="Find the primary canonical Free The World host, the live secondary .com host, the public GitHub Pages mirror, and the redirect-only domains currently configured in this repo."
        route="/mirrors"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="Mirrors"
          title="Where Free The World is currently reachable"
          description="The repo currently defines one primary canonical site, one secondary live site, one public mirror, and several redirect-only domains. Each host is labeled so readers can tell which URLs serve content and which ones simply point back to the primary .ai origin."
        />

        <ContentCard class="space-y-5">
          <div class="space-y-3">
            <h2 class="text-2xl font-semibold tracking-tight">Configured site access points</h2>
            <p class="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              The primary `.ai` AWS host is the canonical source of truth. The `.com` host stays
              live on the same production stack but canonicalizes back to `.ai`. GitHub Pages
              remains a noindex mirror. The additional domains below are redirect aliases, not
              separate mirrors.
            </p>
          </div>

          <div class="grid gap-4 lg:grid-cols-2">
            <For each={siteAccessEntries}>
              {(entry) => (
                <article class="space-y-4 rounded-2xl border border-border bg-card p-5">
                  <div class="flex flex-wrap items-center gap-2">
                    <Badge tone={kindBadgeTone[entry.kind]}>{kindLabel[entry.kind]}</Badge>
                    <Badge tone={entry.shouldIndex ? "accent" : "muted"}>
                      {entry.shouldIndex ? "Indexed" : "Noindex"}
                    </Badge>
                  </div>

                  <div class="space-y-2">
                    <h3 class="text-xl font-semibold tracking-tight">{entry.label}</h3>
                    <p class="text-sm leading-7 text-muted-foreground">{entry.description}</p>
                  </div>

                  <div class="space-y-2 text-sm leading-7">
                    <p class="font-medium text-foreground">{entry.url}</p>
                    {entry.redirectTarget ? (
                      <p class="text-muted-foreground">Redirect target: {entry.redirectTarget}</p>
                    ) : null}
                  </div>

                  <Button as="a" href={entry.url} variant="secondary">
                    Visit host
                  </Button>
                </article>
              )}
            </For>
          </div>
        </ContentCard>

        <ContentCard class="space-y-4">
          <div class="space-y-2">
            <h2 class="text-2xl font-semibold tracking-tight">Tor access</h2>
            <p class="text-sm leading-7 text-muted-foreground sm:text-base">
              Tor-based mirrors are coming soon. They are not configured in this repo yet, so there
              is no `.onion` address to publish or verify today.
            </p>
          </div>
        </ContentCard>
      </div>
    </>
  );
}
