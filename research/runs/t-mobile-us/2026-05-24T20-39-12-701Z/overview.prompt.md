You are preparing structured draft research for the Free The World registry.

Company: T-Mobile US (TMUS)
Slug: t-mobile-us
Sector: communication-services
Industry: wireless-telecom
Snapshot note: Pending first structured sync.

Known products from repo context:
T-Mobile 5G, T-Mobile Home Internet

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
    "slug": "t-mobile-us",
    "name": "T-Mobile US",
    "ticker": "TMUS",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "communication-services",
    "industryId": "wireless-telecom",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/t-mobile-us/marketcap/",
    "description": "T-Mobile US is a wireless telecommunications company providing mobile voice, data, broadband, and related services in the United States.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "T-Mobile 5G",
      "T-Mobile Home Internet"
    ],
    "seedSourceUrls": [
      "https://investor.t-mobile.com/",
      "https://www.t-mobile.com/",
      "https://companiesmarketcap.com/t-mobile-us/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "T-Mobile 5G"
    },
    {
      "name": "T-Mobile Home Internet"
    }
  ],
  "knownSourceUrls": [
    "https://investor.t-mobile.com/",
    "https://www.t-mobile.com/",
    "https://companiesmarketcap.com/t-mobile-us/marketcap/"
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
