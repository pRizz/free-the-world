You are preparing structured draft research for the Free The World registry.

Company: PepsiCo (PEP)
Slug: pepsico
Sector: consumer-staples
Industry: nonalcoholic-beverages
Snapshot note: Pending first structured sync.

Known products from repo context:
Pepsi, Lay's

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
    "slug": "pepsico",
    "name": "PepsiCo",
    "ticker": "PEP",
    "regionId": "us",
    "indexIds": [
      "sp500-top75"
    ],
    "sectorId": "consumer-staples",
    "industryId": "nonalcoholic-beverages",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/pepsico/marketcap/",
    "description": "PepsiCo is a food and beverage company with global snack, soft drink, sports drink, and packaged food brands.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Pepsi",
      "Lay's"
    ],
    "seedSourceUrls": [
      "https://www.pepsico.com/our-brands",
      "https://investors.pepsico.com/",
      "https://companiesmarketcap.com/pepsico/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 51-75."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Pepsi"
    },
    {
      "name": "Lay's"
    }
  ],
  "knownSourceUrls": [
    "https://www.pepsico.com/our-brands",
    "https://investors.pepsico.com/",
    "https://companiesmarketcap.com/pepsico/marketcap/"
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
