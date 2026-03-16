---
name: company-manifest-queue
description: Use when the user wants to draft or queue new company manifests for this repo, either for one company or a confirmed batch from an index, sector, region, or arbitrary grouping. It maps draft company data onto the repo's CompanyManifest schema and stages queue entries with `bun run company:queue` instead of writing canonical manifests directly.
---

# Company Manifest Queue

Use this skill for net-new company intake. The goal is to create valid `CompanyManifest` drafts and stage them in `content/manifests/queue/`, not to publish canonical manifests directly.

If the user only gives raw company names, tickers, or group phrases, route that request through `bun run company:intake --mode=prepare` instead of requiring a full manifest draft up front.

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

1. If the user provided only raw names, tickers, or a group phrase, start with `bun run company:intake --mode=prepare`.
2. Confirm or narrow the list with the user if the grouping is ambiguous and they want manual control.
3. Draft one manifest per confirmed company.
4. Stage them with a consistent `--batch-id` and `--group-label`.

Do not queue ambiguous candidates without confirmation.

## Queueing Rules

- Check `content/manifests/companies/` and `content/manifests/queue/` first.
- If a slug is already canonical or already queued, stop and tell the user unless they explicitly asked to replace it.
- Write plain `CompanyManifest` draft JSON first.
- Stage drafts with `bun run company:queue --manifest=...`.
- For raw intake requests, let `company:intake` create `content/manifests/unverified/<request-id>.json`, resolve candidates, and queue only the manifests that validate cleanly.
- In batch mode, include `--batch-id`, `--group-label`, and `--request-notes` when useful.
- If the user wants the whole intake flow handled end-to-end, prefer `bun run company:pipeline --manifest=... --provider=auto` instead of stopping after queueing.
- If the user wants the raw-intake flow handled end-to-end, prefer `bun run company:intake --raw=... --mode=dry-run --provider=auto` or `--mode=publish` when they explicitly asked for publication.
- Otherwise end by telling the user the next command: `bun run company:init --queued=<slug>`.
- Mention the follow-up Ralph step after promotion: `bun run sync:company --company=<slug> --mode=dry-run`.

After a `company:intake --mode=prepare` run, the normal inline follow-up is:

- queue/prepared only
- research dry-run
- publish website

If the user already requested dry-run or publish in the original prompt, skip that follow-up and honor the requested end state directly.

## Guardrails

- Never write directly to `content/manifests/companies/` from this skill.
- Prefer factual notes over narrative prose.
- Keep `seedProductNames` and `seedSourceUrls` as hints, not exhaustive research.
- If the taxonomy is missing the needed sector, industry, index, region, or wave, stop and surface the exact missing IDs instead of creating ad hoc values.
