# Free The World

Free The World is a SolidJS research site that tracks which large companies still capture massive value from products and services that are becoming easier to replace with open, automated, federated, or Bitcoin-native alternatives.

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

## Build

```bash
bun run build
```

The build pipeline:

1. builds the Solid app
2. uses `scripts/export-static.ts` to render static HTML for all seeded routes
3. writes the deployable artifact to `.output/public`
4. creates `.nojekyll` for GitHub Pages compatibility

Nitro is only used to build the server runtime and client assets that power the custom exporter. Static HTML generation in this repo comes from `scripts/export-static.ts`, not Nitro prerender.

## GitHub Pages deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which:

1. installs dependencies with Bun
2. validates the JSON content graph
3. runs `typecheck`, unit tests, and Playwright
4. builds the site with a repository-aware `SITE_BASE_PATH`
5. uploads `.output/public`
6. deploys through GitHub Pages

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

Queue a net-new company from a draft manifest file:

```bash
bun run company:queue --manifest=./drafts/some-company.json
```

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

Run the full structured sync pipeline for one company:

```bash
bun run sync:company --company=microsoft --provider=auto --mode=dry-run
```

Generate low-level loop artifacts for every seeded company:

```bash
bun run loop
```

Provider defaults live in `config/ralph.providers.example.json`. Machine-local overrides belong in `.codex/ralph.providers.local.json`.

## Theme

Theme tokens live in `src/lib/theme.ts` and CSS variables in `src/app.css`. The default palette uses near-black violet backgrounds with deep-indigo accents, but the token layer is meant to keep that swappable.
