import { expect, test } from "bun:test";
import {
  getCanonicalUrl,
  getPublicUrl,
  getRobotsMetaContent,
  getRobotsTxt,
  getSiteAccessEntries,
} from "../../../src/lib/deployment-config";

test("canonical urls always point at the production .com host", () => {
  expect(getCanonicalUrl("/")).toBe("https://free-the-world.com/");
  expect(getCanonicalUrl("/about")).toBe("https://free-the-world.com/about");
});

test("github pages public urls include the repository base path", () => {
  expect(getPublicUrl("github-pages", "/")).toBe("https://prizz.github.io/free-the-world/");
  expect(getPublicUrl("github-pages", "/companies")).toBe(
    "https://prizz.github.io/free-the-world/companies",
  );
});

test("robots helpers distinguish the indexable canonical site from the mirror", () => {
  expect(getRobotsTxt("aws")).toContain("Allow: /");
  expect(getRobotsTxt("github-pages")).toContain("Disallow: /");
  expect(getRobotsMetaContent("aws")).toBe("index, follow");
  expect(getRobotsMetaContent("github-pages")).toBe("noindex, nofollow");
});

test("site access entries list the canonical host, mirror, and redirects in UI order", () => {
  const entries = getSiteAccessEntries();
  const redirectEntries = entries.filter((entry) => entry.kind === "redirect");

  expect(entries[0]).toEqual({
    description: "Primary production host for the site. Search engines should index this host.",
    kind: "canonical",
    label: "AWS canonical site",
    shouldIndex: true,
    url: "https://free-the-world.com",
  });
  expect(entries[1]).toEqual({
    description:
      "Public mirror that serves the same site but stays noindexed and canonicalizes to the .com host.",
    kind: "mirror",
    label: "GitHub Pages mirror",
    shouldIndex: false,
    url: "https://prizz.github.io/free-the-world",
  });
  expect(redirectEntries).toHaveLength(3);
  expect(redirectEntries.map((entry) => entry.url)).toEqual([
    "https://free-the-world.us",
    "https://ftwfreetheworld.com",
    "https://ftwfreetheworld.us",
  ]);
  expect(
    redirectEntries.every((entry) => entry.redirectTarget === "https://free-the-world.com"),
  ).toBe(true);
  expect(redirectEntries.every((entry) => entry.shouldIndex === false)).toBe(true);
});
