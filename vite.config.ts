import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

const siteBasePath = process.env.SITE_BASE_PATH ?? "/";

export default defineConfig({
  base: siteBasePath,
  plugins: [
    solidStart(),
    tailwindcss(),
    nitro({ preset: "node-server" }),
  ],
});
