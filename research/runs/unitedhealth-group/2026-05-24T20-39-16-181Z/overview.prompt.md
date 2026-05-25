You are preparing structured draft research for the Free The World registry.

Company: UnitedHealth Group (UNH)
Slug: unitedhealth-group
Sector: health-care
Industry: managed-health-care
Snapshot note: Pending first structured sync.

Known products from repo context:
UnitedHealthcare, Optum

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
    "slug": "unitedhealth-group",
    "name": "UnitedHealth Group",
    "ticker": "UNH",
    "regionId": "us",
    "indexIds": [
      "sp500-top50"
    ],
    "sectorId": "health-care",
    "industryId": "managed-health-care",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/united-health/marketcap/",
    "description": "UnitedHealth Group is a U.S. health care company providing health benefits through UnitedHealthcare and health services through Optum.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "UnitedHealthcare",
      "Optum"
    ],
    "seedSourceUrls": [
      "https://www.unitedhealthgroup.com/investors.html",
      "https://www.unitedhealthgroup.com/what-we-do.html",
      "https://companiesmarketcap.com/united-health/marketcap/"
    ],
    "notes": "Queued from the 2026-05-24 S&P 500 top-50 market-cap cohort refresh."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "UnitedHealthcare"
    },
    {
      "name": "Optum"
    }
  ],
  "knownSourceUrls": [
    "https://www.unitedhealthgroup.com/investors.html",
    "https://www.unitedhealthgroup.com/what-we-do.html",
    "https://companiesmarketcap.com/united-health/marketcap/"
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
