You are preparing structured draft research for the Free The World registry.

Company: Gilead Sciences (GILD)
Slug: gilead-sciences
Sector: health-care
Industry: pharmaceuticals
Snapshot note: Pending first structured sync.

Known products from repo context:
Biktarvy, Trodelvy

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
    "slug": "gilead-sciences",
    "name": "Gilead Sciences",
    "ticker": "GILD",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "health-care",
    "industryId": "pharmaceuticals",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/gilead-sciences/marketcap/",
    "description": "Gilead Sciences is a biopharmaceutical company focused on antiviral medicines, oncology, and inflammatory diseases.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Biktarvy",
      "Trodelvy"
    ],
    "seedSourceUrls": [
      "https://investors.gilead.com/",
      "https://www.gilead.com/science-and-medicine/medicines",
      "https://companiesmarketcap.com/gilead-sciences/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 51-75."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Biktarvy"
    },
    {
      "name": "Trodelvy"
    }
  ],
  "knownSourceUrls": [
    "https://investors.gilead.com/",
    "https://www.gilead.com/science-and-medicine/medicines",
    "https://companiesmarketcap.com/gilead-sciences/marketcap/"
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
