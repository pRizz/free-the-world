import { access, copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve(".output/public");
const nestedNotFoundFile = path.join(outputDir, "404", "index.html");
const rootNotFoundFile = path.join(outputDir, "404.html");
const noJekyllFile = path.join(outputDir, ".nojekyll");

await mkdir(outputDir, { recursive: true });
await writeFile(noJekyllFile, "", "utf8");

try {
  await access(nestedNotFoundFile);
  await copyFile(nestedNotFoundFile, rootNotFoundFile);
} catch {
  // Static builds that already emit /404.html do not need the fallback copy.
}
