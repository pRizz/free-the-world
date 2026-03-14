import { siteConfig } from "~/lib/config";

export const newsletterContent = {
  eyebrow: "Stay in the loop",
  title: "Get dispatches when the rent-seeking starts to crack.",
  description:
    "The newsletter follows the same thesis as the registry: track where incumbents still charge heavily for services that are drifting toward open, automated, and decentralized abundance.",
  publicationUrl: siteConfig.publicationUrl,
  embedUrl: siteConfig.substackEmbedUrl,
} as const;
