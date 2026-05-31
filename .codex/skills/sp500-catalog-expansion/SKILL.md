---
name: sp500-catalog-expansion
description: Use when the user wants to continue the Free The World S&P 500 catalog expansion in repeating 25-company cohorts, especially requests like "next batch", "repeat the same process", "publish the completed cohort", or "research the next S&P 500 ranks". This skill covers publishing the already researched dry-run cohort, adding the next taxonomy index, preparing the next frozen roster, running Codex dry-run research, validating, committing, and pushing.
---

# S&P 500 Catalog Expansion

Use this skill to repeat the established S&P 500 expansion workflow. The normal cadence is:

1. Publish the already researched but unpublished 25-company cohort.
2. Verify, commit, and push that publish checkpoint.
3. Add the next `sp500-top<N>` taxonomy index.
4. Prepare the next 25-company frozen roster.
5. Review the generated request before research.
6. Run and watch Codex dry-run research.
7. Verify, commit, and push the dry-run checkpoint.

Default to Codex, `--no-commit=true`, and `--concurrency=5`. Keep the active freeze date from the current expansion series unless the user explicitly changes it.

## Preflight

- Read the current `AGENTS.md` and check `git status --short --branch`.
- Inspect recent S&P commits or `content/manifests/unverified/*.json` to determine:
  - the most recently dry-run but unpublished cohort
  - the next rank window
  - the active freeze date
  - the next taxonomy index ID
- Do not seed a frozen roster from current live ranking pages. Live pages can be used only as sanity checks because they drift.
- Use the repo's existing company intake flow. Do not change CLI flags, schemas, or public TypeScript types.

## Publish The Completed Cohort

Publish with an explicit comma-separated company list, not `--batch-id`, because promoted batches may no longer be in `content/manifests/queue/`.

To build the candidate publish list for a cohort index:

```bash
jq -r 'select((.indexIds // []) | index("sp500-top175")) | .slug' content/manifests/companies/*.json \
  | while IFS= read -r slug; do
      if [ ! -f "content/companies/$slug/bundle.json" ]; then
        printf '%s\n' "$slug"
      fi
    done \
  | paste -sd, -
```

Then publish:

```bash
bun run sync:all --target=all --company=<comma-separated-slugs> --provider=codex --mode=publish --no-commit=true
```

If one company fails, inspect its run directory and retry only that company:

```bash
bun run sync:company --company=<slug> --provider=codex --mode=publish --no-commit=true
```

After publish, run verification:

```bash
bun run content:validate
bun run lint
bun run typecheck
bun run test
GITHUB_REPOSITORY=pRizz/free-the-world bun run build
git status --short --branch
git diff --stat
```

Commit and push the publish checkpoint after a clean diff review.

## Add The Next Index

Add the next `sp500-top<N>` entry after the current highest S&P expansion index in `content/taxonomy/indices.json`.

Use this shape:

```json
{
  "id": "sp500-top200",
  "label": "S&P 500 · Top 200 by market cap",
  "regionId": "us",
  "description": "A curated snapshot of ranks 176-200 in an expansion toward the two hundred largest S&P 500 constituents by market capitalization."
}
```

Only add sector or industry taxonomy IDs when prepare surfaces a specific missing taxonomy gap. Do not pre-add speculative taxonomy.

## Prepare The Next Roster

Start with the frozen-rank prompt:

```bash
bun run company:intake --raw="S&P 500 companies ranked <start>-<end> by market cap as of <freeze-date>" --mode=prepare --provider=codex --already-researched=skip --batch-id=sp500-ranks-<start>-<end>-<freeze-date-slug> --group-label="S&P 500 ranks <start>-<end> by market cap" --request-notes="Freeze ranks <start>-<end> from the same <freeze-date> S&P 500 market-cap snapshot series. Keep the intake roster exact; do not substitute current daily ranks, nearby ranks, or companies already included in earlier cohorts." --loop-tasks=company-overview --concurrency=5
```

Review the printed request before any dry-run:

```bash
jq '{requestId,status,batchId,prepared:(.preparedCandidates|length),skipped:(.skippedItems|length),queued:(.queuedSlugs|length)}' content/manifests/unverified/<request-id>.json
jq -r '.preparedCandidates[] | [.slug,.name,.ticker] | @tsv' content/manifests/unverified/<request-id>.json
```

Continue only when the request has exactly 25 unique new operating companies, zero unexpected skips, and no overlap with already researched earlier cohorts.

If prepare returns live-rank drift, duplicates, fewer than 25 companies, or out-of-window companies, stop before dry-run. Rerun prepare with an explicit frozen roster, preferably newline-separated raw items:

```bash
bun run company:intake --raw=$'Company One (TCKR)\nCompany Two (TCKR)' --mode=prepare --provider=codex --already-researched=skip --batch-id=<batch-id> --group-label="<label>" --request-notes="Use the raw item list as the exact corrected frozen roster." --loop-tasks=company-overview --concurrency=5
```

## Dry-Run Research

Run the reviewed request:

```bash
bun run company:intake --request=<request-id> --mode=dry-run --provider=codex --no-commit=true --concurrency=5
```

Watch the process until it exits. Treat icon warnings and Codex loader warnings as non-fatal unless validation fails.

If one sync fails from timeout or malformed JSON, inspect and retry that company:

```bash
jq '.' research/runs/<slug>/<run-id>/run.manifest.json
jq '.' research/runs/<slug>/<run-id>/*.validation.json
bun run sync:company --company=<slug> --provider=codex --mode=dry-run --no-commit=true
```

If the parent batch aborts after partial success, resume only the remaining companies:

```bash
bun run company:pipeline --company=<comma-separated-remaining-slugs> --skip-loop=true --provider=codex --mode=dry-run --no-commit=true --concurrency=5
```

Before final verification, confirm:

- the unverified request is `status: "completed"`
- `preparedCandidates`, `promotedSlugs`, `completedCompanySlugs`, `lastLoopRunDirs`, and `lastSyncRunDirs` all have count `25`
- every queued slug has exactly one `overview.codex.normalized.json`
- every queued slug has exactly one `company-sync.codex.normalized.json`
- generated `*.stderr.txt` files do not have trailing whitespace

## Final Verification And Commit

Run:

```bash
bun run content:validate
bun run lint
bun run typecheck
bun run test
GITHUB_REPOSITORY=pRizz/free-the-world bun run build
git status --short --branch
git diff --stat
```

Check expected counts:

- published bundles should increase by 25 only after publish checkpoints
- canonical manifests should increase by 25 after dry-run checkpoints

Use a commit message like:

- `Publish S&P 500 ranks 151-175`
- `Prepare S&P 500 ranks 176-200 research`

Push to `main` after validation and diff review.
