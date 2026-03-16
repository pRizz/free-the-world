You are preparing structured draft research for the Free The World registry.

Company: Eli Lilly (LLY)
Slug: eli-lilly
Sector: health-care
Industry: pharmaceuticals
Snapshot note: Pending first structured sync.

Known products from repo context:
Mounjaro, Zepbound

Relevant technology waves:
None mapped yet in repo context.

Available repo context:
```json
{
  "target": {
    "source": "queued",
    "batchId": "sp500-top20-2026-03-15",
    "createdOn": "2026-03-15T19:27:06.552Z",
    "groupLabel": "S&P 500 Top 20 by market cap",
    "requestNotes": "FinanceCharts screener \"Biggest companies in S&P 500 by market cap\" (https://financecharts.com/screener/biggest-companies-in-sp500?view=market_cap), company-level snapshot updated 2026-03-13 and accessed 2026-03-15."
  },
  "manifest": {
    "schemaVersion": 1,
    "slug": "eli-lilly",
    "name": "Eli Lilly",
    "ticker": "LLY",
    "regionId": "us",
    "indexIds": [
      "sp500-top20"
    ],
    "sectorId": "health-care",
    "industryId": "pharmaceuticals",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/eli-lilly/marketcap/",
    "description": "Pharmaceutical company centered on diabetes, obesity, oncology, immunology, and neuroscience therapies.",
    "technologyWaveIds": [],
    "seedProductNames": [
      "Mounjaro",
      "Zepbound"
    ],
    "seedSourceUrls": [
      "https://investor.lilly.com/",
      "https://companiesmarketcap.com/eli-lilly/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 company-level S&P 500 top-20 market-cap snapshot."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Mounjaro"
    },
    {
      "name": "Zepbound"
    }
  ],
  "knownSourceUrls": [
    "https://investor.lilly.com/",
    "https://companiesmarketcap.com/eli-lilly/marketcap/"
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
