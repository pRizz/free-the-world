import { createComponent, ssr, ssrHydrationKey, escape } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { u as useParams, C as Card, S as SectionHeading, a as Button, T as Title, B as Badge, A } from '../virtual/entry.mjs';
import { C as CompanyMetadataPanel, a as CompanyMetricsPanel, b as CompanyProductsPanel, T as TechnologyWavePanel } from './company-panels-DCSwvL1f.mjs';
import { S as SourceList } from './source-list-Cd5X1PyG.mjs';
import { g as getProductsForCompany, a as getSourcesByIds, b as getTechnologyWavesByIds, c as getCompanyBySlug } from './selectors-CTNmzqQM.mjs';
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
import './formatters-Ckoru01L.mjs';
import './technology-waves-DCxT8MAr.mjs';

var _tmpl$ = ["<div", ' class="space-y-6"><!--$-->', '<!--/--><div class="grid gap-5 lg:grid-cols-2"><article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"><h3 class="text-lg font-medium">Moat reading</h3><div class="mt-3 prose-block">', '</div></article><article class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"><h3 class="text-lg font-medium">Decentralization reading</h3><div class="mt-3 prose-block">', "</div></article></div></div>"], _tmpl$2 = ["<div", ' class="space-y-8"><section class="space-y-4"><div class="flex flex-wrap gap-2"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="space-y-4"><h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">', '</h1><p class="max-w-4xl text-base leading-8 text-[var(--color-muted-foreground)] sm:text-lg">', '</p></div><div class="flex flex-wrap gap-3"><!--$-->', "<!--/--><!--$-->", '<!--/--></div></section><section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"><!--$-->', "<!--/--><!--$-->", "<!--/--></section><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div class="text-sm text-[var(--color-muted-foreground)]">', "</div></div>"], _tmpl$3 = ["<article", ' class="space-y-3 prose-block"><h2 class="text-2xl font-semibold tracking-tight">', "</h2><!--$-->", "<!--/--></article>"], _tmpl$4 = ["<p", ">", "</p>"];
const id$$ = "src/routes/companies/[companySlug].tsx?pick=default&pick=$css";
function CompanyPage() {
  const params = useParams();
  const company = () => getCompanyBySlug(params.companySlug);
  if (!company()) {
    return createComponent(Card, {
      "class": "space-y-4",
      get children() {
        return [createComponent(SectionHeading, {
          title: "Company not found",
          description: "The requested company slug does not exist in the current registry snapshot."
        }), createComponent(Button, {
          as: "a",
          href: "/companies",
          variant: "secondary",
          children: "Back to registry"
        })];
      }
    });
  }
  const companyData = company();
  const relatedProducts = getProductsForCompany(companyData.slug);
  const companySources = getSourcesByIds(companyData.sourceIds);
  const waves = getTechnologyWavesByIds(companyData.technologyWaveIds);
  return [createComponent(Title, {
    get children() {
      return [companyData.name, " \xB7 Free The World"];
    }
  }), ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(Badge, {
    tone: "accent",
    get children() {
      return companyData.ticker;
    }
  })), escape(createComponent(Badge, {
    tone: "muted",
    get children() {
      return companyData.snapshotNote;
    }
  })), escape(companyData.name), escape(companyData.description), escape(createComponent(Button, {
    as: "a",
    get href() {
      return companyData.companiesMarketCapUrl;
    },
    target: "_blank",
    rel: "noreferrer",
    variant: "secondary",
    children: "CompaniesMarketCap"
  })), escape(createComponent(Button, {
    as: "a",
    get href() {
      return `/companies/${companyData.slug}/products`;
    },
    children: "Product analyses"
  })), escape(createComponent(CompanyMetadataPanel, {
    company: companyData
  })), escape(createComponent(CompanyMetricsPanel, {
    company: companyData
  })), escape(createComponent(Card, {
    "class": "space-y-6",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Narrative",
        title: "Why the company matters",
        description: "A short editorial overview plus the current thesis on moat strength and decentralization pressure."
      }), ssr(_tmpl$, ssrHydrationKey(), escape(companyData.overview.map((section) => ssr(_tmpl$3, ssrHydrationKey(), escape(section.title), escape(section.paragraphs.map((paragraph) => ssr(_tmpl$4, ssrHydrationKey(), escape(paragraph))))))), escape(companyData.moatNarrative.map((paragraph) => ssr(_tmpl$4, ssrHydrationKey(), escape(paragraph)))), escape(companyData.decentralizationNarrative.map((paragraph) => ssr(_tmpl$4, ssrHydrationKey(), escape(paragraph)))))];
    }
  })), escape(createComponent(CompanyProductsPanel, {
    company: companyData,
    products: relatedProducts
  })), escape(createComponent(TechnologyWavePanel, {
    waves
  })), escape(createComponent(SourceList, {
    sources: companySources
  })), escape(createComponent(A, {
    href: "/companies",
    "class": "hover:text-[var(--color-accent)]",
    children: "\u2190 Back to registry"
  })))];
}

export { CompanyPage as default, id$$ };
//# sourceMappingURL=_companySlug_-C_3cvCXR.mjs.map
