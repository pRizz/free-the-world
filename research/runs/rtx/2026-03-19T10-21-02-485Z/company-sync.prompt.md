You are preparing a publishable JSON refresh for the Free The World registry.

Company slug: rtx

Manifest:
```json
{
  "schemaVersion": 1,
  "slug": "rtx",
  "name": "RTX",
  "ticker": "RTX",
  "regionId": "us",
  "indexIds": [
    "sp500-top35"
  ],
  "sectorId": "industrials",
  "industryId": "aerospace-defense",
  "companiesMarketCapUrl": "https://companiesmarketcap.com/raytheon-technologies/marketcap/",
  "description": "Aerospace and defense company spanning Pratt & Whitney, Collins Aerospace, and Raytheon systems.",
  "technologyWaveIds": [],
  "seedProductNames": [
    "Pratt & Whitney engines",
    "Raytheon defense systems"
  ],
  "seedSourceUrls": [
    "https://investors.rtx.com/",
    "https://www.rtx.com/",
    "https://companiesmarketcap.com/raytheon-technologies/marketcap/"
  ],
  "notes": "Queued from the March 13, 2026 FinanceCharts S&P 500 market-cap snapshot ranks 26-35."
}
```

Current bundle (may be null for new companies):
```json
null
```

Current referenced sources:
```json
[]
```

Available taxonomy:
```json
{
  "regions": [
    {
      "id": "us",
      "label": "United States"
    }
  ],
  "indices": [
    {
      "id": "sp500-top10",
      "label": "S&P 500 · Top 10 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the ten largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top20",
      "label": "S&P 500 · Top 20 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the twenty largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top25",
      "label": "S&P 500 · Top 25 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of the twenty-five largest S&P 500 constituents by market capitalization."
    },
    {
      "id": "sp500-top35",
      "label": "S&P 500 · Top 35 by market cap",
      "regionId": "us",
      "description": "A curated snapshot of ranks 26-35 in an expansion toward the thirty-five largest S&P 500 constituents by market capitalization."
    }
  ],
  "sectors": [
    {
      "id": "information-technology",
      "label": "Information Technology"
    },
    {
      "id": "communication-services",
      "label": "Communication Services"
    },
    {
      "id": "consumer-discretionary",
      "label": "Consumer Discretionary"
    },
    {
      "id": "financials",
      "label": "Financials"
    },
    {
      "id": "consumer-staples",
      "label": "Consumer Staples"
    },
    {
      "id": "health-care",
      "label": "Health Care"
    },
    {
      "id": "energy",
      "label": "Energy"
    },
    {
      "id": "industrials",
      "label": "Industrials"
    }
  ],
  "industries": [
    {
      "id": "semiconductors",
      "sectorId": "information-technology",
      "label": "Semiconductors"
    },
    {
      "id": "technology-hardware",
      "sectorId": "information-technology",
      "label": "Technology Hardware, Storage & Peripherals"
    },
    {
      "id": "software-cloud",
      "sectorId": "information-technology",
      "label": "Software & Cloud Platforms"
    },
    {
      "id": "interactive-media-services",
      "sectorId": "communication-services",
      "label": "Interactive Media & Services"
    },
    {
      "id": "broadline-retail",
      "sectorId": "consumer-discretionary",
      "label": "Broadline Retail"
    },
    {
      "id": "automobile-manufacturers",
      "sectorId": "consumer-discretionary",
      "label": "Automobile Manufacturers"
    },
    {
      "id": "home-improvement-retail",
      "sectorId": "consumer-discretionary",
      "label": "Home Improvement Retail"
    },
    {
      "id": "multi-sector-holdings",
      "sectorId": "financials",
      "label": "Multi-Sector Holdings"
    },
    {
      "id": "consumer-staples-retail",
      "sectorId": "consumer-staples",
      "label": "Consumer Staples Distribution & Retail"
    },
    {
      "id": "diversified-banks",
      "sectorId": "financials",
      "label": "Diversified Banks"
    },
    {
      "id": "pharmaceuticals",
      "sectorId": "health-care",
      "label": "Pharmaceuticals"
    },
    {
      "id": "payment-networks",
      "sectorId": "financials",
      "label": "Payment Networks"
    },
    {
      "id": "warehouse-clubs",
      "sectorId": "consumer-staples",
      "label": "Warehouse Clubs"
    },
    {
      "id": "household-products",
      "sectorId": "consumer-staples",
      "label": "Household Products"
    },
    {
      "id": "integrated-oil-gas",
      "sectorId": "energy",
      "label": "Integrated Oil & Gas"
    },
    {
      "id": "streaming-video",
      "sectorId": "communication-services",
      "label": "Streaming Video"
    },
    {
      "id": "pharma-medtech",
      "sectorId": "health-care",
      "label": "Pharma & MedTech"
    },
    {
      "id": "nonalcoholic-beverages",
      "sectorId": "consumer-staples",
      "label": "Non-Alcoholic Beverages"
    },
    {
      "id": "construction-machinery",
      "sectorId": "industrials",
      "label": "Construction & Farm Machinery"
    },
    {
      "id": "aerospace-defense",
      "sectorId": "industrials",
      "label": "Aerospace & Defense"
    },
    {
      "id": "communications-equipment",
      "sectorId": "information-technology",
      "label": "Communications Equipment"
    },
    {
      "id": "tobacco",
      "sectorId": "consumer-staples",
      "label": "Tobacco"
    },
    {
      "id": "semiconductor-equipment",
      "sectorId": "information-technology",
      "label": "Semiconductor Equipment"
    }
  ],
  "technologyWaves": [
    {
      "id": "additive-manufacturing",
      "label": "Additive manufacturing",
      "summary": "3D plastic and metal printing keep collapsing the minimum viable factory into something much smaller, cheaper, and more local.",
      "implications": [
        "Hardware moats tied to long-tail spare parts and custom enclosures should weaken over time.",
        "Localized production improves resilience for niche components and repair ecosystems.",
        "Software plus design-file control can become as important as physical inventory control."
      ]
    },
    {
      "id": "printed-electronics",
      "label": "Printed electronics and PCB tooling",
      "summary": "PCB fabrication, chip packaging, and increasingly automated electronics assembly continue shrinking the distance between prototype and local production.",
      "implications": [
        "Incumbents with hardware lock-in should be evaluated against a future of much cheaper custom electronics.",
        "Pick-and-place automation lowers the coordination cost for distributed manufacturing cells.",
        "The most durable hardware moats may migrate toward fabs, ecosystems, and compliance rather than assembly itself."
      ]
    },
    {
      "id": "microfactories",
      "label": "Microfactories and automated mini-home production",
      "summary": "Small, software-defined manufacturing cells could make localized production less eccentric and more default.",
      "implications": [
        "Products with heavy branding but generic bill-of-materials profiles look increasingly vulnerable.",
        "Logistics moats still matter, but their margin for arrogance should narrow.",
        "Open-source production recipes can pressure both price and product differentiation."
      ]
    },
    {
      "id": "distributed-energy",
      "label": "Printable solar, localized wind, and home energy stacks",
      "summary": "Cheaper distributed generation and better local energy management create more openings for community-scale infrastructure and self-custodied resilience.",
      "implications": [
        "Energy-related products should be viewed through interoperability and open-control surfaces.",
        "Battery, charging, and home automation layers are increasingly separable from single-vendor stacks.",
        "Incumbents that depend on closed energy ecosystems may look less inevitable over time."
      ]
    },
    {
      "id": "bitcoin-native-coordination",
      "label": "Bitcoin and Lightning as coordination rails",
      "summary": "Proof-of-work economics, programmable payment flows, and anti-spam pricing make more digital systems capable of rewarding signal while resisting abuse.",
      "implications": [
        "Platforms that monetize gatekeeping could face pressure from protocol-native payment and reputation layers.",
        "Micropayments can replace some ad-funded or subscription-heavy distribution models.",
        "Open systems with credible anti-spam economics deserve a higher decentralizability score than legacy software assumptions suggest."
      ]
    }
  ]
}
```

Return pure JSON only. Do not wrap it in markdown fences.

Return a JSON object matching this schema exactly:
{
  "schemaVersion": 1,
  "bundle": {
    "schemaVersion": 1,
    "company": {
      "slug": "company slug",
      "name": "company name",
      "ticker": "ticker",
      "rankApprox": 0,
      "maybeIpo": null,
      "regionId": "taxonomy id",
      "indexIds": ["taxonomy id"],
      "sectorId": "taxonomy id",
      "industryId": "taxonomy id",
      "companiesMarketCapUrl": "https://example.com",
      "description": "one-sentence company description",
      "overview": [
        {
          "title": "section title",
          "paragraphs": ["paragraph one", "paragraph two"]
        }
      ],
      "moatNarrative": ["paragraph one", "paragraph two"],
      "decentralizationNarrative": ["paragraph one", "paragraph two"],
      "sourceIds": ["source-id"],
      "technologyWaveIds": ["taxonomy id"],
      "snapshotNote": "snapshot note",
      "inputMetrics": {
        "moat": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "decentralizability": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "profitability": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "peRatio": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "speculative",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "marketCap": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "medium",
          "lastReviewedOn": "YYYY-MM-DD"
        }
      }
    },
    "products": [
      {
        "slug": "product slug",
        "name": "product name",
        "category": "category",
        "homepageUrl": "https://example.com",
        "summary": "summary",
        "whyItMatters": "why it matters",
        "replacementSketch": ["paragraph one", "paragraph two"],
        "sourceIds": ["source-id"],
        "technologyWaveIds": ["taxonomy id"],
        "alternatives": [
          {
            "slug": "alternative slug",
            "name": "alternative name",
            "kind": "open-source",
            "homepageUrl": "https://example.com",
            "repoUrl": "https://example.com/repo",
            "summary": "summary",
            "metrics": {
              "openness": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "decentralizationFit": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "readiness": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "costLeverage": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              }
            },
            "sourceIds": ["source-id"]
          }
        ]
      }
    ]
  },
  "sources": [
    {
      "id": "source-id",
      "title": "source title",
      "url": "https://example.com",
      "kind": "investor-relations",
      "publisher": "publisher name",
      "note": "why this source matters",
      "accessedOn": "YYYY-MM-DD"
    }
  ],
  "summaryMarkdown": "optional short markdown summary"
}

Rules:
- Use only taxonomy IDs from the provided taxonomy JSON.
- Use source IDs consistently across the bundle and the sources array.
- Do not include derived company metrics such as freedCapitalPotential or IPO CAGR.
- Do not include product `companySlug`, product `alternativeSlugs`, or alternative `productSlug`; those are derived by the compiler.
- Prefer preserving strong current fields when the existing bundle already has solid information and only update what is materially improved.
- Return valid JSON and nothing else.
