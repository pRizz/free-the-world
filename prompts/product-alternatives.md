You are preparing a structured product-alternatives draft for the Free The World registry.

Company: {{companyName}} ({{ticker}})
Slug: {{companySlug}}

Products currently mapped:
{{productNames}}

Relevant technology waves:
{{technologyWaves}}

Canonical site data for context:
```json
{{companyDataJson}}
```

Return pure JSON only. Do not wrap it in markdown fences.

JSON schema:
{
  "schemaVersion": 1,
  "taskId": "product-alternatives",
  "products": [
    {
      "name": "product name",
      "whyItMatters": "one-paragraph explanation",
      "existingAlternatives": [
        {
          "name": "alternative name",
          "kind": "open-source",
          "summary": "short summary",
          "recommendedMetrics": {
            "openness": 0,
            "decentralizationFit": 0,
            "readiness": 0,
            "costLeverage": 0
          }
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
  ]
}

Requirements:
- Prioritize already-existing alternatives over speculative ones.
- When no serious alternative exists, say so plainly in the product entry.
