You are preparing structured draft research for the Free The World registry.

Company: Kraft Heinz (KHC)
Slug: kraft-heinz
Sector: consumer-staples
Industry: packaged-foods
Snapshot note: Pending first structured sync.

Known products from repo context:
Heinz Ketchup, Kraft Mac & Cheese

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
    "slug": "kraft-heinz",
    "name": "Kraft Heinz",
    "ticker": "KHC",
    "regionId": "us",
    "indexIds": [
      "sp500-top300"
    ],
    "sectorId": "consumer-staples",
    "industryId": "packaged-foods",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/kraft-heinz/marketcap/",
    "description": "Kraft Heinz sells branded packaged foods and condiments across retail and foodservice channels.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Heinz Ketchup",
      "Kraft Mac & Cheese"
    ],
    "seedSourceUrls": [
      "https://www.kraftheinzcompany.com/",
      "https://companiesmarketcap.com/kraft-heinz/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 276-300."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Heinz Ketchup"
    },
    {
      "name": "Kraft Mac & Cheese"
    }
  ],
  "knownSourceUrls": [
    "https://www.kraftheinzcompany.com/",
    "https://companiesmarketcap.com/kraft-heinz/marketcap/"
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
