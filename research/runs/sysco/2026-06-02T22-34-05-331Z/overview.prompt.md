You are preparing structured draft research for the Free The World registry.

Company: Sysco (SYY)
Slug: sysco
Sector: consumer-staples
Industry: consumer-staples-retail
Snapshot note: Pending first structured sync.

Known products from repo context:
Sysco Brand Products, Sysco Marketplace

Relevant technology waves:
None mapped yet in repo context.

Available repo context:
```json
{
  "target": {
    "source": "canonical",
    "batchId": null,
    "createdOn": null,
    "groupLabel": null,
    "requestNotes": null
  },
  "manifest": {
    "schemaVersion": 1,
    "slug": "sysco",
    "name": "Sysco",
    "ticker": "SYY",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "consumer-staples",
    "industryId": "consumer-staples-retail",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/sysco/marketcap/",
    "description": "Sysco distributes food, related products, and supply chain services to restaurants, health care facilities, schools, hotels, and other foodservice customers.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Sysco Brand Products",
      "Sysco Marketplace"
    ],
    "seedSourceUrls": [
      "https://investors.sysco.com/",
      "https://www.sysco.com/Products.html",
      "https://companiesmarketcap.com/sysco/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Sysco Brand Products"
    },
    {
      "name": "Sysco Marketplace"
    }
  ],
  "knownSourceUrls": [
    "https://investors.sysco.com/",
    "https://www.sysco.com/Products.html",
    "https://companiesmarketcap.com/sysco/marketcap/"
  ],
  "technologyWaves": []
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
