You are preparing structured draft research for the Free The World registry.

Company: Lowe's Companies (LOW)
Slug: lowes-companies
Sector: consumer-discretionary
Industry: home-improvement-retail
Snapshot note: Pending first structured sync.

Known products from repo context:
Lowe's stores, Lowe's Pro

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
    "slug": "lowes-companies",
    "name": "Lowe's Companies",
    "ticker": "LOW",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "home-improvement-retail",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/lowes/marketcap/",
    "description": "Lowe's Companies operates home improvement retail stores and digital commerce channels.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Lowe's stores",
      "Lowe's Pro"
    ],
    "seedSourceUrls": [
      "https://corporate.lowes.com/investors",
      "https://companiesmarketcap.com/lowes/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Lowe's stores"
    },
    {
      "name": "Lowe's Pro"
    }
  ],
  "knownSourceUrls": [
    "https://corporate.lowes.com/investors",
    "https://companiesmarketcap.com/lowes/marketcap/"
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
