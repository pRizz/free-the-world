You are preparing structured draft research for the Free The World registry.

Company: Costco (COST)
Slug: costco
Sector: consumer-staples
Industry: warehouse-clubs
Snapshot note: Pending first structured sync.

Known products from repo context:
Warehouse clubs, Kirkland Signature

Relevant technology waves:
- Microfactories and automated mini-home production: Small, software-defined manufacturing cells could make localized production less eccentric and more default.

Available repo context:
```json
{
  "target": {
    "source": "queued",
    "batchId": "sp500-top20-2026-03-15",
    "createdOn": "2026-03-15T19:27:06.526Z",
    "groupLabel": "S&P 500 Top 20 by market cap",
    "requestNotes": "FinanceCharts screener \"Biggest companies in S&P 500 by market cap\" (https://financecharts.com/screener/biggest-companies-in-sp500?view=market_cap), company-level snapshot updated 2026-03-13 and accessed 2026-03-15."
  },
  "manifest": {
    "schemaVersion": 1,
    "slug": "costco",
    "name": "Costco",
    "ticker": "COST",
    "regionId": "us",
    "indexIds": [
      "sp500-top20"
    ],
    "sectorId": "consumer-staples",
    "industryId": "warehouse-clubs",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/costco/marketcap/",
    "description": "Membership warehouse retailer combining bulk merchandising, private-label products, and disciplined operations.",
    "technologyWaveIds": [
      "microfactories"
    ],
    "seedProductNames": [
      "Warehouse clubs",
      "Kirkland Signature"
    ],
    "seedSourceUrls": [
      "https://investor.costco.com/",
      "https://companiesmarketcap.com/costco/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 company-level S&P 500 top-20 market-cap snapshot."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Warehouse clubs"
    },
    {
      "name": "Kirkland Signature"
    }
  ],
  "knownSourceUrls": [
    "https://investor.costco.com/",
    "https://companiesmarketcap.com/costco/marketcap/"
  ],
  "technologyWaves": [
    {
      "id": "microfactories",
      "label": "Microfactories and automated mini-home production",
      "summary": "Small, software-defined manufacturing cells could make localized production less eccentric and more default.",
      "implications": [
        "Products with heavy branding but generic bill-of-materials profiles look increasingly vulnerable.",
        "Logistics moats still matter, but their margin for arrogance should narrow.",
        "Open-source production recipes can pressure both price and product differentiation."
      ]
    }
  ]
}
```

Return pure JSON only. Do not wrap it in markdown fences.

JSON schema:
{
  "schemaVersion": 1,
  "taskId": "company-overview",
  "description": "one-sentence company description",
  "overview": [
    {
      "title": "section title",
      "paragraphs": ["paragraph one", "paragraph two"]
    }
  ],
  "sourceSuggestions": [
    {
      "title": "source title",
      "url": "https://example.com",
      "whyItMatters": "short note"
    }
  ]
}

Requirements:
- Use a professional tone with restrained satire.
- Keep overview sections concise and publication-ready.
- Return 5-8 source suggestions.
