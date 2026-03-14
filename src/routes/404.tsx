import { A } from "@solidjs/router";
import { EmptyState } from "~/components/blocks/empty-state";

export default function NotFoundPage() {
  return (
    <EmptyState
      eyebrow="404"
      title="That page does not exist"
      description="The route you requested is not part of the current static snapshot. The future may be decentralized, but this URL is still unfortunately absent."
    >
      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <A href="/" class="hover:text-accent-foreground">
          Home
        </A>
        <A href="/companies" class="hover:text-accent-foreground">
          Registry
        </A>
        <A href="/methodology" class="hover:text-accent-foreground">
          Methodology
        </A>
      </div>
    </EmptyState>
  );
}
