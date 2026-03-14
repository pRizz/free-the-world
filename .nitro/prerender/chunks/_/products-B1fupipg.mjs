import { createComponent, ssr, ssrHydrationKey, escape } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { u as useParams, C as Card, S as SectionHeading, T as Title, B as Badge, A } from '../virtual/entry.mjs';
import { b as CompanyProductsPanel } from './company-panels-DCSwvL1f.mjs';
import { S as SourceList } from './source-list-Cd5X1PyG.mjs';
import { g as getProductsForCompany, a as getSourcesByIds, c as getCompanyBySlug } from './selectors-CTNmzqQM.mjs';
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

var _tmpl$ = ["<div", ' class="space-y-8"><section class="space-y-4"><div class="flex flex-wrap gap-2"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="space-y-3"><h1 class="text-4xl font-semibold tracking-tight sm:text-5xl"><!--$-->', '<!--/--> product analyses</h1><p class="max-w-4xl text-base leading-8 text-[var(--color-muted-foreground)] sm:text-lg">A tighter look at the products that matter most to <!--$-->', "<!--/-->, along with the free, open, decentralized, or cooperative alternatives already creating pricing pressure.</p></div></section><!--$-->", "<!--/--><!--$-->", '<!--/--><div class="text-sm text-[var(--color-muted-foreground)]">', "</div></div>"];
const id$$ = "src/routes/companies/[companySlug]/products.tsx?pick=default&pick=$css";
function CompanyProductsPage() {
  const params = useParams();
  const company = () => getCompanyBySlug(params.companySlug);
  if (!company()) {
    return createComponent(Card, {
      "class": "space-y-4",
      get children() {
        return createComponent(SectionHeading, {
          title: "Company not found",
          description: "The requested company slug does not exist in the current registry snapshot."
        });
      }
    });
  }
  const companyData = company();
  const productRecords = getProductsForCompany(companyData.slug);
  const sources = getSourcesByIds(companyData.sourceIds);
  return [createComponent(Title, {
    get children() {
      return [companyData.name, " products \xB7 Free The World"];
    }
  }), ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Badge, {
    tone: "accent",
    children: "Products"
  })), escape(createComponent(Badge, {
    tone: "muted",
    get children() {
      return companyData.name;
    }
  })), escape(companyData.name), escape(companyData.name), escape(createComponent(CompanyProductsPanel, {
    company: companyData,
    products: productRecords
  })), escape(createComponent(SourceList, {
    title: "Company-level source stack",
    sources
  })), escape(createComponent(A, {
    get href() {
      return `/companies/${companyData.slug}`;
    },
    "class": "hover:text-[var(--color-accent)]",
    get children() {
      return ["\u2190 Back to ", companyData.name];
    }
  })))];
}

export { CompanyProductsPage as default, id$$ };
//# sourceMappingURL=products-B1fupipg.mjs.map
