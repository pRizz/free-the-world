You are preparing structured draft research for the Free The World registry.

Company: M&T Bank (MTB)
Slug: mt-bank
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
M&T Commercial Banking, M&T Mobile Banking

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
    "slug": "mt-bank",
    "name": "M&T Bank",
    "ticker": "MTB",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/mt-bank/marketcap/",
    "description": "M&T Bank is a U.S. regional bank offering commercial banking, business banking, wealth management, mortgage, and consumer banking services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "M&T Commercial Banking",
      "M&T Mobile Banking"
    ],
    "seedSourceUrls": [
      "https://www3.mtb.com/",
      "https://ir.mtb.com/",
      "https://companiesmarketcap.com/mt-bank/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "M&T Commercial Banking"
    },
    {
      "name": "M&T Mobile Banking"
    }
  ],
  "knownSourceUrls": [
    "https://www3.mtb.com/",
    "https://ir.mtb.com/",
    "https://companiesmarketcap.com/mt-bank/marketcap/"
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
