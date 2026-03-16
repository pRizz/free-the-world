export type DeployTarget = "aws" | "github-pages";
export type SiteAccessKind = "canonical" | "mirror" | "redirect";

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

export const deploymentConfig = {
  awsRegion: "us-east-1",
  bucketNamePrefix: "free-the-world-site",
  awsStackName: "free-the-world-site",
  awsDeployPolicyName: "free-the-world-github-deploy",
  awsDeployRoleName: "free-the-world-github-deploy",
  awsGithubOidcAudience: "sts.amazonaws.com",
  awsGithubOidcProviderUrl: "https://token.actions.githubusercontent.com",
  canonicalDomain: "free-the-world.com",
  canonicalOrigin: "https://free-the-world.com",
  githubApiVersion: "2022-11-28",
  githubPagesBasePath: "/free-the-world",
  githubPagesEnvironmentName: "github-pages",
  githubPagesOrigin: `https://${githubPagesOwner}.github.io`,
  githubProductionEnvironmentName: "production",
  githubRoleArnDigestVariableName: "AWS_DEPLOY_ROLE_ARN_SHA256",
  githubRoleArnSecretName: "AWS_DEPLOY_ROLE_ARN",
  githubWorkflowFileName: "deploy.yml",
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

export function getSiteAccessEntries(): SiteAccessEntry[] {
  const canonicalUrl = deployTargets.aws.publicOrigin;

  return [
    {
      label: deployTargets.aws.label,
      url: canonicalUrl,
      kind: "canonical",
      description: "Primary production host for the site. Search engines should index this host.",
      shouldIndex: deployTargets.aws.shouldIndex,
    },
    {
      label: deployTargets["github-pages"].label,
      url: deployTargets["github-pages"].publicOrigin,
      kind: "mirror",
      description:
        "Public mirror that serves the same site but stays noindexed and canonicalizes to the .com host.",
      shouldIndex: deployTargets["github-pages"].shouldIndex,
    },
    ...deploymentConfig.redirectDomains.map((domain) => ({
      label: `${domain} redirect`,
      url: `https://${domain}`,
      kind: "redirect" as const,
      description:
        "Alias domain that responds with a 301 redirect to the canonical .com host instead of serving independent content.",
      shouldIndex: false,
      redirectTarget: canonicalUrl,
    })),
  ];
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
