You are preparing structured draft research for the Free The World registry.

Company: Medtronic (MDT)
Slug: medtronic
Sector: health-care
Industry: pharma-medtech
Snapshot note: Pending first structured sync.

Known products from repo context:
MiniMed, Micra

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
    "slug": "medtronic",
    "name": "Medtronic",
    "ticker": "MDT",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "health-care",
    "industryId": "pharma-medtech",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/medtronic/marketcap/",
    "description": "Medtronic develops and sells medical devices for cardiovascular, neuroscience, diabetes, and surgical care.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "MiniMed",
      "Micra"
    ],
    "seedSourceUrls": [
      "https://investorrelations.medtronic.com/",
      "https://companiesmarketcap.com/medtronic/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "MiniMed"
    },
    {
      "name": "Micra"
    }
  ],
  "knownSourceUrls": [
    "https://investorrelations.medtronic.com/",
    "https://companiesmarketcap.com/medtronic/marketcap/"
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
