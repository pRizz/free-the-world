You are preparing structured draft research for the Free The World registry.

Company: PACCAR (PCAR)
Slug: paccar
Sector: industrials
Industry: commercial-vehicle-manufacturers
Snapshot note: Pending first structured sync.

Known products from repo context:
Kenworth trucks, Peterbilt trucks

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
    "slug": "paccar",
    "name": "PACCAR",
    "ticker": "PCAR",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "industrials",
    "industryId": "commercial-vehicle-manufacturers",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/paccar/marketcap/",
    "description": "PACCAR designs, manufactures, and supports light-, medium-, and heavy-duty trucks under brands including Kenworth, Peterbilt, and DAF.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Kenworth trucks",
      "Peterbilt trucks"
    ],
    "seedSourceUrls": [
      "https://www.paccar.com/",
      "https://investor.paccar.com/",
      "https://companiesmarketcap.com/paccar/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Kenworth trucks"
    },
    {
      "name": "Peterbilt trucks"
    }
  ],
  "knownSourceUrls": [
    "https://www.paccar.com/",
    "https://investor.paccar.com/",
    "https://companiesmarketcap.com/paccar/marketcap/"
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
