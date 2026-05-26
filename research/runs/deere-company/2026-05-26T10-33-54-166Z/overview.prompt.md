You are preparing structured draft research for the Free The World registry.

Company: Deere & Company (DE)
Slug: deere-company
Sector: industrials
Industry: construction-machinery
Snapshot note: Pending first structured sync.

Known products from repo context:
John Deere tractors, John Deere Operations Center

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
    "slug": "deere-company",
    "name": "Deere & Company",
    "ticker": "DE",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "industrials",
    "industryId": "construction-machinery",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/deere-company/marketcap/",
    "description": "Deere & Company makes agricultural, construction, forestry, and turf equipment.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "John Deere tractors",
      "John Deere Operations Center"
    ],
    "seedSourceUrls": [
      "https://investor.deere.com/",
      "https://companiesmarketcap.com/deere-company/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "John Deere tractors"
    },
    {
      "name": "John Deere Operations Center"
    }
  ],
  "knownSourceUrls": [
    "https://investor.deere.com/",
    "https://companiesmarketcap.com/deere-company/marketcap/"
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
