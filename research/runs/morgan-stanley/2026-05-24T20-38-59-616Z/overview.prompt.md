You are preparing structured draft research for the Free The World registry.

Company: Morgan Stanley (MS)
Slug: morgan-stanley
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Morgan Stanley Wealth Management, E*TRADE

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
    "slug": "morgan-stanley",
    "name": "Morgan Stanley",
    "ticker": "MS",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/morgan-stanley/marketcap/",
    "description": "Morgan Stanley is a global financial services firm focused on institutional securities, wealth management, and investment management.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Morgan Stanley Wealth Management",
      "E*TRADE"
    ],
    "seedSourceUrls": [
      "https://www.morganstanley.com/about-us-ir",
      "https://www.morganstanley.com/what-we-do",
      "https://companiesmarketcap.com/morgan-stanley/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Morgan Stanley Wealth Management"
    },
    {
      "name": "E*TRADE"
    }
  ],
  "knownSourceUrls": [
    "https://www.morganstanley.com/about-us-ir",
    "https://www.morganstanley.com/what-we-do",
    "https://companiesmarketcap.com/morgan-stanley/marketcap/"
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
