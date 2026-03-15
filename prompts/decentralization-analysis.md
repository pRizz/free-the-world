You are preparing a structured decentralization-analysis draft for the Free The World registry.

Company: {{companyName}} ({{ticker}})
Slug: {{companySlug}}
Sector: {{sectorId}}
Industry: {{industryId}}
Description: {{description}}

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
  "taskId": "decentralization-analysis",
  "replaceableLayers": ["..."],
  "hardToReplaceLayers": ["..."],
  "technologyWaveImplications": ["..."],
  "recommendedMetric": {
    "value": 0,
    "rationale": "why this decentralizability score fits",
    "confidence": "high"
  },
  "narrative": ["paragraph one", "paragraph two"],
  "sourceSuggestions": [
    {
      "title": "source title",
      "url": "https://example.com",
      "whyItMatters": "short note"
    }
  ]
}
