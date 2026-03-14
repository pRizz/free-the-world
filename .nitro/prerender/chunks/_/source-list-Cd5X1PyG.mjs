import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { C as Card, S as SectionHeading } from '../virtual/entry.mjs';

var _tmpl$ = ["<div", ' class="space-y-4">', "</div>"], _tmpl$2 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div class="space-y-2"><a', ' target="_blank" rel="noreferrer" class="text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-accent)]">', '</a><p class="text-sm text-[var(--color-muted-foreground)]"><!--$-->', "<!--/--> \xB7 <!--$-->", '<!--/--></p><p class="text-sm leading-7 text-[var(--color-muted-foreground)]">', '</p></div><p class="shrink-0 text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Reviewed <!--$-->', "<!--/--></p></div></article>"];
function SourceList(props) {
  return createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Paper trail",
        get title() {
          var _a;
          return (_a = props.title) != null ? _a : "Visible evidence trail";
        },
        get description() {
          var _a;
          return (_a = props.description) != null ? _a : "These sources shaped the scoring and writing. The site is opinionated, but it should not behave like it is improvising facts in a dark room.";
        }
      }), ssr(_tmpl$, ssrHydrationKey(), escape(props.sources.map((source) => ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("href", escape(source.url, true), false), escape(source.title), escape(source.publisher), escape(source.kind.replaceAll("-", " ")), escape(source.note), escape(source.accessedOn)))))];
    }
  });
}

export { SourceList as S };
//# sourceMappingURL=source-list-Cd5X1PyG.mjs.map
