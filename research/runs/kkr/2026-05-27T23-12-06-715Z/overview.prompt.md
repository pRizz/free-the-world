You are preparing structured draft research for the Free The World registry.

Company: KKR (KKR)
Slug: kkr
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
KKR Private Equity, KKR Credit

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
    "slug": "kkr",
    "name": "KKR",
    "ticker": "KKR",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/kkr/marketcap/",
    "description": "KKR is a global investment firm managing private equity, credit, infrastructure, real estate, and insurance-related assets.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "KKR Private Equity",
      "KKR Credit"
    ],
    "seedSourceUrls": [
      "https://www.kkr.com/about",
      "https://ir.kkr.com/",
      "https://companiesmarketcap.com/kkr/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "KKR Private Equity"
    },
    {
      "name": "KKR Credit"
    }
  ],
  "knownSourceUrls": [
    "https://www.kkr.com/about",
    "https://ir.kkr.com/",
    "https://companiesmarketcap.com/kkr/marketcap/"
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
