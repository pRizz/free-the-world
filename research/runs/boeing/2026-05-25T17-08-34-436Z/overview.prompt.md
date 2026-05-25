You are preparing structured draft research for the Free The World registry.

Company: Boeing (BA)
Slug: boeing
Sector: industrials
Industry: aerospace-defense
Snapshot note: Pending first structured sync.

Known products from repo context:
737, 787 Dreamliner

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
    "slug": "boeing",
    "name": "Boeing",
    "ticker": "BA",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "industrials",
    "industryId": "aerospace-defense",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/boeing/marketcap/",
    "description": "Boeing designs, manufactures, and services commercial aircraft, defense systems, satellites, and related aerospace products.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "737",
      "787 Dreamliner"
    ],
    "seedSourceUrls": [
      "https://investors.boeing.com/",
      "https://www.boeing.com/commercial",
      "https://companiesmarketcap.com/boeing/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 51-75."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "737"
    },
    {
      "name": "787 Dreamliner"
    }
  ],
  "knownSourceUrls": [
    "https://investors.boeing.com/",
    "https://www.boeing.com/commercial",
    "https://companiesmarketcap.com/boeing/marketcap/"
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
