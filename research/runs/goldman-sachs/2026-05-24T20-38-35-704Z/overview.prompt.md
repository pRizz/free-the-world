You are preparing structured draft research for the Free The World registry.

Company: Goldman Sachs (GS)
Slug: goldman-sachs
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Global Banking & Markets, Asset & Wealth Management

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
    "slug": "goldman-sachs",
    "name": "Goldman Sachs",
    "ticker": "GS",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/goldman-sachs/marketcap/",
    "description": "Goldman Sachs is a global financial services firm focused on investment banking, markets, asset management, and wealth management.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Global Banking & Markets",
      "Asset & Wealth Management"
    ],
    "seedSourceUrls": [
      "https://www.goldmansachs.com/investor-relations/",
      "https://www.goldmansachs.com/what-we-do/",
      "https://companiesmarketcap.com/goldman-sachs/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Global Banking & Markets"
    },
    {
      "name": "Asset & Wealth Management"
    }
  ],
  "knownSourceUrls": [
    "https://www.goldmansachs.com/investor-relations/",
    "https://www.goldmansachs.com/what-we-do/",
    "https://companiesmarketcap.com/goldman-sachs/marketcap/"
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
