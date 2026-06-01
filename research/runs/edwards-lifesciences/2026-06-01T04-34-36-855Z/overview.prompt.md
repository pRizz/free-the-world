You are preparing structured draft research for the Free The World registry.

Company: Edwards Lifesciences (EW)
Slug: edwards-lifesciences
Sector: health-care
Industry: pharma-medtech
Snapshot note: Pending first structured sync.

Known products from repo context:
SAPIEN transcatheter heart valves, HemoSphere monitor

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
    "slug": "edwards-lifesciences",
    "name": "Edwards Lifesciences",
    "ticker": "EW",
    "regionId": "us",
    "indexIds": [
      "sp500-top225"
    ],
    "sectorId": "health-care",
    "industryId": "pharma-medtech",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/edwards-lifesciences/marketcap/",
    "description": "Edwards Lifesciences develops medical technologies for structural heart disease and critical care monitoring.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "SAPIEN transcatheter heart valves",
      "HemoSphere monitor"
    ],
    "seedSourceUrls": [
      "https://www.edwards.com/",
      "https://ir.edwards.com/",
      "https://companiesmarketcap.com/edwards-lifesciences/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 201-225."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "SAPIEN transcatheter heart valves"
    },
    {
      "name": "HemoSphere monitor"
    }
  ],
  "knownSourceUrls": [
    "https://www.edwards.com/",
    "https://ir.edwards.com/",
    "https://companiesmarketcap.com/edwards-lifesciences/marketcap/"
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
