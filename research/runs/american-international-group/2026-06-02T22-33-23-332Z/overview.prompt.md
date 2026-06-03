You are preparing structured draft research for the Free The World registry.

Company: American International Group (AIG)
Slug: american-international-group
Sector: financials
Industry: property-casualty-insurance
Snapshot note: Pending first structured sync.

Known products from repo context:
AIG Commercial Insurance, AIG Private Client Select

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
    "slug": "american-international-group",
    "name": "American International Group",
    "ticker": "AIG",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "financials",
    "industryId": "property-casualty-insurance",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/american-international-group/marketcap/",
    "description": "American International Group provides commercial, institutional, and consumer property and casualty insurance products worldwide.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "AIG Commercial Insurance",
      "AIG Private Client Select"
    ],
    "seedSourceUrls": [
      "https://www.aig.com/investor-relations",
      "https://www.aig.com/business/insurance",
      "https://companiesmarketcap.com/american-international-group/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "AIG Commercial Insurance"
    },
    {
      "name": "AIG Private Client Select"
    }
  ],
  "knownSourceUrls": [
    "https://www.aig.com/investor-relations",
    "https://www.aig.com/business/insurance",
    "https://companiesmarketcap.com/american-international-group/marketcap/"
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
