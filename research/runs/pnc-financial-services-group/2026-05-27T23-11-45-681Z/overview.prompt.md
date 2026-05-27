You are preparing structured draft research for the Free The World registry.

Company: PNC Financial Services Group (PNC)
Slug: pnc-financial-services-group
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
PNC Bank, PNC Treasury Management

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
    "slug": "pnc-financial-services-group",
    "name": "PNC Financial Services Group",
    "ticker": "PNC",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/pnc-financial-services/marketcap/",
    "description": "PNC Financial Services Group provides retail banking, corporate banking, asset management, and related financial services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "PNC Bank",
      "PNC Treasury Management"
    ],
    "seedSourceUrls": [
      "https://www.pnc.com/en/about-pnc/company-profile.html",
      "https://investor.pnc.com/",
      "https://companiesmarketcap.com/pnc-financial-services/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "PNC Bank"
    },
    {
      "name": "PNC Treasury Management"
    }
  ],
  "knownSourceUrls": [
    "https://www.pnc.com/en/about-pnc/company-profile.html",
    "https://investor.pnc.com/",
    "https://companiesmarketcap.com/pnc-financial-services/marketcap/"
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
