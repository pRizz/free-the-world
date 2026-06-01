You are preparing structured draft research for the Free The World registry.

Company: Nucor (NUE)
Slug: nucor
Sector: materials
Industry: steel
Snapshot note: Pending first structured sync.

Known products from repo context:
Steel sheet, Steel plate

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
    "slug": "nucor",
    "name": "Nucor",
    "ticker": "NUE",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "materials",
    "industryId": "steel",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/nucor/marketcap/",
    "description": "Nucor manufactures steel and steel products, including sheet, plate, bar, structural, and downstream steel products.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Steel sheet",
      "Steel plate"
    ],
    "seedSourceUrls": [
      "https://www.nucor.com/",
      "https://investors.nucor.com/",
      "https://companiesmarketcap.com/nucor/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Steel sheet"
    },
    {
      "name": "Steel plate"
    }
  ],
  "knownSourceUrls": [
    "https://www.nucor.com/",
    "https://investors.nucor.com/",
    "https://companiesmarketcap.com/nucor/marketcap/"
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
