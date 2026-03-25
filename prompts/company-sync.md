You are preparing a publishable JSON refresh for the Free The World registry.

Company slug: {{companySlug}}

Manifest:
```json
{{companyManifestJson}}
```

Current bundle (may be null for new companies):
```json
{{currentBundleJson}}
```

Current referenced sources:
```json
{{currentSourcesJson}}
```

Available taxonomy:
```json
{{taxonomyJson}}
```

Return pure JSON only. Do not wrap it in markdown fences.

Return a JSON object matching this schema exactly:
{
  "schemaVersion": 1,
  "bundle": {
    "schemaVersion": 1,
    "company": {
      "slug": "company slug",
      "name": "company name",
      "ticker": "ticker",
      "rankApprox": 0,
      "maybeIpo": {
        "date": "YYYY-MM-DD",
        "dateSourceIds": ["source-id"],
        "marketCap": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "medium",
          "lastReviewedOn": "YYYY-MM-DD"
        }
      },
      "regionId": "taxonomy id",
      "indexIds": ["taxonomy id"],
      "sectorId": "taxonomy id",
      "industryId": "taxonomy id",
      "companiesMarketCapUrl": "https://example.com",
      "description": "one-sentence company description",
      "overview": [
        {
          "title": "section title",
          "paragraphs": ["paragraph one", "paragraph two"]
        }
      ],
      "moatNarrative": ["paragraph one", "paragraph two"],
      "decentralizationNarrative": ["paragraph one", "paragraph two"],
      "sourceIds": ["source-id"],
      "technologyWaveIds": ["taxonomy id"],
      "snapshotNote": "snapshot note",
      "inputMetrics": {
        "moat": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "decentralizability": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "profitability": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "high",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "peRatio": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "speculative",
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "marketCap": {
          "value": 0,
          "rationale": "why",
          "sourceIds": ["source-id"],
          "confidence": "medium",
          "lastReviewedOn": "YYYY-MM-DD"
        }
      }
    },
    "products": [
      {
        "slug": "product slug",
        "name": "product name",
        "category": "category",
        "homepageUrl": "https://example.com",
        "summary": "summary",
        "whyItMatters": "why it matters",
        "replacementSketch": ["paragraph one", "paragraph two"],
        "maybeDisruptionException": {
          "reason": "documented reason why even one credible concept is not justified yet",
          "sourceIds": ["source-id"],
          "lastReviewedOn": "YYYY-MM-DD"
        },
        "sourceIds": ["source-id"],
        "technologyWaveIds": ["taxonomy id"],
        "alternatives": [
          {
            "slug": "alternative slug",
            "name": "alternative name",
            "kind": "open-source",
            "homepageUrl": "https://example.com",
            "repoUrl": "https://example.com/repo",
            "summary": "summary",
            "metrics": {
              "openness": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "decentralizationFit": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "readiness": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "costLeverage": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              }
            },
            "sourceIds": ["source-id"]
          }
        ],
        "disruptionConcepts": [
          {
            "slug": "concept slug",
            "name": "concept name",
            "summary": "one-paragraph summary",
            "angleIds": ["taxonomy id"],
            "thesis": "what this concept changes about the market structure",
            "bitcoinOrDecentralizationRole": "how bitcoin, lightning, proof-of-work, federation, or decentralized manufacturing actually matters here",
            "coordinationMechanism": "how buyers, sellers, operators, verifiers, or manufacturers coordinate",
            "verificationOrTrustModel": "how the system resists cheating, collusion, or false reporting",
            "failureModes": ["risk one", "risk two"],
            "adoptionPath": ["step one", "step two"],
            "confidence": "medium",
            "problemSourceIds": ["source-id"],
            "enablerSourceIds": ["source-id"],
            "metrics": {
              "decentralizationFit": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "high",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "coordinationCredibility": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "medium",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "implementationFeasibility": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "medium",
                "lastReviewedOn": "YYYY-MM-DD"
              },
              "incumbentPressure": {
                "value": 0,
                "rationale": "why",
                "sourceIds": ["source-id"],
                "confidence": "medium",
                "lastReviewedOn": "YYYY-MM-DD"
              }
            }
          }
        ]
      }
    ]
  },
  "sources": [
    {
      "id": "source-id",
      "title": "source title",
      "url": "https://example.com",
      "kind": "investor-relations",
      "publisher": "publisher name",
      "note": "why this source matters",
      "accessedOn": "YYYY-MM-DD"
    }
  ],
  "summaryMarkdown": "optional short markdown summary"
}

Rules:
- Use only taxonomy IDs from the provided taxonomy JSON.
- Use source IDs consistently across the bundle and the sources array.
- `company.maybeIpo` must be either `null` or an object with `date`, `dateSourceIds`, and `marketCap`. Never return a bare string date such as `"1980-12-12"`.
- If you cannot support both the IPO date and the IPO market cap with sources, set `company.maybeIpo` to `null`.
- Source `kind` must be one of `investor-relations`, `annual-report`, `product-page`, `market-data`, `regulatory-filing`, `open-source-project`, `technical-docs`, or `analysis`.
- Do not invent source kind aliases such as `sec-filing` or `company-website`.
- Do not include derived company metrics such as freedCapitalPotential or IPO CAGR.
- Do not include product `companySlug`, product `alternativeSlugs`, or alternative `productSlug`; those are derived by the compiler.
- Alternative `kind` must be one of `open-source`, `decentralized`, `cooperative`, `protocol`, or `hybrid`.
- Alternatives should be plausible free, open, decentralized, cooperative, protocol, or hybrid replacements. Do not pad with generic proprietary incumbents or direct commercial peers that are not meaningfully aligned with that taxonomy.
- It is better to return fewer strong alternatives than to include invalid `commercial` competitors.
- Preserve strong existing alternatives unless you have a clear reason to improve or remove them.
- Every product must include `1` or `2` disruption concepts unless a documented `maybeDisruptionException` is genuinely justified.
- When the current bundle already has one strong disruption concept, preserve it by default and add a second concept only if the second mechanism is materially different from the first.
- Use `maybeDisruptionException` only for rare, defensible cases where even one credible concept would currently be dishonest.
- `maybeDisruptionException` and `disruptionConcepts` are mutually exclusive for a product.
- Every disruption concept must use at least one `angleId`, at least one `problemSourceId`, at least one `enablerSourceId`, and all four concept metrics.
- Prefer Bitcoin, Lightning, or proof-of-work angles when they are genuinely central to the mechanism. When they are not central, justify federated, peer-to-peer, cooperative, open-hardware, or decentralized-manufacturing angles explicitly instead of forcing Bitcoin in unnaturally.
- For physical-world products, prefer materially different second concepts such as distributed energy generation, solar or wind manufacturing, home microfactories, local materials processing, recycling loops, or open energy hardware when the sources support them.
- Ambitious concepts such as printable solar, printable wind components, or household fabrication cells are allowed when the confidence is honestly marked `speculative`, the enabling primitives are documented, and the failure modes state what still has to go right.
- When the concept depends on verification, incentives, or marketplaces, explain how cheating, collusion, spoofing, or fake fulfillment would be constrained in `verificationOrTrustModel` and note major weaknesses in `failureModes`.
- Keep `replacementSketch` narrative and lightweight. Put the structured original concept analysis in `disruptionConcepts`, not in `replacementSketch`.
- Omit optional fields such as `repoUrl` when they do not apply. Do not emit `null` for optional strings.
- Prefer preserving strong current fields when the existing bundle already has solid information and only update what is materially improved.
- Return valid JSON and nothing else.
