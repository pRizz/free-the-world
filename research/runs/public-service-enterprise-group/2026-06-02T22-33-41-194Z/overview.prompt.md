You are preparing structured draft research for the Free The World registry.

Company: Public Service Enterprise Group (PEG)
Slug: public-service-enterprise-group
Sector: utilities
Industry: electric-utilities
Snapshot note: Pending first structured sync.

Known products from repo context:
PSE&G Electric Service, PSE&G Gas Service

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
    "slug": "public-service-enterprise-group",
    "name": "Public Service Enterprise Group",
    "ticker": "PEG",
    "regionId": "us",
    "indexIds": [
      "sp500-top250"
    ],
    "sectorId": "utilities",
    "industryId": "electric-utilities",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/public-service-enterprise-group/marketcap/",
    "description": "Public Service Enterprise Group is a utility holding company whose main businesses include regulated electric and gas utility operations in New Jersey.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "PSE&G Electric Service",
      "PSE&G Gas Service"
    ],
    "seedSourceUrls": [
      "https://investor.pseg.com/",
      "https://nj.pseg.com/",
      "https://companiesmarketcap.com/public-service-enterprise-group/marketcap/"
    ],
    "notes": "Queued from the May 25, 2026 S&P 500 market-cap snapshot ranks 226-250."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "PSE&G Electric Service"
    },
    {
      "name": "PSE&G Gas Service"
    }
  ],
  "knownSourceUrls": [
    "https://investor.pseg.com/",
    "https://nj.pseg.com/",
    "https://companiesmarketcap.com/public-service-enterprise-group/marketcap/"
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
