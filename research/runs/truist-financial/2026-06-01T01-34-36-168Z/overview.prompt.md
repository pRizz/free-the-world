You are preparing structured draft research for the Free The World registry.

Company: Truist Financial (TFC)
Slug: truist-financial
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
Truist One Checking, Truist Wealth

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
    "slug": "truist-financial",
    "name": "Truist Financial",
    "ticker": "TFC",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/truist-financial/marketcap/",
    "description": "Truist Financial is a U.S. bank holding company offering consumer, commercial, wealth, insurance, and corporate banking services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Truist One Checking",
      "Truist Wealth"
    ],
    "seedSourceUrls": [
      "https://www.truist.com/",
      "https://ir.truist.com/",
      "https://companiesmarketcap.com/truist-financial/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Truist One Checking"
    },
    {
      "name": "Truist Wealth"
    }
  ],
  "knownSourceUrls": [
    "https://www.truist.com/",
    "https://ir.truist.com/",
    "https://companiesmarketcap.com/truist-financial/marketcap/"
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
