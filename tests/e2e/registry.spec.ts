import { expect, test } from "@playwright/test";

test("registry search filters the company table", async ({ page }) => {
  await page.goto("/companies");

  await expect(page).toHaveURL(/\/companies\/?$/);
  await expect(page.getByRole("heading", { name: /Top 10 S&P 500 companies/i })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("10 companies shown");

  await page.getByLabel("Search companies").fill("Microsoft");

  await expect(page.getByRole("status")).toHaveText("1 companies shown");

  const microsoftRow = page.getByRole("row", { name: /Microsoft/i });
  await expect(microsoftRow).toBeVisible();
  await expect(microsoftRow.getByRole("link", { name: "Microsoft" })).toBeVisible();
  await expect(microsoftRow.getByRole("link", { name: "Details" })).toBeVisible();
  await expect(page.getByRole("row", { name: /Apple/i })).toHaveCount(0);
});
