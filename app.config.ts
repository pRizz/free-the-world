import path from "node:path";
import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { deploymentConfig, getDeployTargetConfig, normalizeBasePath, parseDeployTarget } from "./src/lib/deployment-config";
import { staticRoutes } from "./src/lib/site-routes";

const deployTarget = parseDeployTarget(process.env.SITE_DEPLOY_TARGET);
const targetConfig = getDeployTargetConfig(deployTarget);
const siteBasePath = normalizeBasePath(process.env.SITE_BASE_PATH ?? targetConfig.basePath);
const serverBasePath = siteBasePath === "/" ? undefined : siteBasePath;
const sourceMapShimPath = path.resolve("./src/shims/source-map-js.ts");

process.env.VITE_SITE_DEPLOY_TARGET ??= deployTarget;
process.env.VITE_SITE_CANONICAL_ORIGIN ??= deploymentConfig.canonicalOrigin;
process.env.VITE_SITE_PUBLIC_ORIGIN ??= targetConfig.publicOrigin;

export default defineConfig({
  server: {
    baseURL: serverBasePath,
    preset: "static",
    prerender: {
      crawlLinks: false,
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
