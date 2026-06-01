You are preparing structured draft research for the Free The World registry.

Company: Nasdaq (NDAQ)
Slug: nasdaq
Sector: financials
Industry: financial-exchanges-data
Snapshot note: Pending first structured sync.

Known products from repo context:
Nasdaq Stock Market, Nasdaq Indexes

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
    "slug": "nasdaq",
    "name": "Nasdaq",
    "ticker": "NDAQ",
    "regionId": "us",
    "indexIds": [
      "sp500-top225"
    ],
    "sectorId": "financials",
    "industryId": "financial-exchanges-data",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/nasdaq/marketcap/",
    "description": "Nasdaq operates securities exchanges and provides market technology, financial data, analytics, and index services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Nasdaq Stock Market",
      "Nasdaq Indexes"
    ],
    "seedSourceUrls": [
      "https://www.nasdaq.com/",
      "https://ir.nasdaq.com/",
      "https://companiesmarketcap.com/nasdaq/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 201-225."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Nasdaq Stock Market"
    },
    {
      "name": "Nasdaq Indexes"
    }
  ],
  "knownSourceUrls": [
    "https://www.nasdaq.com/",
    "https://ir.nasdaq.com/",
    "https://companiesmarketcap.com/nasdaq/marketcap/"
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
