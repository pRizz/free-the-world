export type DeployTarget = "aws" | "github-pages";
export type SiteAccessKind = "canonical" | "live" | "mirror" | "redirect";

export interface DeployTargetConfig {
  id: DeployTarget;
  label: string;
  basePath: string;
  publicOrigin: string;
  shouldIndex: boolean;
}

export interface SiteAccessEntry {
  label: string;
  url: string;
  kind: SiteAccessKind;
  description: string;
  shouldIndex: boolean;
  redirectTarget?: string;
}

const githubPagesOwner = "prizz";
const githubPagesRepository = "free-the-world";
const primaryCanonicalDomain = "freetheworld.ai";
const secondaryLiveDomains = ["free-the-world.com"] as const;
const redirectDomains = [
  "www.freetheworld.ai",
  "free-the-world.us",
  "ftwfreetheworld.com",
  "ftwfreetheworld.us",
] as const;

export const deploymentConfig = {
  awsRegion: "us-east-1",
  bucketNamePrefix: "free-the-world-site",
  awsStackName: "free-the-world-site",
  awsDeployPolicyName: "free-the-world-github-deploy",
  awsDeployRoleName: "free-the-world-github-deploy",
  awsGithubOidcAudience: "sts.amazonaws.com",
  awsGithubOidcProviderUrl: "https://token.actions.githubusercontent.com",
  primaryCanonicalDomain,
  primaryCanonicalOrigin: `https://${primaryCanonicalDomain}`,
  secondaryLiveDomains,
  redirectDomains,
  githubApiVersion: "2022-11-28",
  githubPagesBasePath: "/free-the-world",
  githubPagesEnvironmentName: "github-pages",
  githubPagesOrigin: `https://${githubPagesOwner}.github.io`,
  githubProductionEnvironmentName: "production",
  githubRoleArnDigestVariableName: "AWS_DEPLOY_ROLE_ARN_SHA256",
  githubRoleArnSecretName: "AWS_DEPLOY_ROLE_ARN",
  githubWorkflowFileName: "deploy.yml",
  immutableCacheControl: "public, max-age=31536000, immutable",
  metadataCacheControl: "no-cache",
  htmlCacheControl: "no-cache, no-store, must-revalidate",
  mutableAssetCacheControl: "public, max-age=300",
} as const;

const githubPagesUrl = `${deploymentConfig.githubPagesOrigin}/${githubPagesRepository}`;

export const deployTargets: Record<DeployTarget, DeployTargetConfig> = {
  aws: {
    id: "aws",
    label: "AWS primary site",
    basePath: "/",
    publicOrigin: deploymentConfig.primaryCanonicalOrigin,
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

export function getPrimaryCanonicalOrigin() {
  return deploymentConfig.primaryCanonicalOrigin;
}

export function getOriginForDomain(domain: string) {
  return `https://${domain}`;
}

export function getAwsContentDomains() {
  return [deploymentConfig.primaryCanonicalDomain, ...deploymentConfig.secondaryLiveDomains];
}

export function getAwsRedirectDomains() {
  return [...deploymentConfig.redirectDomains];
}

export function getHostedDomains() {
  return [...getAwsContentDomains(), ...getAwsRedirectDomains()];
}

export function getSiteAccessEntries(): SiteAccessEntry[] {
  const canonicalUrl = getPrimaryCanonicalOrigin();
  const secondaryLiveEntries = deploymentConfig.secondaryLiveDomains.map((domain) => ({
    label: "Secondary live host (.com)",
    url: getOriginForDomain(domain),
    kind: "live" as const,
    description:
      "Serves the same production site from AWS but emits canonical metadata that points to the primary .ai host.",
    shouldIndex: true,
  }));

  return [
    {
      label: "Primary canonical site",
      url: canonicalUrl,
      kind: "canonical",
      description:
        "Primary production host for the site. Search engines should treat this host as canonical.",
      shouldIndex: true,
    },
    ...secondaryLiveEntries,
    {
      label: deployTargets["github-pages"].label,
      url: deployTargets["github-pages"].publicOrigin,
      kind: "mirror",
      description:
        "Public mirror that serves the same site but stays noindexed and canonicalizes to the .ai host.",
      shouldIndex: deployTargets["github-pages"].shouldIndex,
    },
    ...deploymentConfig.redirectDomains.map((domain) => ({
      label: `${domain} redirect`,
      url: getOriginForDomain(domain),
      kind: "redirect" as const,
      description:
        "Alias domain that responds with a 301 redirect to the primary .ai host instead of serving independent content.",
      shouldIndex: false,
      redirectTarget: canonicalUrl,
    })),
  ];
}

export function getCanonicalUrl(route: string) {
  return joinOriginAndRoute(deploymentConfig.primaryCanonicalOrigin, route);
}

export function getPublicUrl(target: DeployTarget, route: string) {
  return joinOriginAndRoute(getDeployTargetConfig(target).publicOrigin, route);
}

export function getUrlForDomain(domain: string, route: string) {
  return joinOriginAndRoute(getOriginForDomain(domain), route);
}

export function getRobotsMetaContent(target: DeployTarget, maybeNoIndex = false) {
  if (maybeNoIndex || !getDeployTargetConfig(target).shouldIndex) {
    return "noindex, nofollow";
  }

  return "index, follow";
}

export function getRobotsTxt(target: DeployTarget) {
  const directives = getDeployTargetConfig(target).shouldIndex ? ["Allow: /"] : ["Disallow: /"];

  return ["User-agent: *", ...directives, `Sitemap: ${getCanonicalUrl("/sitemap.xml")}`, ""].join(
    "\n",
  );
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
