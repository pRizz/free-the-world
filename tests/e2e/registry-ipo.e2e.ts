import { expect, test } from "@playwright/test";
import { gotoRoute } from "./support";

test("registry shows the IPO columns by default and renders Apple's IPO metrics", async ({ page }) => {
  await gotoRoute(page, "/companies");
  await page.getByPlaceholder("Search by name, ticker, sector, or thesis").fill("Apple");
  await page.locator(".table-viewport").evaluate(element => {
    element.scrollLeft = element.scrollWidth;
  });

  await expect(page.getByRole("columnheader", { name: "IPO cap" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "IPO x" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "IPO CAGR" })).toBeVisible();

  const appleRow = page.getByRole("row", { name: /Apple/i });
  const ipoMarketCapCell = appleRow.locator("td").nth(7).locator("p").first();
  const ipoReturnMultiplierCell = appleRow.locator("td").nth(8).locator("p").first();
  const ipoAnnualizedGrowthRateCell = appleRow.locator("td").nth(9).locator("p").first();

  await expect(ipoMarketCapCell).toHaveText(/\$\d/);
  await expect(ipoReturnMultiplierCell).toHaveText(/\d[\d,.]*x/);
  await expect(ipoAnnualizedGrowthRateCell).toHaveText(/\d+(?:\.\d+)?%/);
});

test("registry renders missing IPO metrics as dashes for Berkshire Hathaway", async ({ page }) => {
  await gotoRoute(page, "/companies");
  await page.getByPlaceholder("Search by name, ticker, sector, or thesis").fill("Berkshire Hathaway");
  await page.locator(".table-viewport").evaluate(element => {
    element.scrollLeft = element.scrollWidth;
  });

  const berkshireRow = page.getByRole("row", { name: /Berkshire Hathaway/i });
  const ipoMarketCapCell = berkshireRow.locator("td").nth(7).locator("p").first();
  const ipoReturnMultiplierCell = berkshireRow.locator("td").nth(8).locator("p").first();
  const ipoAnnualizedGrowthRateCell = berkshireRow.locator("td").nth(9).locator("p").first();

  await expect(ipoMarketCapCell).toHaveText("—");
  await expect(ipoReturnMultiplierCell).toHaveText("—");
  await expect(ipoAnnualizedGrowthRateCell).toHaveText("—");
});
