# Free The World

[![OpenLinks Site](https://openlinks.us/badges/openlinks.svg)](https://openlinks.us/)

Free The World is a SolidJS research site that tracks which large companies still capture massive value from products and services that are becoming easier to replace with open, automated, federated, or Bitcoin-native alternatives.

## Live sites

- Primary site: [freetheworld.ai](https://freetheworld.ai)
- GitHub Pages mirror: [prizz.github.io/free-the-world](https://prizz.github.io/free-the-world/)

## Stack

- SolidStart
- Bun
- Tailwind CSS
- shadcn-style UI patterns with typed utility components
- Static export for GitHub Pages

## Local development

```bash
bun install
bun run dev
```

## Local verification

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

The initial Biome rollout is intentionally code-scoped. It covers the TypeScript/TSX app, scripts,
tests, and root config files, while leaving editorial content under `content/`, generated runtime
data under `src/lib/generated/`, and build/deploy artifacts outside the lint baseline for now.

## Build

```bash
bun run build
```

The build pipeline:

1. builds the Solid app
2. prerenders the route set from `src/lib/site-routes.ts`
3. writes the deployable artifact to `.output/public`
4. creates `.nojekyll` for GitHub Pages compatibility

`scripts/build-site.ts` is the canonical build entrypoint. The legacy `scripts/export-static.ts` command is kept as a compatibility alias to the same flow.

## GitHub Pages deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which:

1. installs dependencies with Bun
2. validates the JSON content graph
3. runs `typecheck`, unit tests, and Playwright
4. builds two target-specific artifacts under `.artifacts/deploy/`
5. deploys the primary canonical `https://freetheworld.ai` root-path build to AWS/CloudFront while keeping `https://free-the-world.com` live on the same stack
6. deploys the repo-path mirror to GitHub Pages only when the live Pages manifest has changed

Deployment runbook: `docs/deployment.md`

The `.ai` domain rollout is staged so repo changes can land before Route 53 registration or delegation finishes. Until the new hosted zones exist, the AWS setup/bootstrap scripts stay in report-only mode and the verification command surfaces a domain-readiness blocker instead of a generic fetch error.

## Data model

Canonical editorial data lives under `content/` as validated JSON and is compiled into `src/lib/generated/content-graph.ts` for app/runtime use. UI-domain types still live under `src/lib/domain/types.ts`.

The current launch snapshot includes:

- top 10 S&P 500 companies by market cap (curated early-2026 snapshot)
- sectors and industries as first-class metadata
- visible source breadcrumbs
- product and alternative analyses
- technology-wave assumptions used in scoring

## Research workflow

The repository separates published content from draft research:

- `content/` → canonical JSON content and taxonomy
- `src/lib/generated/content-graph.ts` → generated runtime graph for the app
- `research/` → notes and tracked research run artifacts
- `prompts/` → reusable prompt templates
- `scripts/compile-content.ts` → validator/compiler for raw content
- `scripts/ralph-loop.ts` → low-level repeatable AI prompt loop
- `scripts/sync-company.ts` / `scripts/sync-all.ts` → structured research-to-publish commands

Core content commands:

```bash
bun run migrate:content
bun run content:validate
bun run content:compile
```

### Company intake

Repo-local manifest intake guidance lives in `.codex/skills/company-manifest-queue/SKILL.md`.

Start from raw names, tickers, or group phrases and let the repo create an unverified request,
prepare validated queue entries, and optionally hand off to the full pipeline:

```bash
bun run company:intake --raw="Visa, Oracle, next 10 S&P 500 companies" --mode=prepare --provider=auto
```

`company:intake` writes repo-tracked unverified requests to `content/manifests/unverified/` and
local run summaries to `.codex/logs/company-intake/<request-id>/summary.{json,md}`.
Use `--already-researched=refresh` when you want companies with published bundles to be re-run
through the research pipeline instead of being skipped.

Resume a prepared request and run research without publishing:

```bash
bun run company:intake --request=<request-id> --mode=dry-run --provider=auto
```

Resume a prepared request and publish website content:

```bash
bun run company:intake --request=<request-id> --mode=publish --provider=auto --no-commit=true
```

`company:intake` defaults to:

- `--mode=prepare`
- `--provider=auto`
- `--loop-tasks=company-overview`
- `--concurrency=5`
- `--already-researched=skip`
- `--no-commit=true`

Queue a net-new company from a draft manifest file:

```bash
bun run company:queue --manifest=./drafts/some-company.json
```

Queue, promote, run a lightweight Ralph loop, and kick off structured sync in one command:

```bash
bun run company:pipeline --manifest=./drafts/some-company.json --batch-id=top25-refresh --group-label="S&P 500 Top 25 refresh" --request-notes="Frozen market-cap snapshot." --provider=auto
```

`company:pipeline` defaults to:

- `--loop-tasks=company-overview`
- `--concurrency=5`
- `--mode=dry-run`
- `--no-commit=true`

Use `--batch-id=<id>` by itself to process an already queued batch. `--concurrency=<n>` applies to the low-level loop phase and to `dry-run` syncs; `publish` syncs still run serially even if you request a higher concurrency.

Use `--mode=publish --no-commit=false` only when you are ready to persist website content and push it.

Promote a queued manifest into the canonical manifest set:

```bash
bun run company:init --queued=some-company
```

If you need to bypass the queue and promote a manifest file directly:

```bash
bun run company:init --manifest=./some-company.json
```

After promotion, run the normal Ralph sync:

```bash
bun run sync:company --company=some-company --provider=auto --mode=dry-run
```

### Ralph loop

Generate prompt artifacts for one company and task:

```bash
bun run loop --company=microsoft --task=moat-analysis
```

Execute the low-level loop with a configured provider:

```bash
bun run loop --company=microsoft --task=moat-analysis --provider=auto --execute=true
```

The loop runs up to 5 companies in parallel by default. Override that with `--concurrency=<n>` when you want a lower or higher provider fan-out:

```bash
bun run loop --batch-id=top25-refresh --task=company-overview --provider=auto --execute=true --concurrency=10
```

Run the full structured sync pipeline for one company:

```bash
bun run sync:company --company=microsoft --provider=auto --mode=dry-run
```

Generate low-level loop artifacts for every seeded company:

```bash
bun run loop
```

Provider defaults live in `config/ralph.providers.example.json`. Machine-local overrides belong in `.codex/ralph.providers.local.json`.
Claude provider entries can also set `env` overrides; the default profile now disables nonessential traffic and official marketplace autoinstall so Ralph runs are less exposed to local Claude plugin state.

## Theme

Theme tokens live in `src/lib/theme.ts` and CSS variables in `src/app.css`. The default palette uses near-black violet backgrounds with deep-indigo accents, but the token layer is meant to keep that swappable.
