You are preparing structured draft research for the Free The World registry.

Company: Blackstone (BX)
Slug: blackstone
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Blackstone Real Estate, Blackstone Credit

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
    "slug": "blackstone",
    "name": "Blackstone",
    "ticker": "BX",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/blackstone/marketcap/",
    "description": "Blackstone is an alternative asset manager focused on private equity, real estate, credit, infrastructure, and hedge fund strategies.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Blackstone Real Estate",
      "Blackstone Credit"
    ],
    "seedSourceUrls": [
      "https://ir.blackstone.com/",
      "https://companiesmarketcap.com/blackstone/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Blackstone Real Estate"
    },
    {
      "name": "Blackstone Credit"
    }
  ],
  "knownSourceUrls": [
    "https://ir.blackstone.com/",
    "https://companiesmarketcap.com/blackstone/marketcap/"
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
