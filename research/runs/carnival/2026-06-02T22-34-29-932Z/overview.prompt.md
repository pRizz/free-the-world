You are preparing structured draft research for the Free The World registry.

Company: Carnival (CCL)
Slug: carnival
Sector: consumer-discretionary
Industry: cruise-lines
Snapshot note: Pending first structured sync.

Known products from repo context:
Carnival Cruise Line, Princess Cruises

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
    "slug": "carnival",
    "name": "Carnival",
    "ticker": "CCL",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "consumer-discretionary",
    "industryId": "cruise-lines",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/carnival/marketcap/",
    "description": "Carnival is a cruise company operating global cruise brands including Carnival Cruise Line, Princess Cruises, Holland America Line, and Costa Cruises.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Carnival Cruise Line",
      "Princess Cruises"
    ],
    "seedSourceUrls": [
      "https://www.carnivalcorp.com/investor-relations",
      "https://www.carnivalcorp.com/brands",
      "https://companiesmarketcap.com/carnival/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Carnival Cruise Line"
    },
    {
      "name": "Princess Cruises"
    }
  ],
  "knownSourceUrls": [
    "https://www.carnivalcorp.com/investor-relations",
    "https://www.carnivalcorp.com/brands",
    "https://companiesmarketcap.com/carnival/marketcap/"
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
