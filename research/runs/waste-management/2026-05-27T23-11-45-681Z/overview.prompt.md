You are preparing structured draft research for the Free The World registry.

Company: Waste Management (WM)
Slug: waste-management
Sector: industrials
Industry: waste-management-services
Snapshot note: Pending first structured sync.

Known products from repo context:
WM Residential Trash Service, WM Recycling

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
    "slug": "waste-management",
    "name": "Waste Management",
    "ticker": "WM",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "industrials",
    "industryId": "waste-management-services",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/waste-management/marketcap/",
    "description": "Waste Management provides waste collection, recycling, disposal, landfill, and renewable natural gas services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "WM Residential Trash Service",
      "WM Recycling"
    ],
    "seedSourceUrls": [
      "https://www.wm.com/us/en/about-us",
      "https://investors.wm.com/",
      "https://companiesmarketcap.com/waste-management/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "WM Residential Trash Service"
    },
    {
      "name": "WM Recycling"
    }
  ],
  "knownSourceUrls": [
    "https://www.wm.com/us/en/about-us",
    "https://investors.wm.com/",
    "https://companiesmarketcap.com/waste-management/marketcap/"
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
