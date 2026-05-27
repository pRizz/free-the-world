You are preparing structured draft research for the Free The World registry.

Company: Mondelez International (MDLZ)
Slug: mondelez-international
Sector: consumer-staples
Industry: packaged-foods
Snapshot note: Pending first structured sync.

Known products from repo context:
Oreo, Cadbury

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
    "slug": "mondelez-international",
    "name": "Mondelez International",
    "ticker": "MDLZ",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "consumer-staples",
    "industryId": "packaged-foods",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/mondelez/marketcap/",
    "description": "Mondelez International makes and sells snacks, biscuits, chocolate, gum, candy, and powdered beverages globally.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Oreo",
      "Cadbury"
    ],
    "seedSourceUrls": [
      "https://www.mondelezinternational.com/About-Us",
      "https://ir.mondelezinternational.com/",
      "https://companiesmarketcap.com/mondelez/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Oreo"
    },
    {
      "name": "Cadbury"
    }
  ],
  "knownSourceUrls": [
    "https://www.mondelezinternational.com/About-Us",
    "https://ir.mondelezinternational.com/",
    "https://companiesmarketcap.com/mondelez/marketcap/"
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
