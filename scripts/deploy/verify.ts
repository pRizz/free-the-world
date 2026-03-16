import { createDeployRun, writeDeploySummary } from "../lib/deploy-log";
import { deploymentConfig, getCanonicalUrl, getHostedDomains, getPublicUrl } from "../../src/lib/deployment-config";

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
const canonicalAboutResponse = await fetchWithRetries(canonicalAboutUrl, retries, delayMs);
const canonicalAboutHtml = await canonicalAboutResponse.text();

assert(canonicalAboutResponse.ok, `Expected ${canonicalAboutUrl} to return 200.`);
assert(
  canonicalAboutHtml.includes('rel="canonical" href="https://free-the-world.com/about"'),
  `Expected ${canonicalAboutUrl} to include a canonical link to https://free-the-world.com/about.`
);

verificationResults.push({
  detail: `${canonicalAboutUrl} returned ${canonicalAboutResponse.status} and included the canonical URL.`,
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
  const response = await fetchWithRetries(redirectUrl, retries, delayMs, "manual");
  const location = response.headers.get("location");

  assert(response.status === 301, `Expected ${redirectUrl} to return a 301 redirect.`);
  assert(location === `${canonicalAboutUrl}?from=verify`, `Expected ${redirectUrl} to redirect to ${canonicalAboutUrl}?from=verify.`);

  verificationResults.push({
    detail: `${redirectUrl} returned 301 to ${location}.`,
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
const pagesAboutResponse = await fetchWithRetries(pagesAboutUrl, retries, delayMs);
const pagesAboutHtml = await pagesAboutResponse.text();

assert(pagesAboutResponse.ok, `Expected ${pagesAboutUrl} to return 200.`);
assert(
  pagesAboutHtml.includes('name="robots" content="noindex, nofollow"'),
  `Expected ${pagesAboutUrl} to include a noindex robots meta tag.`
);
assert(
  pagesAboutHtml.includes('rel="canonical" href="https://free-the-world.com/about"'),
  `Expected ${pagesAboutUrl} to canonicalize to https://free-the-world.com/about.`
);

verificationResults.push({
  detail: `${pagesAboutUrl} returned ${pagesAboutResponse.status}, noindexed the mirror, and pointed at the canonical .com URL.`,
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

async function fetchWithRetries(url: string, retries: number, delayMs: number, redirect: RequestRedirect = "follow") {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { redirect });

      if (response.ok || redirect === "manual") {
        return response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }

    if (attempt < retries) {
      await Bun.sleep(delayMs);
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url} after ${retries} attempts.`);
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
