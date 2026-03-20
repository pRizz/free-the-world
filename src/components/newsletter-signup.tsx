import { PageHeader } from "~/components/blocks/page-header";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { newsletterContent } from "~/lib/content/newsletter";

export function NewsletterSignup() {
  return (
    <Card class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-4">
        <PageHeader
          eyebrow={newsletterContent.eyebrow}
          title={newsletterContent.title}
          description={newsletterContent.description}
        />

        <Button
          as="a"
          href={newsletterContent.publicationUrl}
          target="_blank"
          rel="noreferrer"
          variant="secondary"
        >
          Open publication in a new tab
        </Button>
      </div>

      <div class="flex min-h-[320px] items-center justify-center rounded-2xl bg-card p-3 shadow-inner shadow-black/10">
        <iframe
          src={newsletterContent.embedUrl}
          title="Free The World newsletter signup"
          class="h-[320px] w-full max-w-[480px] rounded-xl border border-white/10 bg-card"
          loading="lazy"
        />
      </div>
    </Card>
  );
}
