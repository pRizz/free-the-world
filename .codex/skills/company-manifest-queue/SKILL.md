---
name: company-manifest-queue
description: Use when the user wants to draft or queue new company manifests for this repo, either for one company or a confirmed batch from an index, sector, region, or arbitrary grouping. It maps draft company data onto the repo's CompanyManifest schema and stages queue entries with `bun run company:queue` instead of writing canonical manifests directly.
---

# Company Manifest Queue

Use this skill for net-new company intake. The goal is to create valid `CompanyManifest` drafts and stage them in `content/manifests/queue/`, not to publish canonical manifests directly.

## Source of Truth

Before drafting anything, read these repo files:

- `src/lib/domain/content-types.ts` for the `CompanyManifest` contract
- `content/taxonomy/regions.json`
- `content/taxonomy/indices.json`
- `content/taxonomy/sectors.json`
- `content/taxonomy/industries.json`
- `content/taxonomy/technology-waves.json`
- 2-3 examples from `content/manifests/companies/*.json`
- `scripts/company-queue.ts` and `scripts/company-init.ts` for the intake flow

Do not invent taxonomy IDs. If the repo taxonomy does not support the requested company cleanly, surface that gap instead of guessing.

## Modes

### Single-company intake

Use when the user names one company or ticker.

Collect or confirm:

- company name and ticker
- slug
- region, index, sector, industry
- CompaniesMarketCap URL
- short company description
- relevant technology wave IDs
- optional IPO metadata
- optional seed product names
- optional seed source URLs
- notes that explain why this company is entering the queue

### Batch intake

Use when the user wants a set of companies from an index, sector, region, theme, or arbitrary grouping.

Workflow:

1. Resolve the candidate list first.
2. Confirm or narrow the list with the user if the grouping is ambiguous.
3. Draft one manifest per confirmed company.
4. Stage them with a consistent `--batch-id` and `--group-label`.

Do not queue ambiguous candidates without confirmation.

## Queueing Rules

- Check `content/manifests/companies/` and `content/manifests/queue/` first.
- If a slug is already canonical or already queued, stop and tell the user unless they explicitly asked to replace it.
- Write plain `CompanyManifest` draft JSON first.
- Stage drafts with `bun run company:queue --manifest=...`.
- In batch mode, include `--batch-id`, `--group-label`, and `--request-notes` when useful.
- End by telling the user the next command: `bun run company:init --queued=<slug>`.
- Mention the follow-up Ralph step after promotion: `bun run sync:company --company=<slug> --mode=dry-run`.

## Guardrails

- Never write directly to `content/manifests/companies/` from this skill.
- Prefer factual notes over narrative prose.
- Keep `seedProductNames` and `seedSourceUrls` as hints, not exhaustive research.
- If the taxonomy is missing the needed sector, industry, index, region, or wave, stop and surface the exact missing IDs instead of creating ad hoc values.
