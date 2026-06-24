You are preparing structured draft research for the Free The World registry.

Company: Kenvue (KVUE)
Slug: kenvue
Sector: consumer-staples
Industry: household-products
Snapshot note: Pending first structured sync.

Known products from repo context:
Tylenol, Neutrogena

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
    "slug": "kenvue",
    "name": "Kenvue",
    "ticker": "KVUE",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "consumer-staples",
    "industryId": "household-products",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/kenvue/marketcap/",
    "description": "Kenvue sells consumer health products across self-care, skin health and beauty, and essential health brands.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Tylenol",
      "Neutrogena"
    ],
    "seedSourceUrls": [
      "https://www.kenvue.com/brands",
      "https://investors.kenvue.com/",
      "https://companiesmarketcap.com/kenvue/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Tylenol"
    },
    {
      "name": "Neutrogena"
    }
  ],
  "knownSourceUrls": [
    "https://www.kenvue.com/brands",
    "https://investors.kenvue.com/",
    "https://companiesmarketcap.com/kenvue/marketcap/"
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
