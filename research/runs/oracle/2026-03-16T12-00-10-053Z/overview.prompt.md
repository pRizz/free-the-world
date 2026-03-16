You are preparing structured draft research for the Free The World registry.

Company: Oracle (ORCL)
Slug: oracle
Sector: information-technology
Industry: software-cloud
Snapshot note: Pending first structured sync.

Known products from repo context:
Oracle Database, Oracle Cloud Infrastructure

Relevant technology waves:
- Bitcoin and Lightning as coordination rails: Proof-of-work economics, programmable payment flows, and anti-spam pricing make more digital systems capable of rewarding signal while resisting abuse.

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
    "slug": "oracle",
    "name": "Oracle",
    "ticker": "ORCL",
    "regionId": "us",
    "indexIds": [
      "sp500-top20"
    ],
    "sectorId": "information-technology",
    "industryId": "software-cloud",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/oracle/marketcap/",
    "description": "Enterprise database, applications, and cloud infrastructure company with deep large-account entrenchment.",
    "technologyWaveIds": [
      "bitcoin-native-coordination"
    ],
    "seedProductNames": [
      "Oracle Database",
      "Oracle Cloud Infrastructure"
    ],
    "seedSourceUrls": [
      "https://www.oracle.com/investor/",
      "https://companiesmarketcap.com/oracle/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 company-level S&P 500 top-20 market-cap snapshot."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Oracle Database"
    },
    {
      "name": "Oracle Cloud Infrastructure"
    }
  ],
  "knownSourceUrls": [
    "https://www.oracle.com/investor/",
    "https://companiesmarketcap.com/oracle/marketcap/"
  ],
  "technologyWaves": [
    {
      "id": "bitcoin-native-coordination",
      "label": "Bitcoin and Lightning as coordination rails",
      "summary": "Proof-of-work economics, programmable payment flows, and anti-spam pricing make more digital systems capable of rewarding signal while resisting abuse.",
      "implications": [
        "Platforms that monetize gatekeeping could face pressure from protocol-native payment and reputation layers.",
        "Micropayments can replace some ad-funded or subscription-heavy distribution models.",
        "Open systems with credible anti-spam economics deserve a higher decentralizability score than legacy software assumptions suggest."
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
