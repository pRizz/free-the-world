import { Title } from "@solidjs/meta";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import { aboutSections } from "~/lib/content/site";

export default function About() {
  return (
    <>
      <Title>About · Free The World</Title>

      <div class="space-y-8">
        <PageHeader
          eyebrow="About"
          title="A registry for the slowly free future"
          description="Free The World is opinionated research, not a worship service for incumbents or a promise that every protocol immediately wins. The goal is to study where the pricing power looks more fragile than consensus admits."
        />

        {aboutSections.map(section => (
          <ContentCard class="space-y-4">
            <h2 class="text-2xl font-semibold tracking-tight">{section.title}</h2>
            <div class="prose-block">
              {section.paragraphs.map(paragraph => (
                <p>{paragraph}</p>
              ))}
            </div>
          </ContentCard>
        ))}
      </div>
    </>
  );
}
