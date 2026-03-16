import { expect, test } from "bun:test";
import { getCanonicalUrl, getPublicUrl, getRobotsMetaContent, getRobotsTxt } from "../../../src/lib/deployment-config";

test("canonical urls always point at the production .com host", () => {
  expect(getCanonicalUrl("/")).toBe("https://free-the-world.com/");
  expect(getCanonicalUrl("/about")).toBe("https://free-the-world.com/about");
});

test("github pages public urls include the repository base path", () => {
  expect(getPublicUrl("github-pages", "/")).toBe("https://prizz.github.io/free-the-world/");
  expect(getPublicUrl("github-pages", "/companies")).toBe("https://prizz.github.io/free-the-world/companies");
});

test("robots helpers distinguish the indexable canonical site from the mirror", () => {
  expect(getRobotsTxt("aws")).toContain("Allow: /");
  expect(getRobotsTxt("github-pages")).toContain("Disallow: /");
  expect(getRobotsMetaContent("aws")).toBe("index, follow");
  expect(getRobotsMetaContent("github-pages")).toBe("noindex, nofollow");
});
