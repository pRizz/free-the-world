export type DeployTarget = "aws" | "github-pages";

export interface DeployTargetConfig {
  id: DeployTarget;
  label: string;
  basePath: string;
  publicOrigin: string;
  shouldIndex: boolean;
}

const githubPagesOwner = "prizz";
const githubPagesRepository = "free-the-world";

export const deploymentConfig = {
  awsRegion: "us-east-1",
  bucketNamePrefix: "free-the-world-site",
  awsStackName: "free-the-world-site",
  canonicalDomain: "free-the-world.com",
  canonicalOrigin: "https://free-the-world.com",
  githubPagesBasePath: "/free-the-world",
  githubPagesOrigin: `https://${githubPagesOwner}.github.io`,
  redirectDomains: ["free-the-world.us", "ftwfreetheworld.com", "ftwfreetheworld.us"],
  immutableCacheControl: "public, max-age=31536000, immutable",
  metadataCacheControl: "no-cache",
  htmlCacheControl: "no-cache, no-store, must-revalidate",
  mutableAssetCacheControl: "public, max-age=300",
} as const;

const githubPagesUrl = `${deploymentConfig.githubPagesOrigin}/${githubPagesRepository}`;

export const deployTargets: Record<DeployTarget, DeployTargetConfig> = {
  aws: {
    id: "aws",
    label: "AWS canonical site",
    basePath: "/",
    publicOrigin: deploymentConfig.canonicalOrigin,
    shouldIndex: true,
  },
  "github-pages": {
    id: "github-pages",
    label: "GitHub Pages mirror",
    basePath: deploymentConfig.githubPagesBasePath,
    publicOrigin: githubPagesUrl,
    shouldIndex: false,
  },
};

export function normalizeBasePath(input: string) {
  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/$/, "");
}

export function normalizeOrigin(input: string) {
  return input.replace(/\/$/, "");
}

export function normalizeRoutePath(input: string) {
  const withLeadingSlash = input.startsWith("/") ? input : `/${input}`;
  return withLeadingSlash === "/" ? "/" : withLeadingSlash.replace(/\/$/, "");
}

export function parseDeployTarget(input?: string): DeployTarget {
  return input === "github-pages" ? "github-pages" : "aws";
}

export function getDeployTargetConfig(target: DeployTarget) {
  return deployTargets[target];
}

export function getHostedDomains() {
  return [deploymentConfig.canonicalDomain, ...deploymentConfig.redirectDomains];
}

export function getCanonicalUrl(route: string) {
  return joinOriginAndRoute(deploymentConfig.canonicalOrigin, route);
}

export function getPublicUrl(target: DeployTarget, route: string) {
  return joinOriginAndRoute(getDeployTargetConfig(target).publicOrigin, route);
}

export function getRobotsMetaContent(target: DeployTarget, maybeNoIndex = false) {
  if (maybeNoIndex || !getDeployTargetConfig(target).shouldIndex) {
    return "noindex, nofollow";
  }

  return "index, follow";
}

export function getRobotsTxt(target: DeployTarget) {
  const directives = getDeployTargetConfig(target).shouldIndex ? ["Allow: /"] : ["Disallow: /"];

  return [
    "User-agent: *",
    ...directives,
    `Sitemap: ${getCanonicalUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
}

export function getExpectedAssetPrefix(target: DeployTarget) {
  const basePath = getDeployTargetConfig(target).basePath;
  return basePath === "/" ? "/_build/" : `${basePath}/_build/`;
}

export function getUnexpectedTargetPrefix(target: DeployTarget) {
  return target === "aws" ? `${deploymentConfig.githubPagesBasePath}/` : "/_build/";
}

export function joinOriginAndRoute(origin: string, route: string) {
  const normalizedOrigin = normalizeOrigin(origin);
  const normalizedRoute = normalizeRoutePath(route);

  return normalizedRoute === "/" ? `${normalizedOrigin}/` : `${normalizedOrigin}${normalizedRoute}`;
}
