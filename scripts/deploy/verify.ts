import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  deploymentConfig,
  getCanonicalUrl,
  getHostedDomains,
  getPublicUrl,
} from "../../src/lib/deployment-config";
import { runCommand } from "../lib/command";
import { createDeployRun, writeDeploySummary } from "../lib/deploy-log";

interface VerificationHttpResponse {
  body: string;
  headers: Map<string, string>;
  ok: boolean;
  source: "curl-resolve" | "fetch";
  status: number;
  url: string;
}

const args = parseArgs(process.argv.slice(2));
const retries = Number(args.retries ?? "12");
const delayMs = Number(args["delay-ms"] ?? "5000");
const verificationResults = [];
const commandName = "deploy:verify";
const run = await createDeployRun({
  command: commandName,
  mode: "check",
  target: "verification",
});

await run.addBreadcrumb({
  data: { delayMs, retries },
  detail: "Starting production verification checks.",
  status: "info",
  step: "initialize",
});

const canonicalAboutUrl = getCanonicalUrl("/about");
const canonicalAboutResponse = await requestWithRetries(canonicalAboutUrl, retries, delayMs);
const canonicalAboutHtml = canonicalAboutResponse.body;

assert(canonicalAboutResponse.ok, `Expected ${canonicalAboutUrl} to return 200.`);
assert(
  canonicalAboutHtml.includes('rel="canonical" href="https://free-the-world.com/about"'),
  `Expected ${canonicalAboutUrl} to include a canonical link to https://free-the-world.com/about.`,
);

verificationResults.push({
  detail: `${canonicalAboutUrl} returned ${canonicalAboutResponse.status} via ${canonicalAboutResponse.source} and included the canonical URL.`,
  name: "canonical host",
  status: "passed" as const,
});
await run.addBreadcrumb({
  detail: `Verified canonical host response for ${canonicalAboutUrl}.`,
  status: "passed",
  step: "canonical host",
});

for (const redirectDomain of deploymentConfig.redirectDomains) {
  const redirectUrl = `https://${redirectDomain}/about?from=verify`;
  const response = await requestWithRetries(redirectUrl, retries, delayMs, "manual");
  const location = response.headers.get("location") ?? null;

  assert(response.status === 301, `Expected ${redirectUrl} to return a 301 redirect.`);
  assert(
    location === `${canonicalAboutUrl}?from=verify`,
    `Expected ${redirectUrl} to redirect to ${canonicalAboutUrl}?from=verify.`,
  );

  verificationResults.push({
    detail: `${redirectUrl} returned 301 via ${response.source} to ${location}.`,
    name: `redirect ${redirectDomain}`,
    status: "passed" as const,
  });
  await run.addBreadcrumb({
    detail: `Verified redirect ${redirectUrl} -> ${location}.`,
    status: "passed",
    step: "redirect",
  });
}

const pagesAboutUrl = getPublicUrl("github-pages", "/about");
const pagesAboutResponse = await requestWithRetries(pagesAboutUrl, retries, delayMs);
const pagesAboutHtml = pagesAboutResponse.body;

assert(pagesAboutResponse.ok, `Expected ${pagesAboutUrl} to return 200.`);
assert(
  pagesAboutHtml.includes('name="robots" content="noindex, nofollow"'),
  `Expected ${pagesAboutUrl} to include a noindex robots meta tag.`,
);
assert(
  pagesAboutHtml.includes('rel="canonical" href="https://free-the-world.com/about"'),
  `Expected ${pagesAboutUrl} to canonicalize to https://free-the-world.com/about.`,
);

verificationResults.push({
  detail: `${pagesAboutUrl} returned ${pagesAboutResponse.status} via ${pagesAboutResponse.source}, noindexed the mirror, and pointed at the canonical .com URL.`,
  name: "GitHub Pages mirror",
  status: "passed" as const,
});
await run.addBreadcrumb({
  detail: `Verified the GitHub Pages mirror at ${pagesAboutUrl}.`,
  status: "passed",
  step: "pages mirror",
});

const summary = {
  appliedChanges: [] as string[],
  artifactDir: undefined,
  artifactHash: undefined,
  command: commandName,
  discoveredRemoteState: {
    hostedDomains: getHostedDomains(),
  },
  mode: "check" as const,
  plannedChanges: {},
  resultingUrls: [deploymentConfig.canonicalOrigin, getPublicUrl("github-pages", "/")],
  skippedReasons: [] as string[],
  target: "verification",
  verificationResults,
};

const { runDirectory } = await writeDeploySummary(summary, { runDirectory: run.runDirectory });
console.log(`Deployment verification complete. Summary: ${runDirectory}`);

async function requestWithRetries(
  url: string,
  retries: number,
  delayMs: number,
  redirect: RequestRedirect = "follow",
) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { redirect });

      if (response.ok || redirect === "manual") {
        return {
          body: redirect === "manual" ? "" : await response.text(),
          headers: collectResponseHeaders(response.headers),
          ok: response.ok,
          source: "fetch" as const,
          status: response.status,
          url,
        } satisfies VerificationHttpResponse;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < retries) {
      await Bun.sleep(delayMs);
    }
  }

  const fallbackResponse = await requestWithResolvedCurl(url, redirect);
  if (fallbackResponse) {
    return fallbackResponse;
  }

  throw lastError ?? new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}

async function requestWithResolvedCurl(url: string, redirect: RequestRedirect) {
  const hostname = new URL(url).hostname;
  const hostedDomains = new Set<string>(getHostedDomains());
  if (!hostedDomains.has(hostname)) {
    return null;
  }

  const publicIpv4s = resolvePublicIpv4(hostname);
  for (const ipAddress of publicIpv4s) {
    const maybeResponse = await requestWithCurlResolve(url, redirect, ipAddress);
    if (maybeResponse) {
      return maybeResponse;
    }
  }

  return null;
}

async function requestWithCurlResolve(url: string, redirect: RequestRedirect, ipAddress: string) {
  const requestUrl = new URL(url);
  const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "free-the-world-verify-"));
  const headersPath = path.join(tempDirectory, "headers.txt");
  const bodyPath = path.join(tempDirectory, "body.txt");

  try {
    const args = [
      "--silent",
      "--show-error",
      "--output",
      bodyPath,
      "--dump-header",
      headersPath,
      "--write-out",
      "%{http_code}|%{url_effective}",
      "--resolve",
      `${requestUrl.hostname}:443:${ipAddress}`,
    ];

    if (redirect === "follow") {
      args.push("--location");
    } else {
      args.push("--max-redirs", "0");
    }

    args.push(url);

    const result = runCommand("curl", args, { allowFailure: true });
    if (result.status !== 0) {
      return null;
    }

    const [statusText, effectiveUrl = url] = result.stdout.trim().split("|");
    const status = Number(statusText);
    if (!Number.isFinite(status)) {
      return null;
    }

    const headerBlocks = (await readFile(headersPath, "utf8"))
      .trim()
      .split(/\r?\n\r?\n/)
      .filter(Boolean);
    const selectedHeaderBlock = headerBlocks.at(-1) ?? "";
    const body = redirect === "manual" ? "" : await readFile(bodyPath, "utf8");

    return {
      body,
      headers: parseCurlHeaders(selectedHeaderBlock),
      ok: status >= 200 && status < 300,
      source: "curl-resolve" as const,
      status,
      url: effectiveUrl,
    } satisfies VerificationHttpResponse;
  } finally {
    await rm(tempDirectory, { force: true, recursive: true });
  }
}

function resolvePublicIpv4(hostname: string) {
  const publicResolvers = ["1.1.1.1", "8.8.8.8"];
  const ipAddresses = new Set<string>();

  for (const resolver of publicResolvers) {
    const result = runCommand("dig", [`@${resolver}`, hostname, "A", "+short"], {
      allowFailure: true,
    });
    const parsedIpAddresses = result.stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^\d{1,3}(?:\.\d{1,3}){3}$/.test(line));

    for (const ipAddress of parsedIpAddresses) {
      ipAddresses.add(ipAddress);
    }
  }

  return Array.from(ipAddresses);
}

function collectResponseHeaders(headers: Headers) {
  const collectedHeaders = new Map<string, string>();

  headers.forEach((value, key) => {
    collectedHeaders.set(key.toLowerCase(), value);
  });

  return collectedHeaders;
}

function parseCurlHeaders(rawHeaders: string) {
  const collectedHeaders = new Map<string, string>();
  const lines = rawHeaders.split(/\r?\n/).filter(Boolean);

  for (const line of lines.slice(1)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim().toLowerCase();
    const value = line.slice(separatorIndex + 1).trim();
    collectedHeaders.set(key, value);
  }

  return collectedHeaders;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
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
