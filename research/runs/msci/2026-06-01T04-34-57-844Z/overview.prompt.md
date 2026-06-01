You are preparing structured draft research for the Free The World registry.

Company: MSCI (MSCI)
Slug: msci
Sector: financials
Industry: financial-exchanges-data
Snapshot note: Pending first structured sync.

Known products from repo context:
MSCI Indexes, Barra risk models

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
    "slug": "msci",
    "name": "MSCI",
    "ticker": "MSCI",
    "regionId": "us",
    "indexIds": [
      "sp500-top225"
    ],
    "sectorId": "financials",
    "industryId": "financial-exchanges-data",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/msci/marketcap/",
    "description": "MSCI provides investment indexes, portfolio analytics, risk models, ESG data, and private asset data to institutional investors.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "MSCI Indexes",
      "Barra risk models"
    ],
    "seedSourceUrls": [
      "https://www.msci.com/",
      "https://ir.msci.com/",
      "https://companiesmarketcap.com/msci/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 201-225."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "MSCI Indexes"
    },
    {
      "name": "Barra risk models"
    }
  ],
  "knownSourceUrls": [
    "https://www.msci.com/",
    "https://ir.msci.com/",
    "https://companiesmarketcap.com/msci/marketcap/"
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
