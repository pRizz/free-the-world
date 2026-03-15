import { theme } from "~/lib/theme";

const publicationUrl = "https://peter.ryszkiewicz.us/";
const rawBasePath = import.meta.env.SERVER_BASE_URL || "/";
const normalizedBasePath = rawBasePath === "/" ? "/" : rawBasePath.replace(/\/$/, "");

export const siteConfig = {
  name: "Free The World",
  description:
    "A registry of companies whose moats look much less permanent once AI, open source, Bitcoin, and distributed manufacturing finish making overpriced software and services look faintly ridiculous.",
  shortDescription:
    "Tracking which large companies still charge heavily for things that are drifting toward free, open, and decentralized alternatives.",
  basePath: normalizedBasePath,
  accentName: theme.accentName,
  publicationUrl,
  substackEmbedUrl: `${publicationUrl}embed`,
  snapshotLabel: "Early-2026 public-source snapshot",
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
