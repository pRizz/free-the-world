import { expect, test } from "@playwright/test";

test("home page renders shell and hero content", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: "Free The World" }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Price the moat honestly\. Then imagine what happens when more of the world becomes free\./i,
    })
  ).toBeVisible();
});

test("about page renders the main explainer heading", async ({ page }) => {
  await page.goto("/about");

  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole("heading", { name: /A registry for the slowly free future/i })).toBeVisible();
});

test("methodology page renders the methodology heading", async ({ page }) => {
  await page.goto("/methodology");

  await expect(page).toHaveURL(/\/methodology\/?$/);
  await expect(page.getByRole("heading", { name: /How the scores are produced/i })).toBeVisible();
});
