import { expect, test } from "@playwright/test";
import { gotoRoute } from "./support";

async function expectNoPageLevelHorizontalOverflow(page: Parameters<typeof test>[0]["page"]) {
  const maybeHasOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth;
  });

  expect(maybeHasOverflow).toBe(false);
}

test("insights landing page stacks cleanly on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/insights");

  await expect(
    page.getByRole("heading", { name: /Visual arguments for the slowly free future/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the post-bubble view/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the atlas/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the pressure index/i })).toBeVisible();
  await expectNoPageLevelHorizontalOverflow(page);
});

test("post-bubble page shows mobile cards instead of the desktop table", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/insights/post-bubble");

  await expect(
    page.getByText(/On mobile, the main story is presented as ranked cards first/i),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "NVIDIA", exact: true })).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expectNoPageLevelHorizontalOverflow(page);
});

test("capital release atlas shows ranked mobile cards without the quadrant chart", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/insights/capital-at-risk");

  await expect(
    page.getByText(/On phones, the key reading is the ranked exposure list below/i),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Microsoft", exact: true }).first()).toBeVisible();
  await expect(page.getByLabel(/Quadrant chart plotting company moat/i)).toHaveCount(0);
  await expectNoPageLevelHorizontalOverflow(page);
});

test("alternative pressure page shows product cards instead of the heatmap table", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoRoute(page, "/insights/alternative-pressure");

  await expect(page.getByRole("heading", { name: "Microsoft 365", exact: true })).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await expect(page.getByText(/Documented pressure|Research gap/i).first()).toBeVisible();
  await expectNoPageLevelHorizontalOverflow(page);
});
