You are preparing structured draft research for the Free The World registry.

Company: Diamondback Energy (FANG)
Slug: diamondback-energy
Sector: energy
Industry: oil-gas-exploration-production
Snapshot note: Pending first structured sync.

Known products from repo context:
Permian Basin oil production, Natural gas production

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
    "slug": "diamondback-energy",
    "name": "Diamondback Energy",
    "ticker": "FANG",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-exploration-production",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/diamondback-energy/marketcap/",
    "description": "Diamondback Energy is an independent oil and natural gas company focused on development in the Permian Basin.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Permian Basin oil production",
      "Natural gas production"
    ],
    "seedSourceUrls": [
      "https://www.diamondbackenergy.com/",
      "https://ir.diamondbackenergy.com/",
      "https://companiesmarketcap.com/diamondback-energy/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Permian Basin oil production"
    },
    {
      "name": "Natural gas production"
    }
  ],
  "knownSourceUrls": [
    "https://www.diamondbackenergy.com/",
    "https://ir.diamondbackenergy.com/",
    "https://companiesmarketcap.com/diamondback-energy/marketcap/"
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
