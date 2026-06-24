You are preparing structured draft research for the Free The World registry.

Company: Ingersoll Rand (IR)
Slug: ingersoll-rand
Sector: industrials
Industry: industrial-machinery
Snapshot note: Pending first structured sync.

Known products from repo context:
Ingersoll Rand air compressors, ARO pumps

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
    "slug": "ingersoll-rand",
    "name": "Ingersoll Rand",
    "ticker": "IR",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "industrials",
    "industryId": "industrial-machinery",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/ingersoll-rand/marketcap/",
    "description": "Ingersoll Rand makes mission-critical flow creation and industrial products, including compressors, pumps, blowers, and fluid management systems.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Ingersoll Rand air compressors",
      "ARO pumps"
    ],
    "seedSourceUrls": [
      "https://www.irco.com/",
      "https://investors.irco.com/",
      "https://companiesmarketcap.com/ingersoll-rand/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Ingersoll Rand air compressors"
    },
    {
      "name": "ARO pumps"
    }
  ],
  "knownSourceUrls": [
    "https://www.irco.com/",
    "https://investors.irco.com/",
    "https://companiesmarketcap.com/ingersoll-rand/marketcap/"
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
