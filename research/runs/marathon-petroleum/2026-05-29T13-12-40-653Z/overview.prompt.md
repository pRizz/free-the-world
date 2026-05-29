You are preparing structured draft research for the Free The World registry.

Company: Marathon Petroleum (MPC)
Slug: marathon-petroleum
Sector: energy
Industry: oil-gas-refining-marketing
Snapshot note: Pending first structured sync.

Known products from repo context:
Marathon fuel, ARCO fuel

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
    "slug": "marathon-petroleum",
    "name": "Marathon Petroleum",
    "ticker": "MPC",
    "regionId": "us",
    "indexIds": [
      "sp500-top175"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-refining-marketing",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/marathon-petroleum/marketcap/",
    "description": "Marathon Petroleum is a U.S. refining, marketing, and midstream energy company.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Marathon fuel",
      "ARCO fuel"
    ],
    "seedSourceUrls": [
      "https://www.marathonpetroleum.com/Investors/",
      "https://www.marathonpetroleum.com/",
      "https://companiesmarketcap.com/marathon-petroleum/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 151-175."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Marathon fuel"
    },
    {
      "name": "ARCO fuel"
    }
  ],
  "knownSourceUrls": [
    "https://www.marathonpetroleum.com/Investors/",
    "https://www.marathonpetroleum.com/",
    "https://companiesmarketcap.com/marathon-petroleum/marketcap/"
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
