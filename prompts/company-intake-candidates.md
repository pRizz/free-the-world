Resolve company intake candidates.

You are given a raw company intake request that may contain company names, tickers, or group phrases.
Expand it into concrete public companies that should enter the validated manifest queue.

Return JSON only in this shape:

```json
{
  "resolved": [
    {
      "sourceItem": "Original raw item",
      "slug": "lowercase-kebab-case-slug",
      "name": "Company Name",
      "ticker": "TICKER"
    }
  ],
  "issues": [
    {
      "sourceItem": "Original raw item",
      "code": "ambiguous",
      "detail": "Why it could not be resolved cleanly."
    }
  ]
}
```

Rules:
- Resolve only real public companies.
- Expand group phrases into individual companies when the grouping is concrete.
- Skip invalid or ambiguous items instead of guessing.
- Never output duplicate companies.
- Use `issues[].code` only from `ambiguous` or `invalid`.
- Keep `sourceItem` equal to the original raw item that produced the resolution or issue.

Request metadata:
- Request id: `{{requestId}}`
- Batch id: `{{batchId}}`
- Group label: `{{groupLabel}}`
- Request notes: `{{requestNotes}}`

Raw request text:
```text
{{rawInput}}
```

Raw items:
```json
{{rawItemsJson}}
```

Already canonical companies:
```json
{{canonicalCompaniesJson}}
```

Already queued companies:
```json
{{queuedCompaniesJson}}
```
