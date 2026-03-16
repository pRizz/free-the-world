You are preparing structured draft research for the Free The World registry.

Company: Coca-Cola (KO)
Slug: coca-cola
Sector: consumer-staples
Industry: nonalcoholic-beverages
Snapshot note: Pending first structured sync.

Known products from repo context:
Coca-Cola, Fairlife

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
    "slug": "coca-cola",
    "name": "Coca-Cola",
    "ticker": "KO",
    "regionId": "us",
    "indexIds": [
      "sp500-top35"
    ],
    "sectorId": "consumer-staples",
    "industryId": "nonalcoholic-beverages",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/coca-cola/marketcap/",
    "description": "Global beverage company spanning sparkling soft drinks, water, juice, coffee, tea, and sports drinks.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Coca-Cola",
      "Fairlife"
    ],
    "seedSourceUrls": [
      "https://investors.coca-colacompany.com/",
      "https://www.coca-colacompany.com/",
      "https://companiesmarketcap.com/coca-cola/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 FinanceCharts S&P 500 market-cap snapshot ranks 26-35."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Coca-Cola"
    },
    {
      "name": "Fairlife"
    }
  ],
  "knownSourceUrls": [
    "https://investors.coca-colacompany.com/",
    "https://www.coca-colacompany.com/",
    "https://companiesmarketcap.com/coca-cola/marketcap/"
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
