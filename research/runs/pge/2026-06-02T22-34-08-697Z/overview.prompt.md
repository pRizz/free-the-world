You are preparing structured draft research for the Free The World registry.

Company: PG&E (PCG)
Slug: pge
Sector: utilities
Industry: electric-utilities
Snapshot note: Pending first structured sync.

Known products from repo context:
PG&E Electric Service, PG&E Gas Service

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
    "slug": "pge",
    "name": "PG&E",
    "ticker": "PCG",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "utilities",
    "industryId": "electric-utilities",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/pg-e/marketcap/",
    "description": "PG&E is a regulated utility holding company providing electricity and natural gas service in Northern and Central California.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "PG&E Electric Service",
      "PG&E Gas Service"
    ],
    "seedSourceUrls": [
      "https://investor.pgecorp.com/",
      "https://www.pge.com/",
      "https://companiesmarketcap.com/pg-e/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "PG&E Electric Service"
    },
    {
      "name": "PG&E Gas Service"
    }
  ],
  "knownSourceUrls": [
    "https://investor.pgecorp.com/",
    "https://www.pge.com/",
    "https://companiesmarketcap.com/pg-e/marketcap/"
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
