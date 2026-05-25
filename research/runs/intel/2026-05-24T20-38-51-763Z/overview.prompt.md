You are preparing structured draft research for the Free The World registry.

Company: Intel (INTC)
Slug: intel
Sector: information-technology
Industry: semiconductors
Snapshot note: Pending first structured sync.

Known products from repo context:
Intel Core, Xeon

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
    "slug": "intel",
    "name": "Intel",
    "ticker": "INTC",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "information-technology",
    "industryId": "semiconductors",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/intel/marketcap/",
    "description": "Intel designs and manufactures processors, chipsets, accelerators, and other semiconductor products for client, data center, edge, and embedded markets.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Intel Core",
      "Xeon"
    ],
    "seedSourceUrls": [
      "https://www.intc.com/",
      "https://www.intel.com/content/www/us/en/products/overview.html",
      "https://companiesmarketcap.com/intel/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Intel Core"
    },
    {
      "name": "Xeon"
    }
  ],
  "knownSourceUrls": [
    "https://www.intc.com/",
    "https://www.intel.com/content/www/us/en/products/overview.html",
    "https://companiesmarketcap.com/intel/marketcap/"
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
