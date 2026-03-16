import { expect, test } from "@playwright/test";
import { gotoRoute } from "./support";

test("home page renders shell and hero content", async ({ page }) => {
  await gotoRoute(page, "/");

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
  await gotoRoute(page, "/about");

  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole("heading", { name: /A registry for the slowly free future/i })).toBeVisible();
});

test("methodology page renders the methodology heading", async ({ page }) => {
  await gotoRoute(page, "/methodology");

  await expect(page).toHaveURL(/\/methodology\/?$/);
  await expect(page.getByRole("heading", { name: /How the scores are produced/i })).toBeVisible();
});

test("mirrors page renders the configured hosts and tor notice", async ({ page }) => {
  await gotoRoute(page, "/mirrors");

  await expect(page).toHaveURL(/\/mirrors\/?$/);
  await expect(page.getByRole("heading", { name: /Where Free The World is currently reachable/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "GitHub Pages mirror" })).toBeVisible();
  await expect(page.getByText(/Tor-based mirrors are coming soon/i)).toBeVisible();
});

test("mobile shell stays compact and expands navigation on demand", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/");

  const banner = page.getByRole("banner");
  const mobileToggle = banner.getByRole("button", { name: "Toggle navigation menu" });
  const mobileNav = page.getByRole("navigation", { name: "Mobile menu", includeHidden: true });

  await expect(banner).toBeVisible();
  await expect(mobileToggle).toBeVisible();
  await expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
  await expect(mobileNav).toBeHidden();
  await expect(page.getByText(/A running ledger of corporate moats/i)).toHaveCount(0);

  const headerHeight = await banner.evaluate(element => element.getBoundingClientRect().height);
  expect(headerHeight).toBeLessThan(110);

  await mobileToggle.click();

  await expect(mobileToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Mobile menu" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile menu" }).getByRole("link", { name: "Home" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile menu" }).getByRole("link", { name: "Registry" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile menu" }).getByRole("link", { name: "Mirrors" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile menu" }).getByRole("link", { name: "Methodology" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile menu" }).getByRole("link", { name: "About" })).toBeVisible();
  await expect(banner.getByRole("link", { name: "Newsletter on Substack" })).toBeVisible();
});

test("mobile menu closes after route navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/");

  const banner = page.getByRole("banner");
  const mobileToggle = banner.getByRole("button", { name: "Toggle navigation menu" });

  await mobileToggle.click();
  await page.getByRole("navigation", { name: "Mobile menu" }).getByRole("link", { name: "About" }).click();

  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole("heading", { name: /A registry for the slowly free future/i })).toBeVisible();
  await expect(page.getByRole("banner").getByRole("button", { name: "Toggle navigation menu" })).toHaveAttribute(
    "aria-expanded",
    "false"
  );
  await expect(page.getByRole("navigation", { name: "Mobile menu", includeHidden: true })).toBeHidden();
});

test("desktop shell keeps inline navigation and hides the mobile toggle", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await gotoRoute(page, "/");

  const banner = page.getByRole("banner");

  await expect(banner.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(banner.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Mirrors" })).toBeVisible();
  await expect(banner.getByRole("link", { name: "Newsletter on Substack" })).toBeVisible();
  await expect(banner.getByRole("button", { name: "Toggle navigation menu", includeHidden: true })).toBeHidden();
});
