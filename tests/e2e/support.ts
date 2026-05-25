import type { Page } from "@playwright/test";

const basePath = normalizeBasePath(process.env.SITE_BASE_PATH ?? "/");

export async function gotoRoute(page: Page, route: string) {
  await page.goto(withBasePath(route));
  await page.locator("#app[data-hydrated='true']").waitFor();
}

export function withBasePath(route: string) {
  const normalizedRoute = route === "/" ? "/" : route.startsWith("/") ? route : `/${route}`;

  if (basePath === "/") {
    return normalizedRoute;
  }

  if (normalizedRoute === "/") {
    return `${basePath}/`;
  }

  return `${basePath}${normalizedRoute}`;
}

function normalizeBasePath(input: string) {
  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/$/, "");
}
