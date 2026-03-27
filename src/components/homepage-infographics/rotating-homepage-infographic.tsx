import { createMemo, createSignal, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import { ContentCard } from "~/components/blocks/content-card";
import { PageHeader } from "~/components/blocks/page-header";
import {
  defaultHomepageInfographicId,
  homepageInfographicIds,
  homepageInfographics,
} from "~/components/homepage-infographics/registry";
import {
  homepageInfographicStorageKey,
  normalizeHomepageInfographicId,
  pickRandomHomepageInfographicId,
} from "~/components/homepage-infographics/rotation";
import { Badge } from "~/components/ui/badge";
import { Button, ButtonLink } from "~/components/ui/button";

function readStoredInfographicId() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return normalizeHomepageInfographicId(
      homepageInfographicIds,
      window.localStorage.getItem(homepageInfographicStorageKey),
    );
  } catch {
    return null;
  }
}

function persistInfographicId(infographicId: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(homepageInfographicStorageKey, infographicId);
  } catch {
    // Storage can fail in privacy-restricted browsing modes; the rotation still works without it.
  }
}

export function RotatingHomepageInfographic() {
  const defaultInfographicId = defaultHomepageInfographicId;

  if (!defaultInfographicId) {
    throw new Error("Expected at least one homepage infographic.");
  }

  const [selectedInfographicId, setSelectedInfographicId] = createSignal(defaultInfographicId);
  const selectedInfographic = createMemo(
    () =>
      homepageInfographics.find((infographic) => infographic.id === selectedInfographicId()) ??
      homepageInfographics[0],
  );
  const selectedInfographicIndex = createMemo(() =>
    homepageInfographics.findIndex((infographic) => infographic.id === selectedInfographic().id),
  );

  function selectRandomInfographic(maybeExcludedInfographicId?: string | null) {
    const nextInfographicId =
      pickRandomHomepageInfographicId(homepageInfographicIds, maybeExcludedInfographicId) ??
      defaultInfographicId;
    setSelectedInfographicId(nextInfographicId);
    persistInfographicId(nextInfographicId);
  }

  onMount(() => {
    const maybeStoredInfographicId = readStoredInfographicId();
    if (!maybeStoredInfographicId) {
      persistInfographicId(defaultInfographicId);
      return;
    }

    selectRandomInfographic(maybeStoredInfographicId);
  });

  return (
    <ContentCard class="space-y-5">
      <div class="flex flex-wrap gap-2">
        <Badge tone="muted">
          Infographic {selectedInfographicIndex() + 1} of {homepageInfographics.length}
        </Badge>
        <Badge tone="muted">Page 1 on first load, shuffle after</Badge>
      </div>

      <PageHeader
        eyebrow={selectedInfographic().eyebrow}
        title={selectedInfographic().title}
        description={selectedInfographic().description}
      />

      <div class="min-h-[24rem]">
        <Dynamic component={selectedInfographic().component} />
      </div>

      <div class="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            selectRandomInfographic(selectedInfographic().id);
          }}
        >
          Show another view
        </Button>
        <ButtonLink href={selectedInfographic().href}>{selectedInfographic().ctaLabel}</ButtonLink>
      </div>
    </ContentCard>
  );
}
