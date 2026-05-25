You are preparing structured draft research for the Free The World registry.

Company: Citigroup (C)
Slug: citigroup
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
Citi Mobile, Citi Treasury and Trade Solutions

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
    "slug": "citigroup",
    "name": "Citigroup",
    "ticker": "C",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/citigroup/marketcap/",
    "description": "Citigroup is a global diversified bank providing consumer banking, institutional banking, markets, treasury, and wealth management services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Citi Mobile",
      "Citi Treasury and Trade Solutions"
    ],
    "seedSourceUrls": [
      "https://www.citigroup.com/global/investors",
      "https://www.citigroup.com/global/businesses",
      "https://companiesmarketcap.com/citigroup/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Citi Mobile"
    },
    {
      "name": "Citi Treasury and Trade Solutions"
    }
  ],
  "knownSourceUrls": [
    "https://www.citigroup.com/global/investors",
    "https://www.citigroup.com/global/businesses",
    "https://companiesmarketcap.com/citigroup/marketcap/"
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
