You are preparing structured draft research for the Free The World registry.

Company: Ameriprise Financial (AMP)
Slug: ameriprise-financial
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Ameriprise Financial Planning, Columbia Threadneedle Investments

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
    "slug": "ameriprise-financial",
    "name": "Ameriprise Financial",
    "ticker": "AMP",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/ameriprise-financial/marketcap/",
    "description": "Ameriprise Financial provides wealth management, asset management, insurance, annuities, and financial planning services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Ameriprise Financial Planning",
      "Columbia Threadneedle Investments"
    ],
    "seedSourceUrls": [
      "https://ir.ameriprise.com/",
      "https://www.ameriprise.com/",
      "https://companiesmarketcap.com/ameriprise-financial/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Ameriprise Financial Planning"
    },
    {
      "name": "Columbia Threadneedle Investments"
    }
  ],
  "knownSourceUrls": [
    "https://ir.ameriprise.com/",
    "https://www.ameriprise.com/",
    "https://companiesmarketcap.com/ameriprise-financial/marketcap/"
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
