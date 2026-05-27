You are preparing structured draft research for the Free The World registry.

Company: Emerson Electric (EMR)
Slug: emerson-electric
Sector: industrials
Industry: industrial-machinery
Snapshot note: Pending first structured sync.

Known products from repo context:
DeltaV, Rosemount

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
    "slug": "emerson-electric",
    "name": "Emerson Electric",
    "ticker": "EMR",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "industrials",
    "industryId": "industrial-machinery",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/emerson-electric/marketcap/",
    "description": "Emerson Electric provides automation technology, control systems, measurement instruments, and industrial software.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "DeltaV",
      "Rosemount"
    ],
    "seedSourceUrls": [
      "https://www.emerson.com/en-us/about-us",
      "https://www.emerson.com/en-us/investors",
      "https://companiesmarketcap.com/emerson-electric/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "DeltaV"
    },
    {
      "name": "Rosemount"
    }
  ],
  "knownSourceUrls": [
    "https://www.emerson.com/en-us/about-us",
    "https://www.emerson.com/en-us/investors",
    "https://companiesmarketcap.com/emerson-electric/marketcap/"
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
