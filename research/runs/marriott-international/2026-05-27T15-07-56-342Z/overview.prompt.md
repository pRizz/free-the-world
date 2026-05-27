You are preparing structured draft research for the Free The World registry.

Company: Marriott International (MAR)
Slug: marriott-international
Sector: consumer-discretionary
Industry: hotels-resorts-lodging
Snapshot note: Pending first structured sync.

Known products from repo context:
Marriott Bonvoy, Ritz-Carlton

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
    "slug": "marriott-international",
    "name": "Marriott International",
    "ticker": "MAR",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "hotels-resorts-lodging",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/marriott/marketcap/",
    "description": "Marriott International franchises, manages, and licenses hotels, resorts, and lodging brands worldwide.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Marriott Bonvoy",
      "Ritz-Carlton"
    ],
    "seedSourceUrls": [
      "https://marriott.gcs-web.com/",
      "https://companiesmarketcap.com/marriott/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Marriott Bonvoy"
    },
    {
      "name": "Ritz-Carlton"
    }
  ],
  "knownSourceUrls": [
    "https://marriott.gcs-web.com/",
    "https://companiesmarketcap.com/marriott/marketcap/"
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
