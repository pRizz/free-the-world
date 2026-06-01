You are preparing structured draft research for the Free The World registry.

Company: Devon Energy (DVN)
Slug: devon-energy
Sector: energy
Industry: oil-gas-exploration-production
Snapshot note: Pending first structured sync.

Known products from repo context:
Oil production, Natural gas production

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
    "slug": "devon-energy",
    "name": "Devon Energy",
    "ticker": "DVN",
    "regionId": "us",
    "indexIds": [
      "sp500-top225"
    ],
    "sectorId": "energy",
    "industryId": "oil-gas-exploration-production",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/devon-energy/marketcap/",
    "description": "Devon Energy is an independent oil and natural gas exploration and production company focused on U.S. onshore assets.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Oil production",
      "Natural gas production"
    ],
    "seedSourceUrls": [
      "https://www.devonenergy.com/",
      "https://investors.devonenergy.com/",
      "https://companiesmarketcap.com/devon-energy/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 201-225."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Oil production"
    },
    {
      "name": "Natural gas production"
    }
  ],
  "knownSourceUrls": [
    "https://www.devonenergy.com/",
    "https://investors.devonenergy.com/",
    "https://companiesmarketcap.com/devon-energy/marketcap/"
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
