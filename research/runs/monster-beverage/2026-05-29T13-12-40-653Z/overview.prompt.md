You are preparing structured draft research for the Free The World registry.

Company: Monster Beverage (MNST)
Slug: monster-beverage
Sector: consumer-staples
Industry: nonalcoholic-beverages
Snapshot note: Pending first structured sync.

Known products from repo context:
Monster Energy, Reign Total Body Fuel

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
    "slug": "monster-beverage",
    "name": "Monster Beverage",
    "ticker": "MNST",
    "regionId": "us",
    "indexIds": [
      "sp500-top175"
    ],
    "sectorId": "consumer-staples",
    "industryId": "nonalcoholic-beverages",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/monster-beverage/marketcap/",
    "description": "Monster Beverage develops, markets, and sells energy drinks and related beverage products worldwide.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Monster Energy",
      "Reign Total Body Fuel"
    ],
    "seedSourceUrls": [
      "https://investors.monsterbevcorp.com/",
      "https://www.monsterbevcorp.com/",
      "https://companiesmarketcap.com/monster-beverage/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 151-175."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Monster Energy"
    },
    {
      "name": "Reign Total Body Fuel"
    }
  ],
  "knownSourceUrls": [
    "https://investors.monsterbevcorp.com/",
    "https://www.monsterbevcorp.com/",
    "https://companiesmarketcap.com/monster-beverage/marketcap/"
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
