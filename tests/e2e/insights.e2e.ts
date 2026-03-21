import { expect, test } from "@playwright/test";
import { gotoRoute } from "./support";

test("insights landing page renders the section overview and entry cards", async ({ page }) => {
  await gotoRoute(page, "/insights");

  await expect(page).toHaveURL(/\/insights\/?$/);
  await expect(
    page.getByRole("heading", { name: /Visual arguments for the slowly free future/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Post-bubble" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Capital release atlas" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Alternative pressure index" })).toBeVisible();
});

test("post-bubble page renders the comparison charts and company table", async ({ page }) => {
  await gotoRoute(page, "/insights/post-bubble");

  await expect(page).toHaveURL(/\/insights\/post-bubble\/?$/);
  await expect(
    page.getByRole("heading", { name: /How big is the business after the rent gets repriced\?/i }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Now, and after the unwind" })).toBeVisible();
  await expect(
    page.getByLabel(
      /Post-bubble comparison chart showing thesis-adjusted residual cap and current market cap on a log scale\./i,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(/At risk \$[0-9.,]+(?:T|B)? · -[0-9]+\.[0-9]%/).first(),
  ).toBeVisible();
  await expect(page.getByRole("table").getByText("NVIDIA", { exact: true })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "IPO cap" })).toBeVisible();
});

test("capital release atlas renders the moat map and ranked exposures", async ({ page }) => {
  await gotoRoute(page, "/insights/capital-at-risk");

  await expect(page).toHaveURL(/\/insights\/capital-at-risk\/?$/);
  await expect(
    page.getByRole("heading", { name: /Where the largest repricing arguments live/i }),
  ).toBeVisible();
  await expect(
    page.getByText(/Moat on the vertical, decentralizability on the horizontal/i),
  ).toBeVisible();
  await expect(page.getByText(/Who matters most if the rents compress\?/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Microsoft", exact: true }).first()).toBeVisible();
});

test("alternative pressure index renders company rankings and the product heatmap", async ({
  page,
}) => {
  await gotoRoute(page, "/insights/alternative-pressure");

  await expect(page).toHaveURL(/\/insights\/alternative-pressure\/?$/);
  await expect(
    page.getByRole("heading", { name: /Which products already have a real replacement story\?/i }),
  ).toBeVisible();
  await expect(page.getByText(/Product heatmap/i)).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Pressure" })).toBeVisible();
  await expect(page.getByRole("table").getByText("Microsoft 365", { exact: true })).toBeVisible();
});

test("disruption concepts page renders concept coverage and product rankings", async ({ page }) => {
  await gotoRoute(page, "/insights/disruption-concepts");

  await expect(page).toHaveURL(/\/insights\/disruption-concepts\/?$/);
  await expect(
    page.getByRole("heading", {
      name: /Which original concepts look most capable of breaking the lineup\?/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("32/32")).toBeVisible();
  await expect(page.getByText("Powerwall and Megapack", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Company rankings", { exact: true })).toBeVisible();
  await expect(page.getByText("Product rankings", { exact: true })).toBeVisible();
});
