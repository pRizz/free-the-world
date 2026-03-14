import { expect, test } from "@playwright/test";

test("registry shows the IPO columns by default and renders Apple's IPO metrics", async ({ page }) => {
  await page.goto("/companies");
  await page.locator(".table-viewport").evaluate(element => {
    element.scrollLeft = element.scrollWidth;
  });

  await expect(page.getByRole("columnheader", { name: "IPO cap" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "IPO x" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "IPO CAGR" })).toBeVisible();

  const appleRow = page.getByRole("row", { name: /Apple/i });
  await expect(appleRow).toContainText("$1.2B");
  await expect(appleRow).toContainText("3,102.1x");
  await expect(appleRow).toContainText("19.4%");
});

test("registry can sort by IPO CAGR and keeps missing IPO metrics at the bottom", async ({ page }) => {
  await page.goto("/companies");

  const sortMetricTrigger = page.getByTestId("toolbar-select-sort-metric");
  await expect(sortMetricTrigger).toBeVisible();
  await sortMetricTrigger.focus();
  await sortMetricTrigger.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Yearly market cap growth since IPO" })).toBeVisible();
  await page.getByRole("option", { name: "Yearly market cap growth since IPO" }).click();

  const rows = page.locator("tbody tr");
  await expect(rows.first()).toContainText("Tesla");
  await expect(rows.last()).toContainText("Berkshire Hathaway");
  await expect(rows.last()).toContainText("—");
});
