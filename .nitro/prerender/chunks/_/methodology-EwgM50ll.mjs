import { createComponent, ssr, ssrHydrationKey, escape } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { T as Title, S as SectionHeading, C as Card } from '../virtual/entry.mjs';
import { c as companyMetricDefinitions } from './metrics-Dua0ydrl.mjs';
import { m as methodologyPrinciples } from './site-D0PhltbB.mjs';
import { t as technologyWaves } from './technology-waves-DCxT8MAr.mjs';
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

var _tmpl$ = ["<h2", ' class="text-2xl font-semibold tracking-tight">Core principles</h2>'], _tmpl$2 = ["<div", ' class="space-y-3">', "</div>"], _tmpl$3 = ["<h2", ' class="text-2xl font-semibold tracking-tight">Metric definitions</h2>'], _tmpl$4 = ["<div", ' class="grid gap-4 lg:grid-cols-2">', "</div>"], _tmpl$5 = ["<h2", ' class="text-2xl font-semibold tracking-tight">Technology-wave assumptions</h2>'], _tmpl$6 = ["<p", ` class="text-sm leading-7 text-[var(--color-muted-foreground)]">These are the repo's declared biases. They prevent the writing from quietly smuggling in a static-world worldview while pretending to evaluate decentralization objectively.</p>`], _tmpl$7 = ["<div", ' class="space-y-4">', "</div>"], _tmpl$8 = ["<div", ' class="space-y-8"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$9 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</article>"], _tmpl$0 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><p class="text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">', '</p><h3 class="mt-2 text-lg font-medium">', '</h3><p class="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</p></article>"], _tmpl$1 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><h3 class="text-lg font-medium">', '</h3><p class="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]">', '</p><ul class="mt-3 space-y-2 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</ul></article>"], _tmpl$10 = ["<li", ">\u2022 <!--$-->", "<!--/--></li>"];
const id$$ = "src/routes/methodology.tsx?pick=default&pick=$css";
function MethodologyPage() {
  return [createComponent(Title, {
    children: "Methodology \xB7 Free The World"
  }), ssr(_tmpl$8, ssrHydrationKey(), escape(createComponent(SectionHeading, {
    eyebrow: "Methodology",
    title: "How the scores are produced",
    description: "The registry mixes structured research, directional valuation context, and a deliberately explicit technology thesis. The goal is not sterile objectivity. The goal is auditable judgment."
  })), escape(createComponent(Card, {
    "class": "space-y-4",
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey()), ssr(_tmpl$2, ssrHydrationKey(), escape(methodologyPrinciples.map((principle) => ssr(_tmpl$9, ssrHydrationKey(), escape(principle)))))];
    }
  })), escape(createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [ssr(_tmpl$3, ssrHydrationKey()), ssr(_tmpl$4, ssrHydrationKey(), escape(Object.values(companyMetricDefinitions).map((metric) => ssr(_tmpl$0, ssrHydrationKey(), escape(metric.shortLabel), escape(metric.label), escape(metric.description)))))];
    }
  })), escape(createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [ssr(_tmpl$5, ssrHydrationKey()), ssr(_tmpl$6, ssrHydrationKey()), ssr(_tmpl$7, ssrHydrationKey(), escape(technologyWaves.map((wave) => ssr(_tmpl$1, ssrHydrationKey(), escape(wave.label), escape(wave.summary), escape(wave.implications.map((implication) => ssr(_tmpl$10, ssrHydrationKey(), escape(implication))))))))];
    }
  })))];
}

export { MethodologyPage as default, id$$ };
//# sourceMappingURL=methodology-EwgM50ll.mjs.map
