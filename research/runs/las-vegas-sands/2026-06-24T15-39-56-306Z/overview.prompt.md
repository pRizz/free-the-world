You are preparing structured draft research for the Free The World registry.

Company: Las Vegas Sands (LVS)
Slug: las-vegas-sands
Sector: consumer-discretionary
Industry: hotels-resorts-lodging
Snapshot note: Pending first structured sync.

Known products from repo context:
Marina Bay Sands, The Venetian Macao

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
    "slug": "las-vegas-sands",
    "name": "Las Vegas Sands",
    "ticker": "LVS",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "hotels-resorts-lodging",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/las-vegas-sands/marketcap/",
    "description": "Las Vegas Sands develops and operates integrated resorts, convention properties, casinos, hotels, and retail destinations in Macao and Singapore.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Marina Bay Sands",
      "The Venetian Macao"
    ],
    "seedSourceUrls": [
      "https://www.sands.com/",
      "https://investor.sands.com/",
      "https://companiesmarketcap.com/las-vegas-sands/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Marina Bay Sands"
    },
    {
      "name": "The Venetian Macao"
    }
  ],
  "knownSourceUrls": [
    "https://www.sands.com/",
    "https://investor.sands.com/",
    "https://companiesmarketcap.com/las-vegas-sands/marketcap/"
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
