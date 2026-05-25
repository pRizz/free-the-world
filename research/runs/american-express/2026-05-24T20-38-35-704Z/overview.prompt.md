You are preparing structured draft research for the Free The World registry.

Company: American Express (AXP)
Slug: american-express
Sector: financials
Industry: payment-networks
Snapshot note: Pending first structured sync.

Known products from repo context:
American Express Card, Membership Rewards

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
    "slug": "american-express",
    "name": "American Express",
    "ticker": "AXP",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "financials",
    "industryId": "payment-networks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/american-express/marketcap/",
    "description": "American Express operates a global payments network and issues charge, credit, and corporate payment products.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "American Express Card",
      "Membership Rewards"
    ],
    "seedSourceUrls": [
      "https://ir.americanexpress.com/",
      "https://www.americanexpress.com/",
      "https://companiesmarketcap.com/american-express/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "American Express Card"
    },
    {
      "name": "Membership Rewards"
    }
  ],
  "knownSourceUrls": [
    "https://ir.americanexpress.com/",
    "https://www.americanexpress.com/",
    "https://companiesmarketcap.com/american-express/marketcap/"
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
