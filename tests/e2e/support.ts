import type { Page } from "@playwright/test";

const basePath = normalizeBasePath(process.env.SITE_BASE_PATH ?? "/");

export function gotoRoute(page: Page, route: string) {
  return page.goto(withBasePath(route));
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
