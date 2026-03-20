import { children, type JSX } from "solid-js";
import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function PageHeader(props: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: JSX.Element;
  class?: string;
}) {
  const resolvedActions = children(() => props.actions);

  return (
    <CardHeader class={cn("space-y-3", props.class)}>
      {props.eyebrow ? (
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground">
          {props.eyebrow}
        </p>
      ) : null}
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-2">
          <CardTitle class="sm:text-3xl">{props.title}</CardTitle>
          {props.description ? <CardDescription>{props.description}</CardDescription> : null}
        </div>
        {resolvedActions.toArray().length ? (
          <div class="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">{resolvedActions()}</div>
        ) : null}
      </div>
    </CardHeader>
  );
}
