import * as KDialog from "@kobalte/core/dialog";
import type { ParentProps } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

export function Dialog(props: ParentProps<KDialog.DialogRootProps>) {
  return <KDialog.Root {...props} />;
}

export function DialogContent(
  props: ParentProps<KDialog.DialogContentProps & { class?: string; overlayClass?: string }>,
) {
  const [local, rest] = splitProps(props, ["class", "overlayClass", "children"]);

  return (
    <KDialog.Portal>
      <KDialog.Overlay
        class={cn(
          "dialog-overlay fixed inset-0 z-40 bg-background/84 backdrop-blur-sm",
          local.overlayClass,
        )}
      />
      <KDialog.Content
        class={cn(
          "dialog-content fixed inset-x-4 top-[6vh] z-50 mx-auto max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[1.75rem] border border-border bg-card p-6 shadow-2xl shadow-black/45 sm:inset-x-6 sm:p-7",
          local.class,
        )}
        {...rest}
      >
        {local.children}
      </KDialog.Content>
    </KDialog.Portal>
  );
}

export function DialogTitle(props: KDialog.DialogTitleProps & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KDialog.Title class={cn("text-2xl font-semibold tracking-tight", local.class)} {...rest} />
  );
}

export function DialogDescription(props: KDialog.DialogDescriptionProps & { class?: string }) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KDialog.Description
      class={cn("text-sm leading-7 text-muted-foreground sm:text-base", local.class)}
      {...rest}
    />
  );
}
