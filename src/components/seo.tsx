import { Link, Meta, Title } from "@solidjs/meta";
import { siteConfig } from "~/lib/config";
import { getCanonicalUrl } from "~/lib/deployment-config";

interface SeoProps {
  title: string;
  description: string;
  route: string;
  maybeNoIndex?: boolean;
}

export function Seo(props: SeoProps) {
  const canonicalUrl = getCanonicalUrl(props.route);
  const robotsContent = props.maybeNoIndex ? "noindex, nofollow" : siteConfig.robotsMetaContent;

  return (
    <>
      <Title>{props.title}</Title>
      <Meta name="description" content={props.description} />
      <Meta name="robots" content={robotsContent} />
      <Meta property="og:site_name" content={siteConfig.name} />
      <Meta property="og:type" content="website" />
      <Meta property="og:title" content={props.title} />
      <Meta property="og:description" content={props.description} />
      <Meta property="og:url" content={canonicalUrl} />
      <Link rel="canonical" href={canonicalUrl} />
    </>
  );
}
