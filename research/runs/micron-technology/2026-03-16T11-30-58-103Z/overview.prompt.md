You are preparing structured draft research for the Free The World registry.

Company: Micron Technology (MU)
Slug: micron-technology
Sector: information-technology
Industry: semiconductors
Snapshot note: Pending first structured sync.

Known products from repo context:
DRAM memory, NAND storage

Relevant technology waves:
- Printed electronics and PCB tooling: PCB fabrication, chip packaging, and increasingly automated electronics assembly continue shrinking the distance between prototype and local production.

Available repo context:
```json
{
  "target": {
    "source": "queued",
    "batchId": "sp500-top20-2026-03-15",
    "createdOn": "2026-03-15T19:27:06.691Z",
    "groupLabel": "S&P 500 Top 20 by market cap",
    "requestNotes": "FinanceCharts screener \"Biggest companies in S&P 500 by market cap\" (https://financecharts.com/screener/biggest-companies-in-sp500?view=market_cap), company-level snapshot updated 2026-03-13 and accessed 2026-03-15."
  },
  "manifest": {
    "schemaVersion": 1,
    "slug": "micron-technology",
    "name": "Micron Technology",
    "ticker": "MU",
    "regionId": "us",
    "indexIds": [
      "sp500-top20"
    ],
    "sectorId": "information-technology",
    "industryId": "semiconductors",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/micron-technology/marketcap/",
    "description": "Memory and storage semiconductor company focused on DRAM, NAND, and high-bandwidth memory.",
    "technologyWaveIds": [
      "printed-electronics"
    ],
    "seedProductNames": [
      "DRAM memory",
      "NAND storage"
    ],
    "seedSourceUrls": [
      "https://investors.micron.com/",
      "https://companiesmarketcap.com/micron-technology/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 company-level S&P 500 top-20 market-cap snapshot."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "DRAM memory"
    },
    {
      "name": "NAND storage"
    }
  ],
  "knownSourceUrls": [
    "https://investors.micron.com/",
    "https://companiesmarketcap.com/micron-technology/marketcap/"
  ],
  "technologyWaves": [
    {
      "id": "printed-electronics",
      "label": "Printed electronics and PCB tooling",
      "summary": "PCB fabrication, chip packaging, and increasingly automated electronics assembly continue shrinking the distance between prototype and local production.",
      "implications": [
        "Incumbents with hardware lock-in should be evaluated against a future of much cheaper custom electronics.",
        "Pick-and-place automation lowers the coordination cost for distributed manufacturing cells.",
        "The most durable hardware moats may migrate toward fabs, ecosystems, and compliance rather than assembly itself."
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
