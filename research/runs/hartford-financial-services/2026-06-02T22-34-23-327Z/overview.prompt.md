You are preparing structured draft research for the Free The World registry.

Company: Hartford Financial Services (HIG)
Slug: hartford-financial-services
Sector: financials
Industry: property-casualty-insurance
Snapshot note: Pending first structured sync.

Known products from repo context:
The Hartford Business Insurance, The Hartford Group Benefits

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
    "slug": "hartford-financial-services",
    "name": "Hartford Financial Services",
    "ticker": "HIG",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "financials",
    "industryId": "property-casualty-insurance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/hartford-financial-services/marketcap/",
    "description": "Hartford Financial Services provides property and casualty insurance, group benefits, and mutual funds in the United States.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "The Hartford Business Insurance",
      "The Hartford Group Benefits"
    ],
    "seedSourceUrls": [
      "https://ir.thehartford.com/",
      "https://www.thehartford.com/",
      "https://companiesmarketcap.com/hartford-financial-services/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "The Hartford Business Insurance"
    },
    {
      "name": "The Hartford Group Benefits"
    }
  ],
  "knownSourceUrls": [
    "https://ir.thehartford.com/",
    "https://www.thehartford.com/",
    "https://companiesmarketcap.com/hartford-financial-services/marketcap/"
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
