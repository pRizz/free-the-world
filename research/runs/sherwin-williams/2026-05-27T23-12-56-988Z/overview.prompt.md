You are preparing structured draft research for the Free The World registry.

Company: Sherwin-Williams (SHW)
Slug: sherwin-williams
Sector: materials
Industry: specialty-chemicals-coatings
Snapshot note: Pending first structured sync.

Known products from repo context:
Sherwin-Williams Paints, Valspar

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
    "slug": "sherwin-williams",
    "name": "Sherwin-Williams",
    "ticker": "SHW",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "materials",
    "industryId": "specialty-chemicals-coatings",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/sherwin-williams/marketcap/",
    "description": "Sherwin-Williams manufactures and sells paints, coatings, stains, and related products for professional, industrial, and consumer markets.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Sherwin-Williams Paints",
      "Valspar"
    ],
    "seedSourceUrls": [
      "https://www.sherwin-williams.com/about-sherwin-williams",
      "https://investors.sherwin-williams.com/",
      "https://companiesmarketcap.com/sherwin-williams/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Sherwin-Williams Paints"
    },
    {
      "name": "Valspar"
    }
  ],
  "knownSourceUrls": [
    "https://www.sherwin-williams.com/about-sherwin-williams",
    "https://investors.sherwin-williams.com/",
    "https://companiesmarketcap.com/sherwin-williams/marketcap/"
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
