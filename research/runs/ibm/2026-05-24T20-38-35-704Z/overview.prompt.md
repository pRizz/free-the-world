You are preparing structured draft research for the Free The World registry.

Company: IBM (IBM)
Slug: ibm
Sector: information-technology
Industry: software-cloud
Snapshot note: Pending first structured sync.

Known products from repo context:
Red Hat OpenShift, watsonx

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
    "slug": "ibm",
    "name": "IBM",
    "ticker": "IBM",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "information-technology",
    "industryId": "software-cloud",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/ibm/marketcap/",
    "description": "IBM provides hybrid cloud, artificial intelligence, consulting, infrastructure, and enterprise software products and services.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Red Hat OpenShift",
      "watsonx"
    ],
    "seedSourceUrls": [
      "https://www.ibm.com/investor",
      "https://www.ibm.com/products",
      "https://companiesmarketcap.com/ibm/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Red Hat OpenShift"
    },
    {
      "name": "watsonx"
    }
  ],
  "knownSourceUrls": [
    "https://www.ibm.com/investor",
    "https://www.ibm.com/products",
    "https://companiesmarketcap.com/ibm/marketcap/"
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
