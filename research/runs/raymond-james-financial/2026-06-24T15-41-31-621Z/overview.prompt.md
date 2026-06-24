You are preparing structured draft research for the Free The World registry.

Company: Raymond James Financial (RJF)
Slug: raymond-james-financial
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Raymond James Wealth Management, Raymond James Investment Banking

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
    "slug": "raymond-james-financial",
    "name": "Raymond James Financial",
    "ticker": "RJF",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/raymond-james/marketcap/",
    "description": "Raymond James Financial provides wealth management, investment banking, capital markets, asset management, and banking services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Raymond James Wealth Management",
      "Raymond James Investment Banking"
    ],
    "seedSourceUrls": [
      "https://www.raymondjames.com/",
      "https://www.raymondjames.com/about-us/investor-relations",
      "https://companiesmarketcap.com/raymond-james/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Raymond James Wealth Management"
    },
    {
      "name": "Raymond James Investment Banking"
    }
  ],
  "knownSourceUrls": [
    "https://www.raymondjames.com/",
    "https://www.raymondjames.com/about-us/investor-relations",
    "https://companiesmarketcap.com/raymond-james/marketcap/"
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
