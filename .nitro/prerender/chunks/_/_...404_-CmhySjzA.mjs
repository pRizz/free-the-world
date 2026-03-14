import { createComponent, ssr, ssrHydrationKey, escape } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { C as Card, S as SectionHeading, A } from '../virtual/entry.mjs';
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

var _tmpl$ = ["<div", ' class="flex flex-wrap gap-4 text-sm text-[var(--color-muted-foreground)]"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"];
const id$$ = "src/routes/[...404].tsx?pick=default&pick=$css";
function NotFound() {
  return createComponent(Card, {
    "class": "space-y-4",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "404",
        title: "That page does not exist",
        description: "The route you requested is not part of the current static snapshot. The future may be decentralized, but this URL is still unfortunately absent."
      }), ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(A, {
        href: "/",
        "class": "hover:text-[var(--color-accent)]",
        children: "Home"
      })), escape(createComponent(A, {
        href: "/companies",
        "class": "hover:text-[var(--color-accent)]",
        children: "Registry"
      })), escape(createComponent(A, {
        href: "/methodology",
        "class": "hover:text-[var(--color-accent)]",
        children: "Methodology"
      })))];
    }
  });
}

export { NotFound as default, id$$ };
//# sourceMappingURL=_...404_-CmhySjzA.mjs.map
