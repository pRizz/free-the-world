You are preparing structured draft research for the Free The World registry.

Company: BlackRock (BLK)
Slug: blackrock
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
iShares, Aladdin

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
    "slug": "blackrock",
    "name": "BlackRock",
    "ticker": "BLK",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/blackrock/marketcap/",
    "description": "BlackRock is an asset management company offering investment funds, portfolio management, risk analytics, and advisory services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "iShares",
      "Aladdin"
    ],
    "seedSourceUrls": [
      "https://ir.blackrock.com/",
      "https://www.blackrock.com/corporate/about-us",
      "https://companiesmarketcap.com/blackrock/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 51-75."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "iShares"
    },
    {
      "name": "Aladdin"
    }
  ],
  "knownSourceUrls": [
    "https://ir.blackrock.com/",
    "https://www.blackrock.com/corporate/about-us",
    "https://companiesmarketcap.com/blackrock/marketcap/"
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
