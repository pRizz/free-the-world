You are preparing structured draft research for the Free The World registry.

Company: U.S. Bancorp (USB)
Slug: us-bancorp
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
U.S. Bank, Elavon

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
    "slug": "us-bancorp",
    "name": "U.S. Bancorp",
    "ticker": "USB",
    "regionId": "us",
    "indexIds": [
      "sp500-top150"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/us-bancorp/marketcap/",
    "description": "U.S. Bancorp provides consumer banking, business banking, payments, wealth management, and institutional financial services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "U.S. Bank",
      "Elavon"
    ],
    "seedSourceUrls": [
      "https://www.usbank.com/about-us-bank.html",
      "https://ir.usbank.com/",
      "https://companiesmarketcap.com/us-bancorp/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 126-150."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "U.S. Bank"
    },
    {
      "name": "Elavon"
    }
  ],
  "knownSourceUrls": [
    "https://www.usbank.com/about-us-bank.html",
    "https://ir.usbank.com/",
    "https://companiesmarketcap.com/us-bancorp/marketcap/"
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
