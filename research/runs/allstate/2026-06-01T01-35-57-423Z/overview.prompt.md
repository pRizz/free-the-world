You are preparing structured draft research for the Free The World registry.

Company: Allstate (ALL)
Slug: allstate
Sector: financials
Industry: property-casualty-insurance
Snapshot note: Pending first structured sync.

Known products from repo context:
Auto insurance, Homeowners insurance

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
    "slug": "allstate",
    "name": "Allstate",
    "ticker": "ALL",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "financials",
    "industryId": "property-casualty-insurance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/allstate/marketcap/",
    "description": "Allstate sells property and casualty insurance, including auto, homeowners, renters, and related protection products.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Auto insurance",
      "Homeowners insurance"
    ],
    "seedSourceUrls": [
      "https://www.allstate.com/",
      "https://www.allstateinvestors.com/",
      "https://companiesmarketcap.com/allstate/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Auto insurance"
    },
    {
      "name": "Homeowners insurance"
    }
  ],
  "knownSourceUrls": [
    "https://www.allstate.com/",
    "https://www.allstateinvestors.com/",
    "https://companiesmarketcap.com/allstate/marketcap/"
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
