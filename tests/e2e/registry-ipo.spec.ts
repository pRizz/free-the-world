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

test("registry renders missing IPO metrics as dashes for Berkshire Hathaway", async ({ page }) => {
  await page.goto("/companies");
  await page.getByRole("textbox", { name: "Search companies" }).fill("Berkshire Hathaway");

  const berkshireRow = page.getByRole("row", { name: /Berkshire Hathaway/i });
  await expect(berkshireRow).toContainText("Berkshire Hathaway");
  await expect(berkshireRow).toContainText("—");
});
