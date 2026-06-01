You are preparing structured draft research for the Free The World registry.

Company: Occidental Petroleum (OXY)
Slug: occidental-petroleum
Sector: energy
Industry: oil-gas-exploration-production
Snapshot note: Pending first structured sync.

Known products from repo context:
Oil and gas production, OxyChem

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
    "slug": "occidental-petroleum",
    "name": "Occidental Petroleum",
    "ticker": "OXY",
    "regionId": "us",
    "indexIds": [
      "sp500-top200"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-exploration-production",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/occidental-petroleum/marketcap/",
    "description": "Occidental Petroleum explores for and produces oil and natural gas and also operates chemicals and low-carbon businesses.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Oil and gas production",
      "OxyChem"
    ],
    "seedSourceUrls": [
      "https://www.oxy.com/",
      "https://investors.oxy.com/",
      "https://companiesmarketcap.com/occidental-petroleum/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 176-200."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Oil and gas production"
    },
    {
      "name": "OxyChem"
    }
  ],
  "knownSourceUrls": [
    "https://www.oxy.com/",
    "https://investors.oxy.com/",
    "https://companiesmarketcap.com/occidental-petroleum/marketcap/"
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
