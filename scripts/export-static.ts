import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { companies } from "../src/lib/content/companies";
import { products } from "../src/lib/content/products";

const entryServerModulePath = "../dist/server/entry-server.js";
const { default: entryServer } = (await import(entryServerModulePath)) as {
  default: { fetch(request: Request): Promise<Response> };
};

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = path.join(rootDir, ".output", "public");
const basePath = normalizeBasePath(process.env.SITE_BASE_PATH ?? "/");

const staticRoutes = [
  "/",
  "/about",
  "/methodology",
  "/companies",
  ...companies.flatMap(company => [
    `/companies/${company.slug}`,
    `/companies/${company.slug}/products`,
  ]),
  ...products.map(product => `/companies/${product.companySlug}/products/${product.slug}`),
];

await Promise.all(staticRoutes.map(renderRoute));
await renderNotFoundPage();
await writeFile(path.join(outputDir, ".nojekyll"), "");

console.log(`Exported ${staticRoutes.length + 1} static HTML files to ${outputDir}`);

async function renderRoute(route: string) {
  const requestUrl = new URL(withBasePath(route), "https://free-the-world.local");
  const response = await entryServer.fetch(new Request(requestUrl));
  const html = applySiteBasePath(await response.text());
  const outputFile = route === "/" ? path.join(outputDir, "index.html") : path.join(outputDir, route, "index.html");

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, html, "utf8");
}

async function renderNotFoundPage() {
  const requestUrl = new URL(withBasePath("/404"), "https://free-the-world.local");
  const response = await entryServer.fetch(new Request(requestUrl));
  const html = applySiteBasePath(await response.text());

  await writeFile(path.join(outputDir, "404.html"), html, "utf8");
}

function normalizeBasePath(input: string) {
  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/$/, "");
}

function withBasePath(route: string) {
  if (basePath === "/") {
    return route;
  }

  if (route === "/") {
    return `${basePath}/`;
  }

  return `${basePath}${route}`;
}

function applySiteBasePath(html: string) {
  if (basePath === "/") {
    return html;
  }

  return html
    .replaceAll('href="/_build/', `href="${basePath}/_build/`)
    .replaceAll('src="/_build/', `src="${basePath}/_build/`)
    .replaceAll('href="/favicon.ico"', `href="${basePath}/favicon.ico"`)
    .replaceAll('src="/favicon.ico"', `src="${basePath}/favicon.ico"`);
}
