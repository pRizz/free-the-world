import { expect, test, type Page } from "@playwright/test";
import { gotoRoute } from "./support";

const blockedRuntimeErrorPatterns = [/Hydration Mismatch/i, /SourceMapConsumer/i, /get-source-map/i];

function collectRuntimeFailures(page: Page) {
  const failures: string[] = [];

  page.on("console", message => {
    const text = message.text();

    if (
      (message.type() === "error" || message.type() === "warning") &&
      blockedRuntimeErrorPatterns.some(pattern => pattern.test(text))
    ) {
      failures.push(`[console:${message.type()}] ${text}`);
    }
  });

  page.on("pageerror", error => {
    const text = error.stack ?? error.message;

    if (blockedRuntimeErrorPatterns.some(pattern => pattern.test(text))) {
      failures.push(`[pageerror] ${text}`);
    }
  });

  return () => failures.join("\n");
}

for (const route of ["/", "/companies"]) {
  test(`initial load and first scroll stay clear of hydration and source-map runtime errors on ${route}`, async ({
    page,
  }) => {
    const getFailures = collectRuntimeFailures(page);

    await page.setViewportSize({ width: 1280, height: 900 });
    await gotoRoute(page, route);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(250);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(250);

    await expect
      .poll(getFailures, {
        timeout: 1_000,
        message: `Unexpected runtime errors while testing ${route}`,
      })
      .toBe("");
  });
}
