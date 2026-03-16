import { expect, test } from "@playwright/test";
import { gotoRoute } from "./support";

test("company detail page renders the Apple overview", async ({ page }) => {
  await gotoRoute(page, "/companies/apple");

  await expect(page).toHaveURL(/\/companies\/apple\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: "Apple" })).toBeVisible();
  await expect(page.getByText("AAPL", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Product analyses" })).toBeVisible();
});

test("product detail page renders the product thesis and alternatives section", async ({
  page,
}) => {
  await gotoRoute(page, "/companies/apple/products/apple-icloud");

  await expect(page).toHaveURL(/\/companies\/apple\/products\/apple-icloud\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: "iCloud" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Replacement landscape" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Back to Apple products", exact: true }),
  ).toBeVisible();
});
