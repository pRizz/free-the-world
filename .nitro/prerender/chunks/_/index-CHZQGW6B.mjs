import { createComponent, ssr, ssrHydrationKey, escape, ssrAttribute } from 'file:///workspace/node_modules/solid-js/web/dist/server.js';
import { T as Title, S as SectionHeading, C as Card, I as Input, b as Select, B as Badge, c as Table, A } from '../virtual/entry.mjs';
import { createSignal, createMemo, For } from 'file:///workspace/node_modules/solid-js/dist/server.js';
import { d as defaultVisibleCompanyMetrics, c as companyMetricDefinitions } from './metrics-Dua0ydrl.mjs';
import { c as companies, f as formatCompanyMetric } from './formatters-Ckoru01L.mjs';
import { d as getSectorLabel, e as getIndustryLabel, i as industries, s as sectors } from './selectors-CTNmzqQM.mjs';
import 'file:///workspace/node_modules/h3/dist/_entries/node.mjs';
import 'file:///workspace/node_modules/pathe/dist/index.mjs';
import 'file:///workspace/node_modules/radix3/dist/index.mjs';
import 'file:///workspace/node_modules/seroval/dist/esm/production/index.mjs';
import 'file:///workspace/node_modules/seroval-plugins/dist/esm/production/web.mjs';
import 'file:///workspace/node_modules/clsx/dist/clsx.mjs';
import 'file:///workspace/node_modules/tailwind-merge/dist/bundle-mjs.mjs';
import 'file:///workspace/node_modules/class-variance-authority/dist/index.mjs';
import 'file:///workspace/node_modules/solid-js/web/storage/dist/storage.js';
import 'file:///workspace/node_modules/cookie-es/dist/index.mjs';
import './technology-waves-DCxT8MAr.mjs';

var _tmpl$$2 = ["<thead", ' class="bg-[var(--color-surface-elevated)] text-xs uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]"><tr><th class="px-4 py-4 font-medium">Company</th><th class="px-4 py-4 font-medium">Sector</th><!--$-->', '<!--/--><th class="px-4 py-4 font-medium">Products</th><th class="px-4 py-4 font-medium">Links</th></tr></thead>'], _tmpl$2$2 = ["<tbody", ">", "</tbody>"], _tmpl$3$1 = ["<th", ' class="px-4 py-4 font-medium">', "</th>"], _tmpl$4$1 = ["<tr", ' class="border-t border-[var(--color-border)] align-top"><td class="space-y-3 px-4 py-4"><div class="space-y-2"><!--$-->', '<!--/--><div class="flex flex-wrap gap-2"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", '<!--/--></div></div><p class="max-w-sm text-sm leading-7 text-[var(--color-muted-foreground)]">', '</p></td><td class="px-4 py-4 text-sm text-[var(--color-muted-foreground)]"><div class="space-y-2"><p>', "</p><p>", "</p></div></td><!--$-->", '<!--/--><td class="px-4 py-4 text-sm text-[var(--color-muted-foreground)]">', '</td><td class="px-4 py-4 text-sm"><div class="flex flex-col gap-2"><!--$-->', "<!--/--><a", ' target="_blank" rel="noreferrer" class="hover:text-[var(--color-accent)]">CompaniesMarketCap</a></div></td></tr>'], _tmpl$5$1 = ["<td", ' class="px-4 py-4 text-sm font-medium text-[var(--color-foreground)]"><div class="space-y-2"><p>', '</p><p class="max-w-[13rem] text-xs leading-6 text-[var(--color-muted-foreground)]">', "</p></div></td>"];
function CompanyTable(props) {
  return createComponent(Table, {
    get children() {
      return [ssr(_tmpl$$2, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.visibleMetricIds;
        },
        children: (metricId) => ssr(_tmpl$3$1, ssrHydrationKey(), escape(companyMetricDefinitions[metricId].shortLabel))
      }))), ssr(_tmpl$2$2, ssrHydrationKey(), escape(createComponent(For, {
        get each() {
          return props.companies;
        },
        children: (company) => ssr(_tmpl$4$1, ssrHydrationKey(), escape(createComponent(A, {
          get href() {
            return `/companies/${company.slug}`;
          },
          "class": "text-base font-semibold hover:text-[var(--color-accent)]",
          get children() {
            return company.name;
          }
        })), escape(createComponent(Badge, {
          tone: "accent",
          get children() {
            return company.ticker;
          }
        })), escape(createComponent(Badge, {
          tone: "muted",
          get children() {
            return ["Rank \u2248 ", company.rankApprox];
          }
        })), escape(createComponent(Badge, {
          tone: "muted",
          get children() {
            return getIndustryLabel(company.industryId);
          }
        })), escape(company.description), escape(getSectorLabel(company.sectorId)), escape(getIndustryLabel(company.industryId)), escape(createComponent(For, {
          get each() {
            return props.visibleMetricIds;
          },
          children: (metricId) => ssr(_tmpl$5$1, ssrHydrationKey(), escape(formatCompanyMetric(metricId, company.metrics[metricId])), escape(company.metrics[metricId].rationale))
        })), escape(createComponent(A, {
          get href() {
            return `/companies/${company.slug}/products`;
          },
          "class": "hover:text-[var(--color-accent)]",
          get children() {
            return [company.productSlugs.length, " product analyses"];
          }
        })), escape(createComponent(A, {
          get href() {
            return `/companies/${company.slug}`;
          },
          "class": "hover:text-[var(--color-accent)]",
          children: "Details"
        })), ssrAttribute("href", escape(company.companiesMarketCapUrl, true), false))
      })))];
    }
  });
}
const defaultCompanyTableState = {
  search: "",
  sectorId: "all",
  industryId: "all",
  sortMetricId: "freedCapitalPotential",
  sortDirection: "desc",
  visibleMetricIds: [...defaultVisibleCompanyMetrics]
};
const companyTableMetricOptions = Object.values(companyMetricDefinitions).map((definition) => ({
  id: definition.id,
  label: definition.label
}));
var _tmpl$$1 = ["<option", ' value="all">All sectors</option>'], _tmpl$2$1 = ["<option", ' value="all">All industries</option>'], _tmpl$3 = ["<option", ' value="desc">Highest first</option>'], _tmpl$4 = ["<option", ' value="asc">Lowest first</option>'], _tmpl$5 = ["<div", ' class="flex flex-col gap-4 lg:flex-row lg:items-end"><div class="flex-1 space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Search companies</label><!--$-->', '<!--/--></div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Sector</label><!--$-->', '<!--/--></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Industry</label><!--$-->', '<!--/--></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Sort metric</label><!--$-->', '<!--/--></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted-foreground)]">Direction</label><!--$-->', "<!--/--></div></div></div>"], _tmpl$6 = ["<details", ' class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-4"><summary class="cursor-pointer list-none text-sm font-medium text-[var(--color-foreground)]">Toggle visible columns</summary><div class="mt-4 flex flex-wrap gap-2">', "</div></details>"], _tmpl$7 = ["<option", ">", "</option>"], _tmpl$8 = ["<button", ' type="button" class="cursor-pointer">', "</button>"];
function CompanyTableToolbar(props) {
  return createComponent(Card, {
    "class": "space-y-5",
    get children() {
      return [ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(Input, {
        get value() {
          return props.search;
        },
        onInput: (event) => props.onSearch(event.currentTarget.value),
        placeholder: "Search by name, ticker, sector, or thesis"
      })), escape(createComponent(Select, {
        get value() {
          return props.sectorId;
        },
        onChange: (event) => props.onSector(event.currentTarget.value),
        get children() {
          return [ssr(_tmpl$$1, ssrHydrationKey()), createComponent(For, {
            get each() {
              return props.sectors;
            },
            children: (sector) => ssr(_tmpl$7, ssrHydrationKey() + ssrAttribute("value", escape(sector.id, true), false), escape(sector.label))
          })];
        }
      })), escape(createComponent(Select, {
        get value() {
          return props.industryId;
        },
        onChange: (event) => props.onIndustry(event.currentTarget.value),
        get children() {
          return [ssr(_tmpl$2$1, ssrHydrationKey()), createComponent(For, {
            get each() {
              return props.industries;
            },
            children: (industry) => ssr(_tmpl$7, ssrHydrationKey() + ssrAttribute("value", escape(industry.id, true), false), escape(industry.label))
          })];
        }
      })), escape(createComponent(Select, {
        get value() {
          return props.sortMetricId;
        },
        onChange: (event) => props.onSortMetric(event.currentTarget.value),
        get children() {
          return createComponent(For, {
            each: companyTableMetricOptions,
            children: (metric) => ssr(_tmpl$7, ssrHydrationKey() + ssrAttribute("value", escape(metric.id, true), false), escape(metric.label))
          });
        }
      })), escape(createComponent(Select, {
        get value() {
          return props.sortDirection;
        },
        onChange: (event) => props.onSortDirection(event.currentTarget.value),
        get children() {
          return [ssr(_tmpl$3, ssrHydrationKey()), ssr(_tmpl$4, ssrHydrationKey())];
        }
      }))), ssr(_tmpl$6, ssrHydrationKey(), escape(createComponent(For, {
        each: companyTableMetricOptions,
        children: (metric) => ssr(_tmpl$8, ssrHydrationKey(), escape(createComponent(Badge, {
          get tone() {
            return props.visibleMetricIds.includes(metric.id) ? "accent" : "muted";
          },
          get children() {
            return metric.label;
          }
        })))
      })))];
    }
  });
}
var _tmpl$ = ["<div", ' class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p class="text-sm font-medium text-[var(--color-foreground)]"><!--$-->', '<!--/--> companies shown</p><p class="text-sm text-[var(--color-muted-foreground)]">Sorted by <!--$-->', "<!--/--> (<!--$-->", '<!--/-->)</p></div><p class="text-sm text-[var(--color-muted-foreground)]">Column toggles let the table stay dense without becoming unreadable.</p></div>'], _tmpl$2 = ["<div", ' class="space-y-8"><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div>"];
const id$$ = "src/routes/companies/index.tsx?pick=default&pick=$css";
function CompaniesPage() {
  const [search, setSearch] = createSignal(defaultCompanyTableState.search);
  const [sectorId, setSectorId] = createSignal(defaultCompanyTableState.sectorId);
  const [industryId, setIndustryId] = createSignal(defaultCompanyTableState.industryId);
  const [sortMetricId, setSortMetricId] = createSignal(defaultCompanyTableState.sortMetricId);
  const [sortDirection, setSortDirection] = createSignal(defaultCompanyTableState.sortDirection);
  const [visibleMetricIds, setVisibleMetricIds] = createSignal(defaultCompanyTableState.visibleMetricIds);
  const filteredCompanies = createMemo(() => {
    const term = search().trim().toLowerCase();
    return [...companies].filter((company) => {
      const searchHaystack = [company.name, company.ticker, company.description, getSectorLabel(company.sectorId), getIndustryLabel(company.industryId)].join(" ").toLowerCase();
      const matchesTerm = !term || searchHaystack.includes(term);
      const matchesSector = sectorId() === "all" || company.sectorId === sectorId();
      const matchesIndustry = industryId() === "all" || company.industryId === industryId();
      return matchesTerm && matchesSector && matchesIndustry;
    }).sort((left, right) => {
      const leftValue = left.metrics[sortMetricId()].value;
      const rightValue = right.metrics[sortMetricId()].value;
      return sortDirection() === "desc" ? rightValue - leftValue : leftValue - rightValue;
    });
  });
  function toggleMetric(metricId) {
    setVisibleMetricIds((currentMetricIds) => currentMetricIds.includes(metricId) ? currentMetricIds.filter((id) => id !== metricId) : [...currentMetricIds, metricId]);
  }
  return [createComponent(Title, {
    children: "Company Registry \xB7 Free The World"
  }), ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(SectionHeading, {
    eyebrow: "Registry",
    title: "Top 10 S&P 500 companies",
    description: "A curated launch set focused on the largest companies in the index. The architecture is designed to absorb more indices, regions, and private companies later without turning the data layer into soup."
  })), escape(createComponent(CompanyTableToolbar, {
    get search() {
      return search();
    },
    get sectorId() {
      return sectorId();
    },
    get industryId() {
      return industryId();
    },
    get sortMetricId() {
      return sortMetricId();
    },
    get sortDirection() {
      return sortDirection();
    },
    get visibleMetricIds() {
      return visibleMetricIds();
    },
    sectors,
    industries,
    onSearch: setSearch,
    onSector: setSectorId,
    onIndustry: setIndustryId,
    onSortMetric: setSortMetricId,
    onSortDirection: setSortDirection,
    onToggleMetric: toggleMetric
  })), escape(createComponent(Card, {
    "class": "space-y-4",
    get children() {
      return [ssr(_tmpl$, ssrHydrationKey(), escape(filteredCompanies().length), escape(sortMetricId()), escape(sortDirection())), createComponent(CompanyTable, {
        get companies() {
          return filteredCompanies();
        },
        get visibleMetricIds() {
          return visibleMetricIds();
        }
      })];
    }
  })))];
}

export { CompaniesPage as default, id$$ };
//# sourceMappingURL=index-CHZQGW6B.mjs.map
