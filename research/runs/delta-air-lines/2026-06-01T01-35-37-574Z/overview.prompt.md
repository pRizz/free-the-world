You are preparing structured draft research for the Free The World registry.

Company: Delta Air Lines (DAL)
Slug: delta-air-lines
Sector: industrials
Industry: passenger-airlines
Snapshot note: Pending first structured sync.

Known products from repo context:
Delta flights, SkyMiles

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
    "slug": "delta-air-lines",
    "name": "Delta Air Lines",
    "ticker": "DAL",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "industrials",
    "industryId": "passenger-airlines",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/delta-air-lines/marketcap/",
    "description": "Delta Air Lines provides passenger air transportation, cargo service, loyalty, maintenance, and travel-related services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Delta flights",
      "SkyMiles"
    ],
    "seedSourceUrls": [
      "https://www.delta.com/",
      "https://ir.delta.com/",
      "https://companiesmarketcap.com/delta-air-lines/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Delta flights"
    },
    {
      "name": "SkyMiles"
    }
  ],
  "knownSourceUrls": [
    "https://www.delta.com/",
    "https://ir.delta.com/",
    "https://companiesmarketcap.com/delta-air-lines/marketcap/"
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
