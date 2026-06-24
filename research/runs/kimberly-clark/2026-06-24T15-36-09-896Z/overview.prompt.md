You are preparing structured draft research for the Free The World registry.

Company: Kimberly-Clark (KMB)
Slug: kimberly-clark
Sector: consumer-staples
Industry: household-products
Snapshot note: Pending first structured sync.

Known products from repo context:
Huggies, Kleenex

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
    "slug": "kimberly-clark",
    "name": "Kimberly-Clark",
    "ticker": "KMB",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "consumer-staples",
    "industryId": "household-products",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/kimberly-clark/marketcap/",
    "description": "Kimberly-Clark sells personal care, consumer tissue, and professional hygiene products under brands such as Huggies, Kleenex, Scott, and Kotex.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Huggies",
      "Kleenex"
    ],
    "seedSourceUrls": [
      "https://www.kimberly-clark.com/en-us/brands",
      "https://investor.kimberly-clark.com/",
      "https://companiesmarketcap.com/kimberly-clark/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Huggies"
    },
    {
      "name": "Kleenex"
    }
  ],
  "knownSourceUrls": [
    "https://www.kimberly-clark.com/en-us/brands",
    "https://investor.kimberly-clark.com/",
    "https://companiesmarketcap.com/kimberly-clark/marketcap/"
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
