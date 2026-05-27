You are preparing structured draft research for the Free The World registry.

Company: CME Group (CME)
Slug: cme-group
Sector: financials
Industry: financial-exchanges-data
Snapshot note: Pending first structured sync.

Known products from repo context:
CME Globex, CME Clearing

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
    "slug": "cme-group",
    "name": "CME Group",
    "ticker": "CME",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "financials",
    "industryId": "financial-exchanges-data",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/cme-group/marketcap/",
    "description": "CME Group operates derivatives exchanges and clearing services for futures and options markets.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "CME Globex",
      "CME Clearing"
    ],
    "seedSourceUrls": [
      "https://investor.cmegroup.com/",
      "https://companiesmarketcap.com/cme-group/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "CME Globex"
    },
    {
      "name": "CME Clearing"
    }
  ],
  "knownSourceUrls": [
    "https://investor.cmegroup.com/",
    "https://companiesmarketcap.com/cme-group/marketcap/"
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
