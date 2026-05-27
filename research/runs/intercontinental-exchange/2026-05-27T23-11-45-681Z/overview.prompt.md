You are preparing structured draft research for the Free The World registry.

Company: Intercontinental Exchange (ICE)
Slug: intercontinental-exchange
Sector: financials
Industry: financial-exchanges-data
Snapshot note: Pending first structured sync.

Known products from repo context:
NYSE, ICE Data Services

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
    "slug": "intercontinental-exchange",
    "name": "Intercontinental Exchange",
    "ticker": "ICE",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "financials",
    "industryId": "financial-exchanges-data",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/intercontinental-exchange/marketcap/",
    "description": "Intercontinental Exchange operates financial exchanges, clearing houses, mortgage technology, and market data services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "NYSE",
      "ICE Data Services"
    ],
    "seedSourceUrls": [
      "https://www.ice.com/about",
      "https://ir.theice.com/",
      "https://companiesmarketcap.com/intercontinental-exchange/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "NYSE"
    },
    {
      "name": "ICE Data Services"
    }
  ],
  "knownSourceUrls": [
    "https://www.ice.com/about",
    "https://ir.theice.com/",
    "https://companiesmarketcap.com/intercontinental-exchange/marketcap/"
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
