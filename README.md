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
2. renders static HTML for all seeded routes
3. writes the deployable artifact to `.output/public`
4. creates `.nojekyll` for GitHub Pages compatibility

## GitHub Pages deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which:

1. installs dependencies with Bun
2. builds the site with a repository-aware `SITE_BASE_PATH`
3. uploads `.output/public`
4. deploys through GitHub Pages

## Data model

Canonical site data lives under `src/lib/content/` and is strongly typed via `src/lib/domain/types.ts`.

The current launch snapshot includes:

- top 10 S&P 500 companies by market cap (curated early-2026 snapshot)
- sectors and industries as first-class metadata
- visible source breadcrumbs
- product and alternative analyses
- technology-wave assumptions used in scoring

## Research workflow

The repository separates published content from draft research:

- `src/lib/content/` → canonical typed site data
- `research/` → notes and generated research artifacts
- `prompts/` → reusable prompt templates
- `scripts/ralph-loop.ts` → repeatable AI prompt loop

### Ralph loop

Generate prompt artifacts for one company and task:

```bash
bun run loop --company=microsoft --task=moat-analysis
```

Generate prompt artifacts for every seeded company:

```bash
bun run loop
```

The loop is designed around Claude CLI and Codex CLI, but it degrades gracefully when those binaries are not available. It never writes directly into canonical site content.

## Theme

Theme tokens live in `src/lib/theme.ts` and CSS variables in `src/app.css`. The default palette uses near-black violet backgrounds with deep-indigo accents, but the token layer is meant to keep that swappable.
