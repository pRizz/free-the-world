You are preparing structured draft research for the Free The World registry.

Company: Wells Fargo (WFC)
Slug: wells-fargo
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
Wells Fargo Online, Wells Fargo Active Cash Card

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
    "slug": "wells-fargo",
    "name": "Wells Fargo",
    "ticker": "WFC",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/wells-fargo/marketcap/",
    "description": "Wells Fargo is a U.S. diversified bank offering consumer banking, commercial banking, corporate banking, and wealth management services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Wells Fargo Online",
      "Wells Fargo Active Cash Card"
    ],
    "seedSourceUrls": [
      "https://www.wellsfargo.com/about/investor-relations/",
      "https://www.wellsfargo.com/",
      "https://companiesmarketcap.com/wells-fargo/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Wells Fargo Online"
    },
    {
      "name": "Wells Fargo Active Cash Card"
    }
  ],
  "knownSourceUrls": [
    "https://www.wellsfargo.com/about/investor-relations/",
    "https://www.wellsfargo.com/",
    "https://companiesmarketcap.com/wells-fargo/marketcap/"
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
