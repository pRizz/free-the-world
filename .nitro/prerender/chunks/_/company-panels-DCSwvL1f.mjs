import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { For } from 'file:///workspace/node_modules/solid-js/dist/server.js';
import { c as companyMetricDefinitions } from './metrics-Dua0ydrl.mjs';
import { f as formatCompanyMetric, a as formatAlternativeMetric } from './formatters-Ckoru01L.mjs';
import { C as Card, S as SectionHeading, A, a as Button, B as Badge, c as Table } from '../virtual/entry.mjs';
import { d as getSectorLabel, e as getIndustryLabel, j as getRegionLabel, k as getIndexLabels } from './selectors-CTNmzqQM.mjs';

var _tmpl$ = ["<dl", ' class="grid gap-4 sm:grid-cols-2"><div><dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Ticker</dt><dd class="mt-2 text-base font-medium">', '</dd></div><div><dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Rank snapshot</dt><dd class="mt-2 text-base font-medium">\u2248 <!--$-->', '<!--/--></dd></div><div><dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Sector</dt><dd class="mt-2 text-base font-medium">', '</dd></div><div><dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Industry</dt><dd class="mt-2 text-base font-medium">', '</dd></div><div><dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Region</dt><dd class="mt-2 text-base font-medium">', '</dd></div><div><dt class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Index</dt><dd class="mt-2 text-base font-medium">', "</dd></div></dl>"], _tmpl$2 = ["<div", ' class="metric-grid">', "</div>"], _tmpl$3 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><p class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">', '</p><p class="mt-2 text-2xl font-semibold">', '</p><p class="mt-3 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</p></article>"], _tmpl$4 = ["<div", ' class="space-y-4">', "</div>"], _tmpl$5 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"><div class="space-y-2"><!--$-->', '<!--/--><p class="text-sm uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]">', '</p><p class="max-w-3xl text-sm leading-7 text-[var(--color-muted-foreground)]">', "</p></div><!--$-->", "<!--/--></div></article>"], _tmpl$6 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><div class="space-y-3"><div class="flex flex-wrap gap-2">', '</div><p class="text-sm leading-7 text-[var(--color-muted-foreground)]">', '</p><ul class="space-y-2 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</ul></div></article>"], _tmpl$7 = ["<li", ">\u2022 <!--$-->", "<!--/--></li>"], _tmpl$8 = ["<thead", ' class="bg-[var(--color-surface-elevated)] text-xs uppercase tracking-[0.22em] text-[var(--color-muted-foreground)]"><tr><th class="px-4 py-4 font-medium">Alternative</th><th class="px-4 py-4 font-medium">Type</th><th class="px-4 py-4 font-medium">Open</th><th class="px-4 py-4 font-medium">Decent.</th><th class="px-4 py-4 font-medium">Ready</th><th class="px-4 py-4 font-medium">Cost</th><th class="px-4 py-4 font-medium">Links</th></tr></thead>'], _tmpl$9 = ["<tbody", ">", "</tbody>"], _tmpl$0 = ["<tr", ' class="border-t border-[var(--color-border)] align-top"><td class="space-y-2 px-4 py-4"><p class="font-semibold">', '</p><p class="max-w-sm text-sm leading-7 text-[var(--color-muted-foreground)]">', '</p></td><td class="px-4 py-4 text-sm text-[var(--color-muted-foreground)]">', '</td><td class="px-4 py-4 text-sm">', '</td><td class="px-4 py-4 text-sm">', '</td><td class="px-4 py-4 text-sm">', '</td><td class="px-4 py-4 text-sm">', '</td><td class="px-4 py-4 text-sm"><div class="flex flex-col gap-2"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></td></tr>"], _tmpl$1 = ["<a", ' target="_blank" rel="noreferrer" class="hover:text-[var(--color-accent)]">Homepage</a>'], _tmpl$10 = ["<a", ' target="_blank" rel="noreferrer" class="hover:text-[var(--color-accent)]">Repository</a>'], _tmpl$11 = ["<div", ' class="space-y-4 prose-block"><p>', '</p><div><p class="text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Replacement sketch</p><ul class="mt-3 space-y-2 text-sm leading-7 text-[var(--color-muted-foreground)]">', '</ul></div><div class="flex flex-wrap gap-3"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$12 = ["<div", ' class="space-y-3">', "</div>"], _tmpl$13 = ["<article", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><a', ' target="_blank" rel="noreferrer" class="font-medium hover:text-[var(--color-accent)]">', '</a><p class="mt-2 text-sm leading-7 text-[var(--color-muted-foreground)]">', "</p></article>"];
function CompanyMetadataPanel(props) {
  return createComponent(Card, {
    "class": "space-y-4",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Metadata",
        title: "Where this company sits"
      }), ssr(_tmpl$, ssrHydrationKey(), escape(props.company.ticker), escape(props.company.rankApprox), escape(getSectorLabel(props.company.sectorId)), escape(getIndustryLabel(props.company.industryId)), escape(getRegionLabel(props.company.regionId)), escape(getIndexLabels(props.company.indexIds).join(", ")))];
    }
  });
}
function CompanyMetricsPanel(props) {
  return createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Metrics",
        title: "Scoring view",
        description: "Every metric is paired with a short rationale. The numbers are deliberate, not divine."
      }), ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return Object.entries(props.company.metrics);
        },
        children: ([metricId, assessment]) => ssr(_tmpl$3, ssrHydrationKey(), escape(companyMetricDefinitions[metricId].label), escape(formatCompanyMetric(metricId, assessment)), escape(assessment.rationale))
      })))];
    }
  });
}
function CompanyProductsPanel(props) {
  return createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Products",
        title: "Where the moat actually touches users",
        description: "These pages zoom into the products and services that matter most to each company and the alternatives already nibbling at them."
      }), ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.products;
        },
        children: (product) => ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(A, {
          get href() {
            return `/companies/${props.company.slug}/products/${product.slug}`;
          },
          "class": "text-lg font-medium hover:text-[var(--color-accent)]",
          get children() {
            return product.name;
          }
        })), escape(product.category), escape(product.summary), escape(createComponent(Button, {
          as: "a",
          get href() {
            return `/companies/${props.company.slug}/products/${product.slug}`;
          },
          variant: "secondary",
          children: "Open analysis"
        })))
      })))];
    }
  });
}
function TechnologyWavePanel(props) {
  return createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Technology waves",
        title: "Strategic lenses",
        description: "These are the repo's explicit bias terms: the technologies expected to keep making incumbents less inevitable over time."
      }), ssr(_tmpl$4, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.waves;
        },
        children: (wave) => ssr(_tmpl$6, ssrHydrationKey(), escape(createComponent(Badge, {
          tone: "accent",
          get children() {
            return wave.label;
          }
        })), escape(wave.summary), escape(createComponent(For, {
          get each() {
            return wave.implications;
          },
          children: (implication) => ssr(_tmpl$7, ssrHydrationKey(), escape(implication))
        })))
      })))];
    }
  });
}
function AlternativeTable(props) {
  return createComponent(Table, {
    get children() {
      return [ssr(_tmpl$8, ssrHydrationKey()), ssr(_tmpl$9, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.alternatives;
        },
        children: (alternative) => ssr(_tmpl$0, ssrHydrationKey(), escape(alternative.name), escape(alternative.summary), escape(alternative.kind), escape(formatAlternativeMetric("openness", alternative.metrics.openness)), escape(formatAlternativeMetric("decentralizationFit", alternative.metrics.decentralizationFit)), escape(formatAlternativeMetric("readiness", alternative.metrics.readiness)), escape(formatAlternativeMetric("costLeverage", alternative.metrics.costLeverage)), alternative.homepageUrl ? ssr(_tmpl$1, ssrHydrationKey() + ssrAttribute("href", escape(alternative.homepageUrl, true), false)) : escape(null), alternative.repoUrl ? ssr(_tmpl$10, ssrHydrationKey() + ssrAttribute("href", escape(alternative.repoUrl, true), false)) : escape(null))
      })))];
    }
  });
}
function ProductOverviewPanel(props) {
  return createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [createComponent(SectionHeading, {
        get eyebrow() {
          return props.product.category;
        },
        get title() {
          return props.product.name;
        },
        get description() {
          return props.product.summary;
        }
      }), ssr(_tmpl$11, ssrHydrationKey(), escape(props.product.whyItMatters), escape(createComponent(For, {
        get each() {
          return props.product.replacementSketch;
        },
        children: (paragraph) => ssr(_tmpl$7, ssrHydrationKey(), escape(paragraph))
      })), escape(createComponent(Button, {
        as: "a",
        get href() {
          return props.product.homepageUrl;
        },
        target: "_blank",
        rel: "noreferrer",
        variant: "secondary",
        children: "Product homepage"
      })), escape(createComponent(Button, {
        as: "a",
        get href() {
          return `/companies/${props.company.slug}/products`;
        },
        variant: "ghost",
        get children() {
          return ["Back to ", props.company.name, " products"];
        }
      })))];
    }
  });
}
function SourceSummaryCard(props) {
  return createComponent(Card, {
    "class": "space-y-4",
    get children() {
      return [createComponent(SectionHeading, {
        eyebrow: "Sources",
        get title() {
          return props.title;
        }
      }), ssr(_tmpl$12, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.sources;
        },
        children: (source) => ssr(_tmpl$13, ssrHydrationKey(), ssrAttribute("href", escape(source.url, true), false), escape(source.title), escape(source.note))
      })))];
    }
  });
}

export { AlternativeTable as A, CompanyMetadataPanel as C, ProductOverviewPanel as P, SourceSummaryCard as S, TechnologyWavePanel as T, CompanyMetricsPanel as a, CompanyProductsPanel as b };
//# sourceMappingURL=company-panels-DCSwvL1f.mjs.map
