import { ContentCard } from "~/components/blocks/content-card";
import { MetadataGrid } from "~/components/blocks/metadata-grid";
import { PageHeader } from "~/components/blocks/page-header";
import { RepositoryLink } from "~/components/repository-link";
import { Seo } from "~/components/seo";
import { siteConfig } from "~/lib/config";
import { aboutSections } from "~/lib/content/site";

export default function About() {
  const buildInfo = siteConfig.buildInfo;
  const shortCommitSha = buildInfo?.commitSha.slice(0, 7);

  return (
    <>
      <Seo
        title="About · Free The World"
        description="Free The World is opinionated research, not a worship service for incumbents or a promise that every protocol immediately wins. The goal is to study where the pricing power looks more fragile than consensus admits."
        route="/about"
      />

      <div class="space-y-8">
        <PageHeader
          eyebrow="About"
          title="A registry for the slowly free future"
          description="Free The World is opinionated research, not a worship service for incumbents or a promise that every protocol immediately wins. The goal is to study where the pricing power looks more fragile than consensus admits."
        />

        {buildInfo && shortCommitSha ? (
          <ContentCard class="space-y-4">
            <section aria-labelledby="build-metadata-title" class="space-y-4">
              <div class="space-y-2">
                <h2 id="build-metadata-title" class="text-2xl font-semibold tracking-tight">
                  Build metadata
                </h2>
                <p class="max-w-2xl text-sm text-muted-foreground">
                  This static artifact is tied to a specific git revision so the published site can
                  be traced back to the exact source snapshot.
                </p>
              </div>

              <MetadataGrid
                class="lg:grid-cols-3"
                items={[
                  {
                    label: "Commit",
                    value: (
                      <a
                        href={buildInfo.commitUrl}
                        target="_blank"
                        rel="noreferrer"
                        class="font-mono text-sm text-accent-foreground underline decoration-border underline-offset-4 transition hover:text-foreground sm:text-base"
                        title={buildInfo.commitSha}
                      >
                        {shortCommitSha}
                      </a>
                    ),
                  },
                  {
                    label: "Commit timestamp",
                    value: (
                      <time
                        dateTime={buildInfo.commitTimestamp}
                        class="block break-all font-mono text-sm text-foreground sm:text-base"
                      >
                        {buildInfo.commitTimestamp}
                      </time>
                    ),
                  },
                  {
                    label: "Repository",
                    value: (
                      <RepositoryLink
                        tone="inline"
                        class="text-sm text-accent-foreground hover:text-foreground sm:text-base"
                      />
                    ),
                  },
                ]}
              />
            </section>
          </ContentCard>
        ) : null}

        {aboutSections.map((section) => (
          <ContentCard class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <div class="prose-block">
              {section.paragraphs.map((paragraph) => (
                <p>{paragraph}</p>
              ))}
            </div>
          </ContentCard>
        ))}
      </div>
    </>
  );
}
