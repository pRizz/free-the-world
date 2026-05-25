You are preparing structured draft research for the Free The World registry.

Company: McDonald's (MCD)
Slug: mcdonalds
Sector: consumer-discretionary
Industry: restaurants
Snapshot note: Pending first structured sync.

Known products from repo context:
McDonald's restaurants, McDelivery

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
    "slug": "mcdonalds",
    "name": "McDonald's",
    "ticker": "MCD",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "restaurants",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/mcdonald/marketcap/",
    "description": "McDonald's is a global restaurant company built around franchised and company-operated quick-service restaurants.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "McDonald's restaurants",
      "McDelivery"
    ],
    "seedSourceUrls": [
      "https://corporate.mcdonalds.com/corpmcd/investors.html",
      "https://www.mcdonalds.com/",
      "https://companiesmarketcap.com/mcdonald/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 ranks 51-75 market-cap cohort."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "McDonald's restaurants"
    },
    {
      "name": "McDelivery"
    }
  ],
  "knownSourceUrls": [
    "https://corporate.mcdonalds.com/corpmcd/investors.html",
    "https://www.mcdonalds.com/",
    "https://companiesmarketcap.com/mcdonald/marketcap/"
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
