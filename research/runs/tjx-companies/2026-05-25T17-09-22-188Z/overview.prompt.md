You are preparing structured draft research for the Free The World registry.

Company: TJX Companies (TJX)
Slug: tjx-companies
Sector: consumer-discretionary
Industry: apparel-retail
Snapshot note: Pending first structured sync.

Known products from repo context:
T.J. Maxx, Marshalls, HomeGoods

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
    "slug": "tjx-companies",
    "name": "TJX Companies",
    "ticker": "TJX",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "apparel-retail",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/tjx-companies/marketcap/",
    "description": "TJX Companies is an off-price apparel and home fashions retailer operating banners including T.J. Maxx, Marshalls, and HomeGoods.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "T.J. Maxx",
      "Marshalls",
      "HomeGoods"
    ],
    "seedSourceUrls": [
      "https://investors.tjx.com/",
      "https://www.tjx.com/",
      "https://companiesmarketcap.com/tjx-companies/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 ranks 51-75 market-cap cohort."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "T.J. Maxx"
    },
    {
      "name": "Marshalls"
    },
    {
      "name": "HomeGoods"
    }
  ],
  "knownSourceUrls": [
    "https://investors.tjx.com/",
    "https://www.tjx.com/",
    "https://companiesmarketcap.com/tjx-companies/marketcap/"
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
