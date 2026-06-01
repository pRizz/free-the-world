You are preparing structured draft research for the Free The World registry.

Company: Yum! Brands (YUM)
Slug: yum-brands
Sector: consumer-discretionary
Industry: restaurants
Snapshot note: Pending first structured sync.

Known products from repo context:
KFC, Taco Bell

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
    "slug": "yum-brands",
    "name": "Yum! Brands",
    "ticker": "YUM",
    "regionId": "us",
    "indexIds": [
      "sp500-top225"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "restaurants",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/yum-brands/marketcap/",
    "description": "Yum! Brands franchises and operates quick-service restaurant brands including KFC, Taco Bell, Pizza Hut, and Habit Burger & Grill.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "KFC",
      "Taco Bell"
    ],
    "seedSourceUrls": [
      "https://www.yum.com/",
      "https://investors.yum.com/",
      "https://companiesmarketcap.com/yum-brands/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 201-225."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "KFC"
    },
    {
      "name": "Taco Bell"
    }
  ],
  "knownSourceUrls": [
    "https://www.yum.com/",
    "https://investors.yum.com/",
    "https://companiesmarketcap.com/yum-brands/marketcap/"
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
