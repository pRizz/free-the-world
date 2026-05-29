You are preparing structured draft research for the Free The World registry.

Company: General Motors (GM)
Slug: general-motors
Sector: consumer-discretionary
Industry: automobile-manufacturers
Snapshot note: Pending first structured sync.

Known products from repo context:
Chevrolet Silverado, Cadillac Escalade

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
    "slug": "general-motors",
    "name": "General Motors",
    "ticker": "GM",
    "regionId": "us",
    "indexIds": [
      "sp500-top175"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "automobile-manufacturers",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/general-motors/marketcap/",
    "description": "General Motors designs, manufactures, and sells cars, trucks, crossovers, and automotive services under multiple vehicle brands.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Chevrolet Silverado",
      "Cadillac Escalade"
    ],
    "seedSourceUrls": [
      "https://investor.gm.com/",
      "https://www.gm.com/company/brands",
      "https://companiesmarketcap.com/general-motors/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 151-175."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Chevrolet Silverado"
    },
    {
      "name": "Cadillac Escalade"
    }
  ],
  "knownSourceUrls": [
    "https://investor.gm.com/",
    "https://www.gm.com/company/brands",
    "https://companiesmarketcap.com/general-motors/marketcap/"
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
