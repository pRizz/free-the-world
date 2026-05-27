You are preparing structured draft research for the Free The World registry.

Company: Southern Company (SO)
Slug: southern-company
Sector: utilities
Industry: electric-utilities
Snapshot note: Pending first structured sync.

Known products from repo context:
Georgia Power, Alabama Power

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
    "slug": "southern-company",
    "name": "Southern Company",
    "ticker": "SO",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "utilities",
    "industryId": "electric-utilities",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/southern-company/marketcap/",
    "description": "Southern Company is a regulated utility holding company providing electricity and natural gas services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Georgia Power",
      "Alabama Power"
    ],
    "seedSourceUrls": [
      "https://investor.southerncompany.com/",
      "https://companiesmarketcap.com/southern-company/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Georgia Power"
    },
    {
      "name": "Alabama Power"
    }
  ],
  "knownSourceUrls": [
    "https://investor.southerncompany.com/",
    "https://companiesmarketcap.com/southern-company/marketcap/"
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
