You are preparing structured draft research for the Free The World registry.

Company: Citizens Financial Group (CFG)
Slug: citizens-financial-group
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
Citizens Bank checking, Citizens Access

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
    "slug": "citizens-financial-group",
    "name": "Citizens Financial Group",
    "ticker": "CFG",
    "regionId": "us",
    "indexIds": [
      "sp500-top300"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/citizens-financial-group/marketcap/",
    "description": "Citizens Financial Group is a regional bank offering consumer, small business, commercial, and wealth management services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Citizens Bank checking",
      "Citizens Access"
    ],
    "seedSourceUrls": [
      "https://www.citizensbank.com/",
      "https://companiesmarketcap.com/citizens-financial-group/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 276-300."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Citizens Bank checking"
    },
    {
      "name": "Citizens Access"
    }
  ],
  "knownSourceUrls": [
    "https://www.citizensbank.com/",
    "https://companiesmarketcap.com/citizens-financial-group/marketcap/"
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
