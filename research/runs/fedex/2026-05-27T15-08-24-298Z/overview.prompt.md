You are preparing structured draft research for the Free The World registry.

Company: FedEx (FDX)
Slug: fedex
Sector: industrials
Industry: air-freight-logistics
Snapshot note: Pending first structured sync.

Known products from repo context:
FedEx Express, FedEx Ground

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
    "slug": "fedex",
    "name": "FedEx",
    "ticker": "FDX",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "industrials",
    "industryId": "air-freight-logistics",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/fedex/marketcap/",
    "description": "FedEx provides parcel delivery, express transportation, freight, and logistics services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "FedEx Express",
      "FedEx Ground"
    ],
    "seedSourceUrls": [
      "https://investors.fedex.com/",
      "https://companiesmarketcap.com/fedex/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "FedEx Express"
    },
    {
      "name": "FedEx Ground"
    }
  ],
  "knownSourceUrls": [
    "https://investors.fedex.com/",
    "https://companiesmarketcap.com/fedex/marketcap/"
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
