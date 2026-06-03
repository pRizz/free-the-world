You are preparing structured draft research for the Free The World registry.

Company: Prudential Financial (PRU)
Slug: prudential-financial
Sector: financials
Industry: life-insurance
Snapshot note: Pending first structured sync.

Known products from repo context:
Prudential Life Insurance, PGIM

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
    "slug": "prudential-financial",
    "name": "Prudential Financial",
    "ticker": "PRU",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "financials",
    "industryId": "life-insurance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/prudential-financial/marketcap/",
    "description": "Prudential Financial provides life insurance, retirement, investment management, and workplace benefits products and services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Prudential Life Insurance",
      "PGIM"
    ],
    "seedSourceUrls": [
      "https://investor.prudential.com/",
      "https://www.prudential.com/",
      "https://companiesmarketcap.com/prudential-financial/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Prudential Life Insurance"
    },
    {
      "name": "PGIM"
    }
  ],
  "knownSourceUrls": [
    "https://investor.prudential.com/",
    "https://www.prudential.com/",
    "https://companiesmarketcap.com/prudential-financial/marketcap/"
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
