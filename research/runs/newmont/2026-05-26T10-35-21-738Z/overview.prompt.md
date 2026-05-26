You are preparing structured draft research for the Free The World registry.

Company: Newmont (NEM)
Slug: newmont
Sector: materials
Industry: gold-mining
Snapshot note: Pending first structured sync.

Known products from repo context:
Gold mining operations, Copper mining operations

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
    "slug": "newmont",
    "name": "Newmont",
    "ticker": "NEM",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "materials",
    "industryId": "gold-mining",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/newmont/marketcap/",
    "description": "Newmont is a gold mining company with copper, silver, zinc, and lead production exposure.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Gold mining operations",
      "Copper mining operations"
    ],
    "seedSourceUrls": [
      "https://investors.newmont.com/",
      "https://companiesmarketcap.com/newmont/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Gold mining operations"
    },
    {
      "name": "Copper mining operations"
    }
  ],
  "knownSourceUrls": [
    "https://investors.newmont.com/",
    "https://companiesmarketcap.com/newmont/marketcap/"
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
