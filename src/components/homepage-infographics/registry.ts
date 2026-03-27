import { AlternativePressurePreview } from "~/components/homepage-infographics/alternative-pressure-preview";
import { CapitalAtRiskPreview } from "~/components/homepage-infographics/capital-at-risk-preview";
import { DisruptionConceptsPreview } from "~/components/homepage-infographics/disruption-concepts-preview";
import { MarketCapDisruptionPreview } from "~/components/homepage-infographics/market-cap-disruption-preview";
import { PostBubblePreview } from "~/components/homepage-infographics/post-bubble-preview";
import type { HomepageInfographicDefinition } from "~/components/homepage-infographics/types";

export const homepageInfographics = [
  {
    id: "market-cap-disruption",
    eyebrow: "Rotating infographic · Market-cap disruption",
    title: "How much of the analyzed S&P 500 sample looks repricable?",
    description:
      "The front-page pie chart combines the latest committed market caps with the site's current disruption-share model, so the homepage can show the scale of the thesis before readers open the deeper views.",
    href: "/insights/market-cap-disruption",
    ctaLabel: "Open the market-cap view",
    component: MarketCapDisruptionPreview,
  },
  {
    id: "capital-at-risk",
    eyebrow: "Rotating infographic · Capital release atlas",
    title: "Which moats look strongest right before they start getting weird?",
    description:
      "A moat-versus-decentralizability map makes the core thesis visible in one screen: defensibility and open attack surface can coexist for a long time, right up until they stop doing so profitably.",
    href: "/insights/capital-at-risk",
    ctaLabel: "Open the atlas",
    component: CapitalAtRiskPreview,
  },
  {
    id: "post-bubble",
    eyebrow: "Rotating infographic · Post-bubble",
    title: "How much of the current value looks durable after the repricing starts?",
    description:
      "This preview compares current market caps with thesis-adjusted residual value so the homepage can show not just that pressure exists, but how much of the present valuation may depend on rents that look increasingly negotiable.",
    href: "/insights/post-bubble",
    ctaLabel: "Open the repricing view",
    component: PostBubblePreview,
  },
  {
    id: "alternative-pressure",
    eyebrow: "Rotating infographic · Alternative pressure",
    title: "Which incumbents already have substitutes that look annoyingly viable?",
    description:
      "Pressure scores stay grounded in current substitutes by emphasizing deployability and cost leverage, not just whether the alternative has a pleasing moral aura.",
    href: "/insights/alternative-pressure",
    ctaLabel: "Open the pressure index",
    component: AlternativePressurePreview,
  },
  {
    id: "disruption-concepts",
    eyebrow: "Rotating infographic · Concept index",
    title: "Where do the original attack vectors look most buildable?",
    description:
      "The concept stack tracks the registry's own product ideas so the homepage can surface not only existing alternatives, but also the most credible openings for new ones.",
    href: "/insights/disruption-concepts",
    ctaLabel: "Open the concept index",
    component: DisruptionConceptsPreview,
  },
] satisfies HomepageInfographicDefinition[];

export const defaultHomepageInfographicId = homepageInfographics[0]?.id ?? null;
export const homepageInfographicIds = homepageInfographics.map((infographic) => infographic.id);
