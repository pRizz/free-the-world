You are preparing structured draft research for the Free The World registry.

Company: Capital One Financial (COF)
Slug: capital-one-financial
Sector: financials
Industry: consumer-finance
Snapshot note: Pending first structured sync.

Known products from repo context:
Capital One credit cards, Capital One 360

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
    "slug": "capital-one-financial",
    "name": "Capital One Financial",
    "ticker": "COF",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "financials",
    "industryId": "consumer-finance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/capital-one/marketcap/",
    "description": "Capital One Financial provides credit cards, consumer banking, commercial banking, and auto finance services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Capital One credit cards",
      "Capital One 360"
    ],
    "seedSourceUrls": [
      "https://investor.capitalone.com/",
      "https://companiesmarketcap.com/capital-one/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Capital One credit cards"
    },
    {
      "name": "Capital One 360"
    }
  ],
  "knownSourceUrls": [
    "https://investor.capitalone.com/",
    "https://companiesmarketcap.com/capital-one/marketcap/"
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
