import path from "node:path";
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { companies, products } from "./src/lib/generated/content-graph";

const siteBasePath = process.env.SITE_BASE_PATH ?? "/";
const serverBasePath = siteBasePath === "/" ? undefined : siteBasePath;
const sourceMapShimPath = path.resolve("./src/shims/source-map-js.ts");

const staticRoutes = Array.from(
  new Set([
    "/",
    "/404",
    "/about",
    "/companies",
    "/methodology",
    ...companies.flatMap(company => [`/companies/${company.slug}`, `/companies/${company.slug}/products`]),
    ...products.map(product => `/companies/${product.companySlug}/products/${product.slug}`),
  ])
);

export default defineConfig({
  server: {
    baseURL: serverBasePath,
    preset: "static",
    prerender: {
      routes: staticRoutes,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: [
        {
          find: /^source-map-js$/,
          replacement: sourceMapShimPath,
        },
      ],
    },
  },
});
