Draft company intake manifests.

You are given resolved public companies and the current taxonomy.
Draft minimal valid `CompanyManifest` objects for queueing.

Return JSON only in this shape:

```json
{
  "drafts": [
    {
      "sourceItem": "Original raw item",
      "manifest": {
        "schemaVersion": 1,
        "slug": "company-slug",
        "name": "Company Name",
        "ticker": "TICKER",
        "regionId": "us",
        "indexIds": ["sp500-top20"],
        "sectorId": "information-technology",
        "industryId": "software-cloud",
        "companiesMarketCapUrl": "https://companiesmarketcap.com/company/marketcap/",
        "description": "Short factual description.",
        "technologyWaveIds": [],
        "seedProductNames": ["Primary product"],
        "seedSourceUrls": [
          "https://investor.example.com/",
          "https://companiesmarketcap.com/company/marketcap/"
        ],
        "notes": "Why this company was added."
      }
    }
  ],
  "issues": [
    {
      "sourceItem": "Original raw item",
      "code": "invalid",
      "detail": "Why a valid manifest could not be drafted."
    }
  ]
}
```

Rules:
- Use only taxonomy IDs present in `taxonomyJson`.
- If the taxonomy does not support the company cleanly, return an `invalid` issue instead of inventing IDs.
- Keep descriptions factual and concise.
- Prefer empty `technologyWaveIds` over guessed wave IDs.
- Include `seedProductNames`, `seedSourceUrls`, and `notes` when reasonably available.
- Use `issues[].code` only from `ambiguous` or `invalid`.
- Keep `sourceItem` equal to the original raw item that led to the manifest.

Request metadata:
- Request id: `{{requestId}}`
- Batch id: `{{batchId}}`
- Group label: `{{groupLabel}}`
- Request notes: `{{requestNotes}}`

Resolved candidates:
```json
{{resolvedCandidatesJson}}
```

Taxonomy:
```json
{{taxonomyJson}}
```

Example manifests:
```json
{{manifestExamplesJson}}
```
