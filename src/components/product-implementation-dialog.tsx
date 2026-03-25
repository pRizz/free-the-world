import type { VariantProps } from "class-variance-authority";
import { createEffect, createSignal } from "solid-js";
import { ActionRow } from "~/components/blocks/action-row";
import { Button, type buttonVariants } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import {
  TextField,
  TextFieldDescription,
  TextFieldLabel,
  TextFieldTextArea,
} from "~/components/ui/text-field";
import type { Company, Product } from "~/lib/domain/types";

export function ProductImplementationDialog(props: {
  company: Company;
  product: Product;
  buttonLabel?: string;
  buttonSize?: "sm" | "md" | "lg";
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [copyState, setCopyState] = createSignal<"idle" | "copied" | "manual">("idle");
  let promptTextArea: HTMLTextAreaElement | undefined;

  createEffect(() => {
    if (!isOpen()) {
      setCopyState("idle");
    }
  });

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(props.product.implementationPrompt.markdown);
      setCopyState("copied");
      return;
    } catch {
      promptTextArea?.focus();
      promptTextArea?.select();
      setCopyState("manual");
    }
  }

  const floatingCopyLabel = () => (copyState() === "copied" ? "Copied" : "Copy");
  const footerCopyLabel = () => (copyState() === "copied" ? "Copied" : "Copy prompt");

  return (
    <>
      <Button
        variant={props.buttonVariant ?? "primary"}
        size={props.buttonSize ?? "md"}
        onClick={() => setIsOpen(true)}
      >
        {props.buttonLabel ?? "Implement Now!"}
      </Button>

      <Dialog open={isOpen()} onOpenChange={setIsOpen}>
        <DialogContent>
          <div class="space-y-6">
            <div class="space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.24em] text-accent-foreground">
                Build This Disruption
              </p>
              <DialogTitle>Implement {props.product.name} as a free-future project</DialogTitle>
              <DialogDescription>
                Paste the prompt below into Codex, Claude, or OpenClaw. It tells the agent to
                confirm repo setup, research protocols and docs first, adopt Bright Builds
                requirements early, split bounded research into subagents when available, and then
                implement and verify the first meaningful release.
              </DialogDescription>
            </div>

            <div class="grid gap-4 rounded-3xl border border-border bg-background/55 p-4 sm:grid-cols-3">
              <article class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Company
                </p>
                <p class="text-sm font-medium text-foreground">{props.company.name}</p>
              </article>
              <article class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Product
                </p>
                <p class="text-sm font-medium text-foreground">{props.product.name}</p>
              </article>
              <article class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Prompt snapshot
                </p>
                <p class="text-sm font-medium text-foreground">
                  {props.product.implementationPrompt.generatedOn}
                </p>
              </article>
            </div>

            <TextField class="space-y-3">
              <TextFieldLabel>Implementation prompt</TextFieldLabel>
              <TextFieldDescription>
                This is canonical repo content from the published research pipeline. If clipboard
                access fails, the textarea will be selected for manual copy.
              </TextFieldDescription>
              <div class="relative">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  class="absolute right-3 top-3 z-10 shadow-lg shadow-black/10"
                  onClick={handleCopy}
                  aria-label="Copy implementation prompt"
                >
                  {floatingCopyLabel()}
                </Button>
                <TextFieldTextArea
                  ref={promptTextArea}
                  readOnly={true}
                  value={props.product.implementationPrompt.markdown}
                  rows={24}
                  class="min-h-[24rem] resize-y pt-14 pr-24 font-mono text-[0.82rem] leading-6 sm:pr-28"
                />
              </div>
            </TextField>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-sm text-muted-foreground">
                {copyState() === "copied"
                  ? "Prompt copied to clipboard."
                  : copyState() === "manual"
                    ? "Clipboard access failed. The prompt was selected for manual copy."
                    : "The prompt is ready to paste into your coding agent."}
              </p>
              <ActionRow>
                <Button type="button" onClick={handleCopy}>
                  {footerCopyLabel()}
                </Button>
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                  Close
                </Button>
              </ActionRow>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
