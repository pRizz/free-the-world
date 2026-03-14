import { createComponent, ssr, ssrHydrationKey, escape } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { T as Title, S as SectionHeading, C as Card } from '../virtual/entry.mjs';
import { a as aboutSections } from './site-D0PhltbB.mjs';
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

var _tmpl$ = ["<div", ' class="space-y-8"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"], _tmpl$2 = ["<h2", ' class="text-2xl font-semibold tracking-tight">', "</h2>"], _tmpl$3 = ["<div", ' class="prose-block">', "</div>"], _tmpl$4 = ["<p", ">", "</p>"];
const id$$ = "src/routes/about.tsx?pick=default&pick=$css";
function About() {
  return [createComponent(Title, {
    children: "About \xB7 Free The World"
  }), ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(SectionHeading, {
    eyebrow: "About",
    title: "A registry for the slowly free future",
    description: "Free The World is opinionated research, not a worship service for incumbents or a promise that every protocol immediately wins. The goal is to study where the pricing power looks more fragile than consensus admits."
  })), escape(aboutSections.map((section) => createComponent(Card, {
    "class": "space-y-4",
    get children() {
      return [ssr(_tmpl$2, ssrHydrationKey(), escape(section.title)), ssr(_tmpl$3, ssrHydrationKey(), escape(section.paragraphs.map((paragraph) => ssr(_tmpl$4, ssrHydrationKey(), escape(paragraph)))))];
    }
  }))))];
}

export { About as default, id$$ };
//# sourceMappingURL=about-BsZsniKD.mjs.map
