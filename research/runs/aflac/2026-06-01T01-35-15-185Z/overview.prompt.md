You are preparing structured draft research for the Free The World registry.

Company: Aflac (AFL)
Slug: aflac
Sector: financials
Industry: life-insurance
Snapshot note: Pending first structured sync.

Known products from repo context:
Supplemental health insurance, Cancer insurance

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
    "slug": "aflac",
    "name": "Aflac",
    "ticker": "AFL",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "financials",
    "industryId": "life-insurance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/aflac/marketcap/",
    "description": "Aflac sells supplemental health and life insurance products in the United States and Japan.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Supplemental health insurance",
      "Cancer insurance"
    ],
    "seedSourceUrls": [
      "https://www.aflac.com/",
      "https://investors.aflac.com/",
      "https://companiesmarketcap.com/aflac/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Supplemental health insurance"
    },
    {
      "name": "Cancer insurance"
    }
  ],
  "knownSourceUrls": [
    "https://www.aflac.com/",
    "https://investors.aflac.com/",
    "https://companiesmarketcap.com/aflac/marketcap/"
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
