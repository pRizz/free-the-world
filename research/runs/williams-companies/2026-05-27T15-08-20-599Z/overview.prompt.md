You are preparing structured draft research for the Free The World registry.

Company: Williams Companies (WMB)
Slug: williams-companies
Sector: energy
Industry: oil-gas-midstream
Snapshot note: Pending first structured sync.

Known products from repo context:
Transco pipeline, Natural gas midstream services

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
    "slug": "williams-companies",
    "name": "Williams Companies",
    "ticker": "WMB",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-midstream",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/williams-companies/marketcap/",
    "description": "Williams Companies owns and operates natural gas pipelines, gathering, processing, and midstream infrastructure.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Transco pipeline",
      "Natural gas midstream services"
    ],
    "seedSourceUrls": [
      "https://investor.williams.com/",
      "https://companiesmarketcap.com/williams-companies/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Transco pipeline"
    },
    {
      "name": "Natural gas midstream services"
    }
  ],
  "knownSourceUrls": [
    "https://investor.williams.com/",
    "https://companiesmarketcap.com/williams-companies/marketcap/"
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
