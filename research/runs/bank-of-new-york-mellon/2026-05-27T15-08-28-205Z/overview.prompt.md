You are preparing structured draft research for the Free The World registry.

Company: Bank of New York Mellon (BK)
Slug: bank-of-new-york-mellon
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
BNY Pershing, BNY Mellon Investment Management

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
    "slug": "bank-of-new-york-mellon",
    "name": "Bank of New York Mellon",
    "ticker": "BK",
    "regionId": "us",
    "indexIds": [
      "sp500-top125"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/bank-of-new-york-mellon/marketcap/",
    "description": "Bank of New York Mellon provides custody, asset servicing, wealth management, and investment management services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "BNY Pershing",
      "BNY Mellon Investment Management"
    ],
    "seedSourceUrls": [
      "https://www.bny.com/corporate/global/en/investor-relations.html",
      "https://companiesmarketcap.com/bank-of-new-york-mellon/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 101-125."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "BNY Pershing"
    },
    {
      "name": "BNY Mellon Investment Management"
    }
  ],
  "knownSourceUrls": [
    "https://www.bny.com/corporate/global/en/investor-relations.html",
    "https://companiesmarketcap.com/bank-of-new-york-mellon/marketcap/"
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
