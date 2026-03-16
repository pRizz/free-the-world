import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "~/lib/utils";

type CardPrimitiveProps<T extends ValidComponent = "div"> = ParentProps<
  {
    as?: T;
    class?: string;
  } & ComponentProps<T>
>;

function createCardPrimitive<TDefault extends ValidComponent>(
  defaultTag: TDefault,
  baseClass: string,
) {
  return function CardPrimitive<T extends ValidComponent = TDefault>(props: CardPrimitiveProps<T>) {
    const [local, rest] = splitProps(props as CardPrimitiveProps, ["as", "class", "children"]);

    return (
      <Dynamic component={local.as ?? defaultTag} class={cn(baseClass, local.class)} {...rest}>
        {local.children}
      </Dynamic>
    );
  };
}

export const Card = createCardPrimitive(
  "section",
  "rounded-2xl border border-border bg-card/92 p-5 shadow-xl shadow-black/15 backdrop-blur",
);

export const CardHeader = createCardPrimitive("div", "flex flex-col gap-2");
export const CardTitle = createCardPrimitive(
  "h2",
  "text-2xl font-semibold tracking-tight text-title-foreground",
);
export const CardDescription = createCardPrimitive(
  "p",
  "max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base",
);
export const CardContent = createCardPrimitive("div", "");
export const CardFooter = createCardPrimitive("div", "flex flex-wrap items-center gap-3");
