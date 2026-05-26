You are preparing structured draft research for the Free The World registry.

Company: Eaton (ETN)
Slug: eaton
Sector: industrials
Industry: electrical-equipment
Snapshot note: Pending first structured sync.

Known products from repo context:
Power distribution equipment, EV charging infrastructure

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
    "slug": "eaton",
    "name": "Eaton",
    "ticker": "ETN",
    "regionId": "us",
    "indexIds": [
      "sp500-top100"
    ],
    "sectorId": "industrials",
    "industryId": "electrical-equipment",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/eaton/marketcap/",
    "description": "Eaton provides electrical, aerospace, vehicle, and industrial power management products.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Power distribution equipment",
      "EV charging infrastructure"
    ],
    "seedSourceUrls": [
      "https://www.eaton.com/us/en-us/company/investor-relations.html",
      "https://companiesmarketcap.com/eaton/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 76-100."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Power distribution equipment"
    },
    {
      "name": "EV charging infrastructure"
    }
  ],
  "knownSourceUrls": [
    "https://www.eaton.com/us/en-us/company/investor-relations.html",
    "https://companiesmarketcap.com/eaton/marketcap/"
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
