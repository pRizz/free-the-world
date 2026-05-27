You are preparing structured draft research for the Free The World registry.

Company: 3M (MMM)
Slug: 3m
Sector: industrials
Industry: industrial-conglomerates
Snapshot note: Pending first structured sync.

Known products from repo context:
Post-it Notes, Scotch Tape

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
    "slug": "3m",
    "name": "3M",
    "ticker": "MMM",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "industrials",
    "industryId": "industrial-conglomerates",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/3m/marketcap/",
    "description": "3M manufactures industrial, safety, consumer, electronics, transportation, and health-related products and materials.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Post-it Notes",
      "Scotch Tape"
    ],
    "seedSourceUrls": [
      "https://www.3m.com/wps/portal/3M/en_US/corp/information/about-us/",
      "https://investors.3m.com/",
      "https://companiesmarketcap.com/3m/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Post-it Notes"
    },
    {
      "name": "Scotch Tape"
    }
  ],
  "knownSourceUrls": [
    "https://www.3m.com/wps/portal/3M/en_US/corp/information/about-us/",
    "https://investors.3m.com/",
    "https://companiesmarketcap.com/3m/marketcap/"
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
