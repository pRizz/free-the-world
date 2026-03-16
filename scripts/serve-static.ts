import { createReadStream } from "node:fs";
import { access, readFile, stat } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const port = Number(args.port ?? "4173");
const publicDir = path.resolve(".output/public");
const basePath = normalizeBasePath(process.env.SITE_BASE_PATH ?? "/");

const server = createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
  const maybeRelativePath = stripBasePath(requestUrl.pathname);

  if (!maybeRelativePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const maybeFile = await resolvePublicFile(maybeRelativePath);
  if (!maybeFile) {
    await writeNotFound(response);
    return;
  }

  response.writeHead(200, { "Content-Type": getContentType(maybeFile) });
  createReadStream(maybeFile).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${publicDir} at http://127.0.0.1:${port} (base path: ${basePath})`);
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}

async function resolvePublicFile(relativePath: string) {
  const normalizedRelativePath = relativePath === "/" ? "/index.html" : relativePath;
  const directFile = ensureInsidePublicDir(path.resolve(publicDir, `.${normalizedRelativePath}`));
  if (!directFile) {
    return null;
  }

  if (await isFile(directFile)) {
    return directFile;
  }

  const maybeDirectoryIndex = ensureInsidePublicDir(path.resolve(publicDir, `.${normalizedRelativePath}`, "index.html"));
  if (maybeDirectoryIndex && (await isFile(maybeDirectoryIndex))) {
    return maybeDirectoryIndex;
  }

  if (!path.extname(directFile)) {
    const maybeHtmlFile = ensureInsidePublicDir(path.resolve(publicDir, `.${normalizedRelativePath}.html`));
    if (maybeHtmlFile && (await isFile(maybeHtmlFile))) {
      return maybeHtmlFile;
    }
  }

  return null;
}

function stripBasePath(pathname: string) {
  if (basePath === "/") {
    return pathname;
  }

  if (pathname === basePath) {
    return "/";
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }

  return pathname;
}

function ensureInsidePublicDir(candidatePath: string) {
  const relativePath = path.relative(publicDir, candidatePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return candidatePath;
}

async function isFile(filePath: string) {
  try {
    const fileStat = await stat(filePath);
    return fileStat.isFile();
  } catch {
    return false;
  }
}

async function writeNotFound(response: ServerResponse) {
  const notFoundFile = path.join(publicDir, "404.html");

  try {
    await access(notFoundFile);
    const html = await readFile(notFoundFile);
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(html);
    return;
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

function parseArgs(rawArgs: string[]) {
  return rawArgs.reduce<Record<string, string>>((accumulator, currentArg) => {
    if (!currentArg.startsWith("--")) {
      return accumulator;
    }

    const [key, value = "true"] = currentArg.slice(2).split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
}

function normalizeBasePath(input: string) {
  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/$/, "");
}

function getContentType(filePath: string) {
  switch (path.extname(filePath)) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".ico":
      return "image/x-icon";
    case ".js":
    case ".mjs":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".map":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".webp":
      return "image/webp";
    case ".xml":
      return "application/xml; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}
