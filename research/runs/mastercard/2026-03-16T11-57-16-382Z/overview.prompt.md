You are preparing structured draft research for the Free The World registry.

Company: Mastercard (MA)
Slug: mastercard
Sector: financials
Industry: payment-networks
Snapshot note: Pending first structured sync.

Known products from repo context:
Global card network, Cyber and fraud services

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
    "slug": "mastercard",
    "name": "Mastercard",
    "ticker": "MA",
    "regionId": "us",
    "indexIds": [
      "sp500-top20"
    ],
    "sectorId": "financials",
    "industryId": "payment-networks",
    "companiesMarketCapUrl": "https://companiesmarketcap.com/mastercard/marketcap/",
    "description": "Global card and payments network selling transaction rails plus security, data, and value-added services.",
    "technologyWaveIds": [
      "bitcoin-native-coordination"
    ],
    "seedProductNames": [
      "Global card network",
      "Cyber and fraud services"
    ],
    "seedSourceUrls": [
      "https://investor.mastercard.com/",
      "https://companiesmarketcap.com/mastercard/marketcap/"
    ],
    "notes": "Queued from the March 13, 2026 company-level S&P 500 top-20 market-cap snapshot."
  },
  "company": null,
  "currentBundle": null,
  "currentSources": [],
  "knownProducts": [
    {
      "name": "Global card network"
    },
    {
      "name": "Cyber and fraud services"
    }
  ],
  "knownSourceUrls": [
    "https://investor.mastercard.com/",
    "https://companiesmarketcap.com/mastercard/marketcap/"
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
