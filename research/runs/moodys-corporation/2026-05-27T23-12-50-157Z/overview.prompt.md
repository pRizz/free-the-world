You are preparing structured draft research for the Free The World registry.

Company: Moody's Corporation (MCO)
Slug: moodys-corporation
Sector: financials
Industry: financial-exchanges-data
Snapshot note: Pending first structured sync.

Known products from repo context:
Moody's Ratings, Moody's Analytics

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
    "slug": "moodys-corporation",
    "name": "Moody's Corporation",
    "ticker": "MCO",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "financials",
    "industryId": "financial-exchanges-data",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/moodys/marketcap/",
    "description": "Moody's Corporation provides credit ratings, risk analytics, research, data, and financial intelligence services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Moody's Ratings",
      "Moody's Analytics"
    ],
    "seedSourceUrls": [
      "https://www.moodys.com/web/en/us/about.html",
      "https://ir.moodys.com/",
      "https://companiesmarketcap.com/moodys/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Moody's Ratings"
    },
    {
      "name": "Moody's Analytics"
    }
  ],
  "knownSourceUrls": [
    "https://www.moodys.com/web/en/us/about.html",
    "https://ir.moodys.com/",
    "https://companiesmarketcap.com/moodys/marketcap/"
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
