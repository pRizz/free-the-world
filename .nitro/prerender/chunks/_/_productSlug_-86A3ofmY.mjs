import { createComponent, ssr, ssrHydrationKey, escape } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { u as useParams, C as Card, S as SectionHeading, T as Title, B as Badge, A } from '../virtual/entry.mjs';
import { P as ProductOverviewPanel, A as AlternativeTable, T as TechnologyWavePanel, S as SourceSummaryCard } from './company-panels-DCSwvL1f.mjs';
import { f as getAlternativesForProduct, a as getSourcesByIds, b as getTechnologyWavesByIds, c as getCompanyBySlug, h as getProductBySlug } from './selectors-CTNmzqQM.mjs';
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

var _tmpl$ = ["<div", ' class="space-y-8"><section class="space-y-4"><div class="flex flex-wrap gap-2"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="space-y-3"><h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">', '</h1><p class="max-w-4xl text-base leading-8 text-[var(--color-muted-foreground)] sm:text-lg">The question here is simple: which parts of this product are genuinely hard, and which parts are mostly a very profitable coordination habit?</p></div></section><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--><div class="text-sm text-[var(--color-muted-foreground)]">', "</div></div>"];
const id$$ = "src/routes/companies/[companySlug]/products/[productSlug].tsx?pick=default&pick=$css";
function ProductPage() {
  const params = useParams();
  const company = () => getCompanyBySlug(params.companySlug);
  const product = () => getProductBySlug(params.productSlug);
  if (!company() || !product() || product().companySlug !== company().slug) {
    return createComponent(Card, {
      "class": "space-y-4",
      get children() {
        return createComponent(SectionHeading, {
          title: "Product not found",
          description: "The requested company or product slug does not exist in the current registry snapshot."
        });
      }
    });
  }
  const companyData = company();
  const productData = product();
  const productAlternatives = getAlternativesForProduct(productData.slug);
  const productSources = getSourcesByIds(productData.sourceIds);
  const waveData = getTechnologyWavesByIds(productData.technologyWaveIds);
  return [createComponent(Title, {
    get children() {
      return [productData.name, " \xB7 ", companyData.name, " \xB7 Free The World"];
    }
  }), ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Badge, {
    tone: "accent",
    get children() {
      return companyData.name;
    }
  })), escape(createComponent(Badge, {
    tone: "muted",
    get children() {
      return productData.category;
    }
  })), escape(productData.name), escape(createComponent(ProductOverviewPanel, {
    product: productData,
    company: companyData
  })), escape(createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Alternatives",
        title: "Replacement landscape",
        description: "These alternatives are not always drop-in replacements. They do, however, show where the incumbent's pricing power starts facing open pressure."
      }), createComponent(AlternativeTable, {
        alternatives: productAlternatives
      })];
    }
  })), escape(createComponent(TechnologyWavePanel, {
    waves: waveData
  })), escape(createComponent(SourceSummaryCard, {
    title: "Product research sources",
    sources: productSources
  })), escape(createComponent(A, {
    get href() {
      return `/companies/${companyData.slug}/products`;
    },
    "class": "hover:text-[var(--color-accent)]",
    get children() {
      return ["\u2190 Back to ", companyData.name, " products"];
    }
  })))];
}

export { ProductPage as default, id$$ };
//# sourceMappingURL=_productSlug_-86A3ofmY.mjs.map
