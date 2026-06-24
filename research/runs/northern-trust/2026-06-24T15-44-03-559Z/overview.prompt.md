You are preparing structured draft research for the Free The World registry.

Company: Northern Trust (NTRS)
Slug: northern-trust
Sector: financials
Industry: capital-markets
Snapshot note: Pending first structured sync.

Known products from repo context:
Asset Servicing, Wealth Management

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
    "slug": "northern-trust",
    "name": "Northern Trust",
    "ticker": "NTRS",
    "regionId": "us",
    "indexIds": [
      "sp500-top275"
    ],
    "sectorId": "financials",
    "industryId": "capital-markets",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/northern-trust/marketcap/",
    "description": "Northern Trust provides asset servicing, investment management, wealth management, and banking services to institutions and affluent clients.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Asset Servicing",
      "Wealth Management"
    ],
    "seedSourceUrls": [
      "https://www.northerntrust.com/",
      "https://www.northerntrust.com/united-states/about-us/investor-relations",
      "https://companiesmarketcap.com/northern-trust/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 251-275."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Asset Servicing"
    },
    {
      "name": "Wealth Management"
    }
  ],
  "knownSourceUrls": [
    "https://www.northerntrust.com/",
    "https://www.northerntrust.com/united-states/about-us/investor-relations",
    "https://companiesmarketcap.com/northern-trust/marketcap/"
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
