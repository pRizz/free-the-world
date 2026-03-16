You are preparing structured draft research for the Free The World registry.

Company: Exxon Mobil (XOM)
Slug: exxon-mobil
Sector: energy
Industry: integrated-oil-gas
Snapshot note: Pending first structured sync.

Known products from repo context:
Upstream production, Exxon and Mobil fuels

Relevant technology waves:
- Printable solar, localized wind, and home energy stacks: Cheaper distributed generation and better local energy management create more openings for community-scale infrastructure and self-custodied resilience.

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
    "slug": "exxon-mobil",
    "name": "Exxon Mobil",
    "ticker": "XOM",
    "regionId": "us",
    "indexIds": [
      "sp500-top20"
    ],
    "sectorId": "energy",
    "industryId": "integrated-oil-gas",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/exxon-mobil/marketcap/",
    "description": "Integrated energy company spanning upstream production, refining, chemicals, and fuel distribution.",
    "technologyWaveIds": [
      "distributed-energy"
    ],
    "seedProductNames": [
      "Upstream production",
      "Exxon and Mobil fuels"
    ],
    "seedSourceUrls": [
      "https://corporate.exxonmobil.com/",
      "https://companiesmarketcap.com/exxon-mobil/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 company-level S&P 500 top-20 market-cap snapshot."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Upstream production"
    },
    {
      "name": "Exxon and Mobil fuels"
    }
  ],
  "knownSourceUrls": [
    "https://corporate.exxonmobil.com/",
    "https://companiesmarketcap.com/exxon-mobil/marketcap/"
  ],
  "technologyWaves": [
    {
      "id": "distributed-energy",
      "label": "Printable solar, localized wind, and home energy stacks",
      "summary": "Cheaper distributed generation and better local energy management create more openings for community-scale infrastructure and self-custodied resilience.",
      "implications": [
        "Energy-related products should be viewed through interoperability and open-control surfaces.",
        "Battery, charging, and home automation layers are increasingly separable from single-vendor stacks.",
        "Incumbents that depend on closed energy ecosystems may look less inevitable over time."
      ]
    }
  ]
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
