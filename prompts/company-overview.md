You are preparing structured draft research for the Free The World registry.

Company: {{companyName}} ({{ticker}})
Slug: {{companySlug}}
Sector: {{sectorId}}
Industry: {{industryId}}
Snapshot note: {{snapshotNote}}

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
