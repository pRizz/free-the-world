You are preparing structured draft research for the Free The World registry.

Company: State Street (STT)
Slug: state-street
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
State Street Alpha, SPDR ETFs

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
    "slug": "state-street",
    "name": "State Street",
    "ticker": "STT",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/state-street/marketcap/",
    "description": "State Street provides investment servicing, investment management, and institutional financial services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "State Street Alpha",
      "SPDR ETFs"
    ],
    "seedSourceUrls": [
      "https://investors.statestreet.com/",
      "https://www.ssga.com/us/en/intermediary/etfs",
      "https://companiesmarketcap.com/state-street/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "State Street Alpha"
    },
    {
      "name": "SPDR ETFs"
    }
  ],
  "knownSourceUrls": [
    "https://investors.statestreet.com/",
    "https://www.ssga.com/us/en/intermediary/etfs",
    "https://companiesmarketcap.com/state-street/marketcap/"
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
