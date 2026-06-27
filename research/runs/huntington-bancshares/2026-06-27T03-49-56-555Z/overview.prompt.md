You are preparing structured draft research for the Free The World registry.

Company: Huntington Bancshares (HBAN)
Slug: huntington-bancshares
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
Huntington Bank checking, Huntington commercial banking

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
    "slug": "huntington-bancshares",
    "name": "Huntington Bancshares",
    "ticker": "HBAN",
    "regionId": "us",
    "indexIds": [
      "sp500-top300"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/huntington-bancshares/marketcap/",
    "description": "Huntington Bancshares is a regional bank holding company providing consumer, business, commercial, and wealth banking services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Huntington Bank checking",
      "Huntington commercial banking"
    ],
    "seedSourceUrls": [
      "https://www.huntington.com/",
      "https://companiesmarketcap.com/huntington-bancshares/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 276-300."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Huntington Bank checking"
    },
    {
      "name": "Huntington commercial banking"
    }
  ],
  "knownSourceUrls": [
    "https://www.huntington.com/",
    "https://companiesmarketcap.com/huntington-bancshares/marketcap/"
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
