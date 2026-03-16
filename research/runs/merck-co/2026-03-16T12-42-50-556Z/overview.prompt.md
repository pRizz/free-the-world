You are preparing structured draft research for the Free The World registry.

Company: Merck & Co. (MRK)
Slug: merck-co
Sector: health-care
Industry: pharmaceuticals
Snapshot note: Pending first structured sync.

Known products from repo context:
Keytruda, Gardasil

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
    "slug": "merck-co",
    "name": "Merck & Co.",
    "ticker": "MRK",
    "regionId": "us",
    "indexIds": [
      "sp500-top35"
    ],
    "sectorId": "health-care",
    "industryId": "pharmaceuticals",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/merck/marketcap/",
    "description": "Pharmaceutical company focused on oncology, vaccines, animal health, and specialty medicines.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Keytruda",
      "Gardasil"
    ],
    "seedSourceUrls": [
      "https://investors.merck.com/",
      "https://www.merck.com/",
      "https://companiesmarketcap.com/merck/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 FinanceCharts S&P 500 market-cap snapshot ranks 26-35."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Keytruda"
    },
    {
      "name": "Gardasil"
    }
  ],
  "knownSourceUrls": [
    "https://investors.merck.com/",
    "https://www.merck.com/",
    "https://companiesmarketcap.com/merck/marketcap/"
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
