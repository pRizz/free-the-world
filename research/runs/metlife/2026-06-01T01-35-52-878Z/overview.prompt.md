You are preparing structured draft research for the Free The World registry.

Company: MetLife (MET)
Slug: metlife
Sector: financials
Industry: life-insurance
Snapshot note: Pending first structured sync.

Known products from repo context:
Life insurance, Employee benefits

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
    "slug": "metlife",
    "name": "MetLife",
    "ticker": "MET",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "financials",
    "industryId": "life-insurance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/metlife/marketcap/",
    "description": "MetLife provides insurance, annuities, employee benefits, and asset management services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Life insurance",
      "Employee benefits"
    ],
    "seedSourceUrls": [
      "https://www.metlife.com/",
      "https://investor.metlife.com/",
      "https://companiesmarketcap.com/metlife/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Life insurance"
    },
    {
      "name": "Employee benefits"
    }
  ],
  "knownSourceUrls": [
    "https://www.metlife.com/",
    "https://investor.metlife.com/",
    "https://companiesmarketcap.com/metlife/marketcap/"
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
