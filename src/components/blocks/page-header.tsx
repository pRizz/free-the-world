import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function PageHeader(props: {
  eyebrow?: string;
  title: string;
  description?: string;
  class?: string;
}) {
  return (
    <CardHeader class={cn("space-y-3", props.class)}>
      {props.eyebrow ? (
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground">
          {props.eyebrow}
        </p>
      ) : null}
      <div class="space-y-2">
        <CardTitle class="sm:text-3xl">{props.title}</CardTitle>
        {props.description ? <CardDescription>{props.description}</CardDescription> : null}
      </div>
    </CardHeader>
  );
}
