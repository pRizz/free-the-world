You are preparing structured draft research for the Free The World registry.

Company: Qualcomm (QCOM)
Slug: qualcomm
Sector: information-technology
Industry: semiconductors
Snapshot note: Pending first structured sync.

Known products from repo context:
Snapdragon, Qualcomm 5G Modem-RF

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
    "slug": "qualcomm",
    "name": "Qualcomm",
    "ticker": "QCOM",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "information-technology",
    "industryId": "semiconductors",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/qualcomm/marketcap/",
    "description": "Qualcomm develops wireless semiconductor platforms, modems, processors, and related technologies for mobile, automotive, IoT, and edge devices.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Snapdragon",
      "Qualcomm 5G Modem-RF"
    ],
    "seedSourceUrls": [
      "https://investor.qualcomm.com/",
      "https://www.qualcomm.com/products",
      "https://companiesmarketcap.com/qualcomm/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Snapdragon"
    },
    {
      "name": "Qualcomm 5G Modem-RF"
    }
  ],
  "knownSourceUrls": [
    "https://investor.qualcomm.com/",
    "https://www.qualcomm.com/products",
    "https://companiesmarketcap.com/qualcomm/marketcap/"
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
