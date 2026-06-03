You are preparing structured draft research for the Free The World registry.

Company: Becton Dickinson (BDX)
Slug: becton-dickinson
Sector: health-care
Industry: pharma-medtech
Snapshot note: Pending first structured sync.

Known products from repo context:
BD Vacutainer, BD Pyxis

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
    "slug": "becton-dickinson",
    "name": "Becton Dickinson",
    "ticker": "BDX",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "health-care",
    "industryId": "pharma-medtech",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/becton-dickinson/marketcap/",
    "description": "Becton Dickinson is a medical technology company that makes devices, laboratory equipment, diagnostic products, and medication management systems.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "BD Vacutainer",
      "BD Pyxis"
    ],
    "seedSourceUrls": [
      "https://investors.bd.com/",
      "https://www.bd.com/en-us/products-and-solutions/products",
      "https://companiesmarketcap.com/becton-dickinson/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "BD Vacutainer"
    },
    {
      "name": "BD Pyxis"
    }
  ],
  "knownSourceUrls": [
    "https://investors.bd.com/",
    "https://www.bd.com/en-us/products-and-solutions/products",
    "https://companiesmarketcap.com/becton-dickinson/marketcap/"
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
