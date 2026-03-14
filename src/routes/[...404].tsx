import { A } from "@solidjs/router";
import { Card, SectionHeading } from "~/components/ui";

export default function NotFound() {
  return (
    <Card class="space-y-4">
      <SectionHeading
        eyebrow="404"
        title="That page does not exist"
        description="The route you requested is not part of the current static snapshot. The future may be decentralized, but this URL is still unfortunately absent."
      />
      <div class="flex flex-wrap gap-4 text-sm text-[var(--color-muted-foreground)]">
        <A href="/" class="hover:text-[var(--color-accent)]">
          Home
        </A>
        <A href="/companies" class="hover:text-[var(--color-accent)]">
          Registry
        </A>
        <A href="/methodology" class="hover:text-[var(--color-accent)]">
          Methodology
        </A>
      </div>
    </Card>
  );
}
