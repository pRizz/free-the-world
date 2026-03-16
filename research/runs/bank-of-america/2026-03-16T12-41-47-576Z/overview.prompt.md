You are preparing structured draft research for the Free The World registry.

Company: Bank of America (BAC)
Slug: bank-of-america
Sector: financials
Industry: diversified-banks
Snapshot note: Pending first structured sync.

Known products from repo context:
Consumer banking, Merrill wealth management

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
    "slug": "bank-of-america",
    "name": "Bank of America",
    "ticker": "BAC",
    "regionId": "us",
    "indexIds": [
      "sp500-top35"
    ],
    "sectorId": "financials",
    "industryId": "diversified-banks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/bank-of-america/marketcap/",
    "description": "Banking and financial-services company spanning consumer banking, wealth management, global banking, and markets.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Consumer banking",
      "Merrill wealth management"
    ],
    "seedSourceUrls": [
      "https://investor.bankofamerica.com/",
      "https://www.bankofamerica.com/",
      "https://companiesmarketcap.com/bank-of-america/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 FinanceCharts S&P 500 market-cap snapshot ranks 26-35."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Consumer banking"
    },
    {
      "name": "Merrill wealth management"
    }
  ],
  "knownSourceUrls": [
    "https://investor.bankofamerica.com/",
    "https://www.bankofamerica.com/",
    "https://companiesmarketcap.com/bank-of-america/marketcap/"
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
