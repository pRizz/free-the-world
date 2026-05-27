You are preparing structured draft research for the Free The World registry.

Company: Norfolk Southern (NSC)
Slug: norfolk-southern
Sector: industrials
Industry: rail-transportation
Snapshot note: Pending first structured sync.

Known products from repo context:
Norfolk Southern Railway, Thoroughbred Direct Intermodal Services

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
    "slug": "norfolk-southern",
    "name": "Norfolk Southern",
    "ticker": "NSC",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "industrials",
    "industryId": "rail-transportation",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/norfolk-southern/marketcap/",
    "description": "Norfolk Southern operates a freight railroad network serving merchandise, intermodal, coal, automotive, and industrial customers in the eastern United States.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Norfolk Southern Railway",
      "Thoroughbred Direct Intermodal Services"
    ],
    "seedSourceUrls": [
      "https://www.norfolksouthern.com/en/about-ns",
      "https://investors.norfolksouthern.com/",
      "https://companiesmarketcap.com/norfolk-southern/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Norfolk Southern Railway"
    },
    {
      "name": "Thoroughbred Direct Intermodal Services"
    }
  ],
  "knownSourceUrls": [
    "https://www.norfolksouthern.com/en/about-ns",
    "https://investors.norfolksouthern.com/",
    "https://companiesmarketcap.com/norfolk-southern/marketcap/"
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
