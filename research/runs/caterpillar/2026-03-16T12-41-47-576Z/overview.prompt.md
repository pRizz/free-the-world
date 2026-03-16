You are preparing structured draft research for the Free The World registry.

Company: Caterpillar (CAT)
Slug: caterpillar
Sector: industrials
Industry: construction-machinery
Snapshot note: Pending first structured sync.

Known products from repo context:
Cat construction equipment, Cat Financial

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
    "slug": "caterpillar",
    "name": "Caterpillar",
    "ticker": "CAT",
    "regionId": "us",
    "indexIds": [
      "sp500-top35"
    ],
    "sectorId": "industrials",
    "industryId": "construction-machinery",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/caterpillar/marketcap/",
    "description": "Manufacturer of construction, mining, and energy equipment plus related engines, parts, and services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Cat construction equipment",
      "Cat Financial"
    ],
    "seedSourceUrls": [
      "https://investors.caterpillar.com/",
      "https://www.caterpillar.com/",
      "https://companiesmarketcap.com/caterpillar/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 FinanceCharts S&P 500 market-cap snapshot ranks 26-35."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Cat construction equipment"
    },
    {
      "name": "Cat Financial"
    }
  ],
  "knownSourceUrls": [
    "https://investors.caterpillar.com/",
    "https://www.caterpillar.com/",
    "https://companiesmarketcap.com/caterpillar/marketcap/"
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
