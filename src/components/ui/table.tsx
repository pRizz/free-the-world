import type { ComponentProps, ParentProps, ValidComponent } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "~/lib/utils";

type PrimitiveProps<T extends ValidComponent = "div"> = ParentProps<{
  as?: T;
  class?: string;
} & ComponentProps<T>>;

function primitive<TDefault extends ValidComponent>(defaultTag: TDefault, baseClass: string) {
  return function Primitive<T extends ValidComponent = TDefault>(props: PrimitiveProps<T>) {
    const [local, rest] = splitProps(props as PrimitiveProps, ["as", "class", "children"]);

    return (
      <Dynamic component={local.as ?? defaultTag} class={cn(baseClass, local.class)} {...rest}>
        {local.children}
      </Dynamic>
    );
  };
}

export const Table = primitive("div", "overflow-x-auto rounded-2xl border border-border");
export const TableElement = primitive("table", "min-w-full border-collapse text-left text-sm");
export const TableHeader = primitive("thead", "bg-card text-xs uppercase tracking-[0.24em] text-muted-foreground");
export const TableBody = primitive("tbody", "");
export const TableRow = primitive("tr", "border-t border-border align-top");
export const TableHead = primitive("th", "px-4 py-4 font-medium");
export const TableCell = primitive("td", "px-4 py-4 text-sm");
