You are preparing structured draft research for the Free The World registry.

Company: Consolidated Edison (ED)
Slug: consolidated-edison
Sector: utilities
Industry: electric-utilities
Snapshot note: Pending first structured sync.

Known products from repo context:
Con Edison Electric Service, Con Edison Gas Service

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
    "slug": "consolidated-edison",
    "name": "Consolidated Edison",
    "ticker": "ED",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "utilities",
    "industryId": "electric-utilities",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/consolidated-edison/marketcap/",
    "description": "Consolidated Edison is a regulated utility holding company providing electric, gas, and steam service in New York City and nearby areas.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Con Edison Electric Service",
      "Con Edison Gas Service"
    ],
    "seedSourceUrls": [
      "https://investor.conedison.com/",
      "https://www.coned.com/en",
      "https://companiesmarketcap.com/consolidated-edison/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Con Edison Electric Service"
    },
    {
      "name": "Con Edison Gas Service"
    }
  ],
  "knownSourceUrls": [
    "https://investor.conedison.com/",
    "https://www.coned.com/en",
    "https://companiesmarketcap.com/consolidated-edison/marketcap/"
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
