You are preparing structured draft research for the Free The World registry.

Company: Amgen (AMGN)
Slug: amgen
Sector: health-care
Industry: pharmaceuticals
Snapshot note: Pending first structured sync.

Known products from repo context:
Enbrel, Repatha

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
    "slug": "amgen",
    "name": "Amgen",
    "ticker": "AMGN",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "health-care",
    "industryId": "pharmaceuticals",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/amgen/marketcap/",
    "description": "Amgen is a biotechnology and pharmaceutical company focused on human therapeutics.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Enbrel",
      "Repatha"
    ],
    "seedSourceUrls": [
      "https://investors.amgen.com/",
      "https://www.amgen.com/science/products",
      "https://companiesmarketcap.com/amgen/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 51-75."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Enbrel"
    },
    {
      "name": "Repatha"
    }
  ],
  "knownSourceUrls": [
    "https://investors.amgen.com/",
    "https://www.amgen.com/science/products",
    "https://companiesmarketcap.com/amgen/marketcap/"
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
