import {
  createSignal,
  onCleanup,
  onMount,
  splitProps,
  type ComponentProps,
  type JSX,
  type ParentProps,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { cn } from "~/lib/utils";

type PrimitiveProps<T extends ValidComponent = "div"> = ParentProps<{
  as?: T;
  class?: string;
} & ComponentProps<T>>;

type TableProps = ParentProps<
  ComponentProps<"div"> & {
    class?: string;
    edgeFade?: boolean;
  }
>;

const edgeFadeBlurStyle: JSX.CSSProperties = {
  "backdrop-filter": "blur(10px)",
  "-webkit-backdrop-filter": "blur(10px)",
};

const leftEdgeFadeStyle: JSX.CSSProperties = {
  ...edgeFadeBlurStyle,
  "mask-image": "linear-gradient(90deg, rgb(0 0 0 / 1) 0%, rgb(0 0 0 / 1) 40%, rgb(0 0 0 / 0.72) 62%, transparent 100%)",
  "-webkit-mask-image":
    "linear-gradient(90deg, rgb(0 0 0 / 1) 0%, rgb(0 0 0 / 1) 40%, rgb(0 0 0 / 0.72) 62%, transparent 100%)",
};

const rightEdgeFadeStyle: JSX.CSSProperties = {
  ...edgeFadeBlurStyle,
  "mask-image": "linear-gradient(270deg, rgb(0 0 0 / 1) 0%, rgb(0 0 0 / 1) 40%, rgb(0 0 0 / 0.72) 62%, transparent 100%)",
  "-webkit-mask-image":
    "linear-gradient(270deg, rgb(0 0 0 / 1) 0%, rgb(0 0 0 / 1) 40%, rgb(0 0 0 / 0.72) 62%, transparent 100%)",
};

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

export function Table(props: TableProps) {
  let viewportRef: HTMLDivElement | undefined;
  let contentObserver: ResizeObserver | undefined;
  let viewportObserver: ResizeObserver | undefined;
  let rafId: number | undefined;
  const [local, rest] = splitProps(props, ["class", "children", "edgeFade", "onScroll"]);
  const [showLeftFade, setShowLeftFade] = createSignal(false);
  const [showRightFade, setShowRightFade] = createSignal(false);
  const edgeFadeEnabled = () => local.edgeFade !== false;

  function scheduleSync() {
    if (typeof window === "undefined") {
      return;
    }

    if (rafId !== undefined) {
      window.cancelAnimationFrame(rafId);
    }

    rafId = window.requestAnimationFrame(() => {
      rafId = undefined;
      syncEdgeFade();
    });
  }

  function syncEdgeFade() {
    if (!edgeFadeEnabled() || !viewportRef) {
      setShowLeftFade(false);
      setShowRightFade(false);
      return;
    }

    const tolerance = 1;
    const maxScrollLeft = viewportRef.scrollWidth - viewportRef.clientWidth;
    const hasOverflow = maxScrollLeft > tolerance;

    if (!hasOverflow) {
      setShowLeftFade(false);
      setShowRightFade(false);
      return;
    }

    setShowLeftFade(viewportRef.scrollLeft > tolerance);
    setShowRightFade(maxScrollLeft - viewportRef.scrollLeft > tolerance);
  }

  onMount(() => {
    if (!viewportRef || !edgeFadeEnabled()) {
      return;
    }

    const handleScroll = () => {
      syncEdgeFade();
    };

    viewportRef.addEventListener("scroll", handleScroll, { passive: true });

    if (typeof ResizeObserver !== "undefined") {
      viewportObserver = new ResizeObserver(() => {
        scheduleSync();
      });
      viewportObserver.observe(viewportRef);

      const contentElement = viewportRef.firstElementChild;
      if (contentElement instanceof HTMLElement) {
        contentObserver = new ResizeObserver(() => {
          scheduleSync();
        });
        contentObserver.observe(contentElement);
      }
    }

    scheduleSync();

    onCleanup(() => {
      viewportRef?.removeEventListener("scroll", handleScroll);
      viewportObserver?.disconnect();
      contentObserver?.disconnect();
      if (rafId !== undefined && typeof window !== "undefined") {
        window.cancelAnimationFrame(rafId);
      }
    });
  });

  return (
    <div class={cn("table-shell relative overflow-hidden rounded-2xl border border-border", local.class)} {...rest}>
      <div
        ref={element => {
          viewportRef = element;
        }}
        class="table-viewport overflow-x-auto"
        onScroll={local.onScroll}
      >
        {local.children}
      </div>

      {edgeFadeEnabled() ? (
        <>
          <div
            aria-hidden="true"
            class="table-edge-fade table-edge-fade--left"
            data-visible={showLeftFade() ? "true" : "false"}
            style={leftEdgeFadeStyle}
          />
          <div
            aria-hidden="true"
            class="table-edge-fade table-edge-fade--right"
            data-visible={showRightFade() ? "true" : "false"}
            style={rightEdgeFadeStyle}
          />
        </>
      ) : null}
    </div>
  );
}

export const TableElement = primitive("table", "min-w-full border-collapse text-left text-sm");
export const TableHeader = primitive("thead", "bg-card text-xs uppercase tracking-[0.24em] text-muted-foreground");
export const TableBody = primitive("tbody", "");
export const TableRow = primitive("tr", "border-t border-border align-top");
export const TableHead = primitive("th", "px-4 py-4 font-medium");
export const TableCell = primitive("td", "px-4 py-4 text-sm");
