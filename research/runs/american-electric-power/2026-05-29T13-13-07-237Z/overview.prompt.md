You are preparing structured draft research for the Free The World registry.

Company: American Electric Power (AEP)
Slug: american-electric-power
Sector: utilities
Industry: electric-utilities
Snapshot note: Pending first structured sync.

Known products from repo context:
AEP Ohio, Appalachian Power

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
    "slug": "american-electric-power",
    "name": "American Electric Power",
    "ticker": "AEP",
    "regionId": "us",
    "indexIds": [
      "sp500-top175"
    ],
    "sectorId": "utilities",
    "industryId": "electric-utilities",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/american-electric-power/marketcap/",
    "description": "American Electric Power is a U.S. electric utility holding company serving customers through regulated electric utilities.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "AEP Ohio",
      "Appalachian Power"
    ],
    "seedSourceUrls": [
      "https://www.aep.com/investors/",
      "https://www.aep.com/about/companies",
      "https://companiesmarketcap.com/american-electric-power/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 151-175."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "AEP Ohio"
    },
    {
      "name": "Appalachian Power"
    }
  ],
  "knownSourceUrls": [
    "https://www.aep.com/investors/",
    "https://www.aep.com/about/companies",
    "https://companiesmarketcap.com/american-electric-power/marketcap/"
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
