You are preparing structured draft research for the Free The World registry.

Company: Charles Schwab (SCHW)
Slug: charles-schwab
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Schwab Brokerage, Schwab Wealth Advisory

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
    "slug": "charles-schwab",
    "name": "Charles Schwab",
    "ticker": "SCHW",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/charles-schwab/marketcap/",
    "description": "Charles Schwab provides brokerage, wealth management, banking, and investment advisory services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Schwab Brokerage",
      "Schwab Wealth Advisory"
    ],
    "seedSourceUrls": [
      "https://www.aboutschwab.com/investor-relations",
      "https://www.schwab.com/",
      "https://companiesmarketcap.com/charles-schwab/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 51-75."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Schwab Brokerage"
    },
    {
      "name": "Schwab Wealth Advisory"
    }
  ],
  "knownSourceUrls": [
    "https://www.aboutschwab.com/investor-relations",
    "https://www.schwab.com/",
    "https://companiesmarketcap.com/charles-schwab/marketcap/"
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
