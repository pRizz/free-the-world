You are preparing structured draft research for the Free The World registry.

Company: W.W. Grainger (GWW)
Slug: ww-grainger
Sector: industrials
Industry: commercial-services-supplies
Snapshot note: Pending first structured sync.

Known products from repo context:
Grainger.com, MRO supplies

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
    "slug": "ww-grainger",
    "name": "W.W. Grainger",
    "ticker": "GWW",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "industrials",
    "industryId": "commercial-services-supplies",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/w-w-grainger/marketcap/",
    "description": "W.W. Grainger distributes maintenance, repair, and operating products and related services to businesses and institutions.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Grainger.com",
      "MRO supplies"
    ],
    "seedSourceUrls": [
      "https://www.grainger.com/",
      "https://invest.grainger.com/",
      "https://companiesmarketcap.com/w-w-grainger/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Grainger.com"
    },
    {
      "name": "MRO supplies"
    }
  ],
  "knownSourceUrls": [
    "https://www.grainger.com/",
    "https://invest.grainger.com/",
    "https://companiesmarketcap.com/w-w-grainger/marketcap/"
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
