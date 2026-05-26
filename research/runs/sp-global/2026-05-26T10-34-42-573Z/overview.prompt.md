You are preparing structured draft research for the Free The World registry.

Company: S&P Global (SPGI)
Slug: sp-global
Sector: financials
Industry: financial-exchanges-data
Snapshot note: Pending first structured sync.

Known products from repo context:
S&P Global Ratings, S&P Dow Jones Indices

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
    "slug": "sp-global",
    "name": "S&P Global",
    "ticker": "SPGI",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "financials",
    "industryId": "financial-exchanges-data",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/sp-global/marketcap/",
    "description": "S&P Global provides credit ratings, benchmarks, analytics, and financial market data.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "S&P Global Ratings",
      "S&P Dow Jones Indices"
    ],
    "seedSourceUrls": [
      "https://investor.spglobal.com/",
      "https://companiesmarketcap.com/sp-global/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "S&P Global Ratings"
    },
    {
      "name": "S&P Dow Jones Indices"
    }
  ],
  "knownSourceUrls": [
    "https://investor.spglobal.com/",
    "https://companiesmarketcap.com/sp-global/marketcap/"
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
