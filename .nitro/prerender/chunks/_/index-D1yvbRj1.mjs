import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { T as Title, C as Card, B as Badge, a as Button, S as SectionHeading, A, s as siteConfig } from '../virtual/entry.mjs';
import { c as companies, f as formatCompanyMetric } from './formatters-Ckoru01L.mjs';
import { l as landingHighlights, m as methodologyPrinciples } from './site-D0PhltbB.mjs';
import 'file:///workspace/node_modules/h3/dist/_entries/node.mjs';
import 'file:///workspace/node_modules/solid-js/dist/server.js';
import 'file:///workspace/node_modules/pathe/dist/index.mjs';
import 'file:///workspace/node_modules/radix3/dist/index.mjs';
import 'file:///workspace/node_modules/seroval/dist/esm/production/index.mjs';
import 'file:///workspace/node_modules/seroval-plugins/dist/esm/production/web.mjs';
import 'file:///workspace/node_modules/clsx/dist/clsx.mjs';
import 'file:///workspace/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///workspace/node_modules/class-variance-authority/dist/index.mjs';
import 'file:///workspace/node_modules/solid-js/web/storage/dist/storage.js';
import 'file:///workspace/node_modules/cookie-es/dist/index.mjs';
import './metrics-Dua0ydrl.mjs';

const newsletterContent = {
  eyebrow: "Stay in the loop",
  title: "Get dispatches when the rent-seeking starts to crack.",
  description: "The newsletter follows the same thesis as the registry: track where incumbents still charge heavily for services that are drifting toward open, automated, and decentralized abundance.",
  publicationUrl: siteConfig.publicationUrl,
  embedUrl: siteConfig.substackEmbedUrl
};
var _tmpl$$1 = ["<div", ' class="space-y-4"><!--$-->', `<!--/--><div class="space-y-3 text-sm leading-7 text-[var(--color-muted-foreground)]"><p>The embed is intentionally simple for v1 because Substack's native iframe does not offer much styling control. That felt preferable to pretending a bespoke funnel is somehow the urgent bottleneck here.</p><p>If the embed ever becomes too rigid, the integration is isolated so the signup flow can be replaced without rebuilding the site around it.</p></div><!--$-->`, "<!--/--></div>"], _tmpl$2$1 = ["<div", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3 shadow-inner shadow-black/10"><iframe', ' title="Free The World newsletter signup" class="min-h-[320px] w-full rounded-xl border border-white/10 bg-white"></iframe></div>'];
function NewsletterSignup() {
  return createComponent(Card, {
    "class": "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]",
    get children() {
      return [ssr(_tmpl$$1, ssrHydrationKey(), escape(createComponent(SectionHeading, {
        get eyebrow() {
          return newsletterContent.eyebrow;
        },
        get title() {
          return newsletterContent.title;
        },
        get description() {
          return newsletterContent.description;
        }
      })), escape(createComponent(Button, {
        as: "a",
        get href() {
          return newsletterContent.publicationUrl;
        },
        target: "_blank",
        rel: "noreferrer",
        variant: "secondary",
        children: "Open publication in a new tab"
      }))), ssr(_tmpl$2$1, ssrHydrationKey(), ssrAttribute("src", escape(newsletterContent.embedUrl, true), false))];
    }
  });
}
var _tmpl$ = ["<div", ' class="space-y-4"><!--$-->', '<!--/--><div class="space-y-4"><h1 class="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">Price the moat honestly. Then imagine what happens when more of the world becomes free.</h1><p class="max-w-3xl text-base leading-8 text-[var(--color-muted-foreground)] sm:text-lg">Free The World is a research-driven registry of major public companies and the products they still monetize as if AI, open source, Bitcoin-native coordination, and distributed manufacturing were optional side quests instead of the main plot.</p></div></div>'], _tmpl$2 = ["<div", ' class="grid gap-3 sm:grid-cols-3">', "</div>"], _tmpl$3 = ["<div", ' class="flex flex-wrap gap-3"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$4 = ["<div", ' class="space-y-4"><article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><p class="text-xs uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">Most decentralizable large-cap in the launch set</p><p class="mt-2 text-xl font-semibold">', '</p><p class="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]"><!--$-->', "<!--/--> \u2014 <!--$-->", '<!--/--></p></article><article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><p class="text-xs uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">Largest implied capital release opportunity</p><p class="mt-2 text-xl font-semibold">', '</p><p class="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]"><!--$-->', "<!--/--> \u2014 <!--$-->", "<!--/--></p></article></div>"], _tmpl$5 = ["<div", ' class="space-y-4 prose-block"><p>AI keeps compressing expertise. Open source keeps compressing software margins. Bitcoin and Lightning offer payment and anti-spam primitives that make more permissionless systems viable. Distributed manufacturing keeps moving the minimum useful factory closer to local, automated, and weirdly compact.</p><p>The result is not that every incumbent disappears. It is that a growing share of incumbents should expect to defend prices that become less philosophically persuasive and less economically durable.</p></div>'], _tmpl$6 = ["<div", ' class="space-y-3">', "</div>"], _tmpl$7 = ["<div", ' class="space-y-10"><section class="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><!--$-->', "<!--/--><!--$-->", '<!--/--></section><section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><!--$-->', "<!--/--><!--$-->", "<!--/--></section><!--$-->", '<!--/--><section class="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"><div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div class="space-y-3"><!--$-->', '<!--/--><h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">If a trillion-dollar company is mostly monetizing convenience and inertia, that is still a moat. It is just not necessarily an eternal one.</h2></div><!--$-->', "<!--/--></div></section></div>"], _tmpl$8 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</article>"];
const id$$ = "src/routes/index.tsx?pick=default&pick=$css";
function Home() {
  const mostDecentralizable = [...companies].sort((left, right) => right.metrics.decentralizability.value - left.metrics.decentralizability.value)[0];
  const mostCapitalAtRisk = [...companies].sort((left, right) => right.metrics.freedCapitalPotential.value - left.metrics.freedCapitalPotential.value)[0];
  return [createComponent(Title, {
    children: "Free The World"
  }), ssr(_tmpl$7, ssrHydrationKey(), escape(createComponent(Card, {
    "class": "space-y-6",
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Badge, {
        tone: "accent",
        children: "Top 10 S&P 500 snapshot"
      }))), ssr(_tmpl$2, ssrHydrationKey(), escape(landingHighlights.map((highlight) => ssr(_tmpl$8, ssrHydrationKey(), escape(highlight))))), ssr(_tmpl$3, ssrHydrationKey(), escape(createComponent(Button, {
        as: "a",
        href: "/companies",
        children: "Explore the registry"
      })), escape(createComponent(Button, {
        as: "a",
        href: "/methodology",
        variant: "secondary",
        children: "Read the methodology"
      })))];
    }
  })), escape(createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Snapshot highlights",
        title: "A few early signals",
        description: "The point is not to predict a single date when incumbents lose. The point is to notice which categories are already becoming harder to justify at current prices."
      }), ssr(_tmpl$4, ssrHydrationKey(), escape(mostDecentralizable.name), escape(formatCompanyMetric("decentralizability", mostDecentralizable.metrics.decentralizability)), escape(mostDecentralizable.metrics.decentralizability.rationale), escape(mostCapitalAtRisk.name), escape(formatCompanyMetric("freedCapitalPotential", mostCapitalAtRisk.metrics.freedCapitalPotential)), escape(mostCapitalAtRisk.metrics.freedCapitalPotential.rationale))];
    }
  })), escape(createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Motivation",
        title: "The thesis in one page",
        description: "Many digital products still charge like scarcity is real. Many physical products still charge like production must remain giant, centralized, and slow. Both assumptions are under pressure."
      }), ssr(_tmpl$5, ssrHydrationKey())];
    }
  })), escape(createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Operating rules",
        title: "How the registry thinks",
        description: "The methodology is explicit so readers can audit the assumptions instead of pretending a clean table appeared from the heavens."
      }), ssr(_tmpl$6, ssrHydrationKey(), escape(methodologyPrinciples.map((principle) => ssr(_tmpl$8, ssrHydrationKey(), escape(principle)))))];
    }
  })), escape(createComponent(NewsletterSignup, {})), escape(createComponent(Badge, {
    tone: "muted",
    children: "Professional with a light satirical aftertaste"
  })), escape(createComponent(A, {
    href: "/companies",
    "class": "text-sm font-medium text-[var(--color-accent)] hover:underline",
    children: "Go to the company registry \u2192"
  })))];
}

export { Home as default, id$$ };
//# sourceMappingURL=index-D1yvbRj1.mjs.map
