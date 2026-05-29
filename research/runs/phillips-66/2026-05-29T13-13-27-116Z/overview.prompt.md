You are preparing structured draft research for the Free The World registry.

Company: Phillips 66 (PSX)
Slug: phillips-66
Sector: energy
Industry: oil-gas-refining-marketing
Snapshot note: Pending first structured sync.

Known products from repo context:
Phillips 66 fuel, 76 fuel

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
    "slug": "phillips-66",
    "name": "Phillips 66",
    "ticker": "PSX",
    "regionId": "us",
    "indexIds": [
      "sp500-top175"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-refining-marketing",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/phillips-66/marketcap/",
    "description": "Phillips 66 is an energy manufacturing and logistics company with refining, midstream, chemicals, and marketing operations.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Phillips 66 fuel",
      "76 fuel"
    ],
    "seedSourceUrls": [
      "https://investor.phillips66.com/",
      "https://www.phillips66.com/",
      "https://companiesmarketcap.com/phillips-66/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 151-175."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Phillips 66 fuel"
    },
    {
      "name": "76 fuel"
    }
  ],
  "knownSourceUrls": [
    "https://investor.phillips66.com/",
    "https://www.phillips66.com/",
    "https://companiesmarketcap.com/phillips-66/marketcap/"
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
