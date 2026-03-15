import type { Page } from "@playwright/test";

const basePath = normalizeBasePath(process.env.SITE_BASE_PATH ?? "/");

export function gotoRoute(page: Page, route: string) {
  const normalizedRoute = route === "/" ? "/" : route.startsWith("/") ? route : `/${route}`;

  if (basePath === "/") {
    return page.goto(normalizedRoute);
  }

  if (normalizedRoute === "/") {
    return page.goto(`${basePath}/`);
  }

  return page.goto(`${basePath}${normalizedRoute}`);
}

function normalizeBasePath(input: string) {
  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/$/, "");
}
