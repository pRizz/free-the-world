import {
  deploymentConfig,
  getDeployTargetConfig,
  getRobotsMetaContent,
  normalizeBasePath,
  parseDeployTarget,
} from "~/lib/deployment-config";
import { theme } from "~/lib/theme";

export interface SiteBuildInfo {
  commitSha: string;
  commitTimestamp: string;
  commitTimestampLabel: string;
  commitUrl: string;
}

const publicationUrl = "https://peter.ryszkiewicz.us/";
const repositoryUrl = "https://github.com/pRizz/free-the-world";
const deployTarget = parseDeployTarget(import.meta.env.VITE_SITE_DEPLOY_TARGET);
const rawBasePath = import.meta.env.SERVER_BASE_URL || getDeployTargetConfig(deployTarget).basePath;
const normalizedBasePath = normalizeBasePath(rawBasePath);
const buildInfo = readSiteBuildInfo();
const publicOrigin =
  import.meta.env.VITE_SITE_PUBLIC_ORIGIN || getDeployTargetConfig(deployTarget).publicOrigin;

export const siteConfig = {
  name: "Free The World",
  description:
    "A registry of companies whose moats look much less permanent once AI, open source, Bitcoin, and distributed manufacturing finish making overpriced software and services look faintly ridiculous.",
  shortDescription:
    "Tracking which large companies still charge heavily for things that are drifting toward free, open, and decentralized alternatives.",
  basePath: normalizedBasePath,
  publicOrigin,
  canonicalOrigin: deploymentConfig.primaryCanonicalOrigin,
  deployTarget,
  robotsMetaContent: getRobotsMetaContent(deployTarget),
  shouldIndex: getDeployTargetConfig(deployTarget).shouldIndex,
  accentName: theme.accentName,
  publicationUrl,
  substackEmbedUrl: `${publicationUrl}embed`,
  repository: {
    url: repositoryUrl,
    labels: {
      compact: "Open source on GitHub",
      cta: "Inspect or contribute on GitHub",
    },
  },
  snapshotLabel: "Early-2026 public-source snapshot",
  buildInfo,
} as const;

export function withBasePath(route: string) {
  const normalizedRoute = route === "/" ? "/" : route.startsWith("/") ? route : `/${route}`;

  if (siteConfig.basePath === "/") {
    return normalizedRoute;
  }

  if (normalizedRoute === "/") {
    return `${siteConfig.basePath}/`;
  }

  return `${siteConfig.basePath}${normalizedRoute}`;
}

function readSiteBuildInfo(): SiteBuildInfo | null {
  const commitSha = normalizeBuildInfoValue(import.meta.env.VITE_SITE_GIT_COMMIT_SHA);
  const commitTimestamp = normalizeBuildInfoValue(import.meta.env.VITE_SITE_GIT_COMMIT_TIMESTAMP);
  const commitTimestampLabel = normalizeBuildInfoValue(
    import.meta.env.VITE_SITE_GIT_COMMIT_TIMESTAMP_LABEL,
  );
  const commitUrl = normalizeBuildInfoValue(import.meta.env.VITE_SITE_GIT_COMMIT_URL);

  if (!commitSha || !commitTimestamp || !commitTimestampLabel || !commitUrl) {
    return null;
  }

  return {
    commitSha,
    commitTimestamp,
    commitTimestampLabel,
    commitUrl,
  };
}

function normalizeBuildInfoValue(value: string | undefined) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}
