import { expect, test } from "@playwright/test";
import { gotoRoute } from "./support";

test("registry narrows the edge blur treatment on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/companies");

  const viewport = page.locator(".table-viewport");
  const rightFade = page.locator(".table-edge-fade--right");

  await expect(viewport).toBeVisible();
  await expect(rightFade).toHaveAttribute("data-visible", "true");

  const metrics = await page.evaluate(() => {
    const viewportElement = document.querySelector<HTMLDivElement>(".table-viewport");
    const rightFadeElement = document.querySelector<HTMLDivElement>(".table-edge-fade--right");

    if (!viewportElement || !rightFadeElement) {
      throw new Error("Expected table viewport and right edge fade to exist.");
    }

    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const desktopMinWidth = 3.85 * rootFontSize + 6;
    const rightFadeStyle = getComputedStyle(rightFadeElement);

    return {
      backdropFilter: rightFadeStyle.backdropFilter,
      rightFadeWidth: rightFadeElement.getBoundingClientRect().width,
      desktopMinWidth,
      hasOverflow: viewportElement.scrollWidth > viewportElement.clientWidth,
    };
  });

  expect(metrics.hasOverflow).toBe(true);
  expect(metrics.backdropFilter).toContain("10px");
  expect(metrics.rightFadeWidth).toBeLessThan(metrics.desktopMinWidth);
});
