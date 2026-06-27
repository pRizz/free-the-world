You are preparing structured draft research for the Free The World registry.

Company: Hubbell (HUBB)
Slug: hubbell
Sector: industrials
Industry: electrical-equipment
Snapshot note: Pending first structured sync.

Known products from repo context:
BURNDY connectors, RACO electrical boxes

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
    "slug": "hubbell",
    "name": "Hubbell",
    "ticker": "HUBB",
    "regionId": "us",
    "indexIds": [
      "sp500-top300"
    ],
    "sectorId": "industrials",
    "industryId": "electrical-equipment",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/hubbell/marketcap/",
    "description": "Hubbell designs and manufactures electrical and utility infrastructure products for construction, industrial, and grid applications.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "BURNDY connectors",
      "RACO electrical boxes"
    ],
    "seedSourceUrls": [
      "https://www.hubbell.com/",
      "https://companiesmarketcap.com/hubbell/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 276-300."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "BURNDY connectors"
    },
    {
      "name": "RACO electrical boxes"
    }
  ],
  "knownSourceUrls": [
    "https://www.hubbell.com/",
    "https://companiesmarketcap.com/hubbell/marketcap/"
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
