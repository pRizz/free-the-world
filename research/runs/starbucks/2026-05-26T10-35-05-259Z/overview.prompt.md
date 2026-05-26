You are preparing structured draft research for the Free The World registry.

Company: Starbucks (SBUX)
Slug: starbucks
Sector: consumer-discretionary
Industry: restaurants
Snapshot note: Pending first structured sync.

Known products from repo context:
Starbucks Rewards, Starbucks coffee

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
    "slug": "starbucks",
    "name": "Starbucks",
    "ticker": "SBUX",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "restaurants",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/starbucks/marketcap/",
    "description": "Starbucks operates and licenses coffeehouses and sells coffee, tea, beverages, and food.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Starbucks Rewards",
      "Starbucks coffee"
    ],
    "seedSourceUrls": [
      "https://investor.starbucks.com/",
      "https://companiesmarketcap.com/starbucks/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Starbucks Rewards"
    },
    {
      "name": "Starbucks coffee"
    }
  ],
  "knownSourceUrls": [
    "https://investor.starbucks.com/",
    "https://companiesmarketcap.com/starbucks/marketcap/"
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
