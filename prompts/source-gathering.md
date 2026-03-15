You are preparing a structured source-gathering draft for the Free The World registry.

Company: {{companyName}} ({{ticker}})
Slug: {{companySlug}}
Description: {{description}}

Known products from repo context:
{{productNames}}

Relevant technology waves:
{{technologyWaves}}

Available repo context:
```json
{{companyDataJson}}
```

Return pure JSON only. Do not wrap it in markdown fences.

JSON schema:
{
  "schemaVersion": 1,
  "taskId": "source-gathering",
  "groups": [
    {
      "label": "company overview",
      "sources": [
        {
          "title": "source title",
          "url": "https://example.com",
          "kind": "investor-relations",
          "publisher": "publisher name",
          "whyItMatters": "short note"
        }
      ]
    }
  ]
}

Requirements:
- Prefer official company pages, investor relations, annual reports, companiesmarketcap, product pages, technical docs, and reputable open-source project homepages/repos.
- Avoid fabricated citations.
