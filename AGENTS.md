# Repo Guidance

## Company Intake Skill

When the user asks to queue a company, draft a company manifest, or seed companies from an index, sector, region, or arbitrary grouping, consult `.codex/skills/company-manifest-queue/SKILL.md`.

## Intake Flow

- Queue draft manifests in `content/manifests/queue/` with `bun run company:queue --manifest=...`
- Promote queued manifests with `bun run company:init --queued=<slug>`
- Start Ralph sync only after the manifest is canonical

## Cursor Cloud specific instructions

### Project overview

Free The World is a SolidJS (SolidStart/Vinxi) static research site. It tracks large public companies and maps their products against open/free/decentralized alternatives. There is no database, no Docker, and no external services required for local development.

### Key commands

All commands use **Bun** as the runtime and package manager. See `package.json` `scripts` for the full list.

- `bun run dev` — start the Vinxi dev server on port 3000 (auto-compiles content first)
- `bun run lint` — run Biome linter (`biome check .`)
- `bun run typecheck` — compile content graph then run `tsc --noEmit`
- `bun run test` — Bun unit tests across `src/` and `tests/unit/`
- `bun run build` — full static build to `.output/public/`
- `bun run test:e2e` — Playwright E2E tests (Chromium only; auto-builds and starts the static server)

### Non-obvious caveats

- **Build metadata and E2E tests**: The build embeds git commit info by resolving the GitHub repository slug from the git remote URL. In Cloud Agent VMs the remote URL contains an access-token prefix (`https://x-access-token:TOKEN@github.com/...`) that the slug parser does not handle. Set `GITHUB_REPOSITORY=pRizz/free-the-world` when running `bun run build` or `bun run test:e2e` so the 2 smoke tests that check for the commit hash badge pass.
- **Playwright browser**: Chromium must be installed before E2E tests: `bunx playwright install --with-deps chromium`.
- **Content compilation**: `bun run content:compile` generates `src/lib/generated/content-graph.ts` from JSON manifests under `content/`. Both `dev` and `build` scripts run this automatically; you only need to call it manually if you change content JSON and want to typecheck without building.
- **No `.env` required**: The project works without any environment variables for local development. Optional env vars (`SITE_DEPLOY_TARGET`, `SITE_BASE_PATH`, etc.) are only relevant for deploy scripts.
