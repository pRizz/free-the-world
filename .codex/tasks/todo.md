# UI Standardization Refactor

- [x] Bootstrap dependencies and capture the current verification baseline.
  Verification: `bun install`, `bun run typecheck`, `bun run build`
  Notes: `typecheck` already fails in `scripts/export-static.ts` due to a generated import; `build` emits output but Nitro logs pre-existing prerender `Invalid URL` errors.
- [x] Replace `src/components/ui.tsx` with per-component primitives in `src/components/ui/`.
  Verification: imports compile without the legacy barrel.
- [x] Add reusable block components in `src/components/blocks/`.
  Verification: route and feature components consume shared blocks for repeated card/header/state patterns.
- [x] Split `src/components/company-panels.tsx` into smaller focused modules.
  Verification: the old file is removed and all imports resolve to the new modules.
- [x] Migrate routes and feature components to the new primitives and blocks.
  Verification: no imports from `~/components/ui` remain.
- [x] Run final verification and review the diff for unintended regressions.
  Verification: `bun run typecheck`, `bun run build`, targeted visual/code diff review.

Completion review:
- The app now uses per-component UI primitives under `src/components/ui/`, block-level composables under `src/components/blocks/`, and split company panel modules under `src/components/company-panels/`.
- `bun run typecheck` passes.
- `bun run build` completes and exports `.output/public`; route smoke checks confirmed the expected HTML exists for `/`, `/about`, `/methodology`, `/companies`, `/companies/apple`, `/companies/apple/products`, `/companies/apple/products/apple-icloud`, and `/404.html`.

Residual risks:
- Nitro still logs pre-existing prerender `Invalid URL` errors during `bun run build`. The export step still produces `.output/public`, but that issue is outside this refactor and should be fixed separately.

# IPO-Derived Market Cap Metrics

- [x] Add IPO metadata and derived IPO finance metrics to the canonical company model.
  Verification: `bun run typecheck`
- [x] Wire IPO metrics into formatting, registry sorting, and missing-value rendering.
  Verification: `bun run typecheck`, targeted registry assertions
- [x] Add unit tests for IPO math and synthetic missing-metric sorting behavior.
  Verification: `bun test src/lib/domain/ipo.test.ts src/lib/domain/company-metrics.test.ts`
- [x] Add targeted Playwright coverage for the new registry columns and sample rendered values.
  Verification: `CI=1 bun run test:e2e --grep "IPO|company detail page renders the Apple overview|registry search filters the company table"`

Completion review:
- Added `maybeIpo` metadata, three IPO-derived company metrics, and a pure IPO math helper so the registry can compute and render IPO market cap, return multiplier, and IPO CAGR without introducing a second data path.
- Populated IPO data for all seeded companies with auditable IPO references where available, and left Berkshire Hathaway explicitly `null` so missing future/private-company IPO data is handled cleanly.
- Updated registry sorting/formatting to keep missing values at the bottom and added unit plus Playwright coverage for the new metrics.

Residual risks:
- The existing `bun run build` path still emits the repo's pre-existing Nitro `Invalid URL` prerender warnings before static export completes. Targeted Playwright coverage still passes against the exported output, and that warning remains outside this feature.

# Basic Playwright Coverage

- [x] Add Playwright dependency, scripts, config, and static-server test wiring.
  Verification: `bun install`, `bun run test:e2e:install`
- [x] Add basic e2e specs for route smoke coverage, company detail smoke coverage, and registry search filtering.
  Verification: `bun run test:e2e`
- [x] Add CI workflow and finish a full verification pass.
  Verification: `bun run typecheck`, `bun run test:e2e`, workflow review

Completion review:
- Added a Chromium-only `@playwright/test` setup that builds the app, serves `.output/public` over a local static server, and covers top-level route smoke checks plus registry search and nested company/product route smoke checks.
- Added a dedicated GitHub Actions workflow for Playwright and ignored generated Playwright artifacts.
- Improved the registry count with a `role="status"` live region so the count assertion is accessible, and switched `scripts/export-static.ts` to a typed dynamic import so `bun run typecheck` succeeds before and after builds.

Residual risks:
- `bun run build` still logs the repo's pre-existing Nitro prerender `Invalid URL` errors before the custom export script writes the static output. The Playwright suite passes against the exported site, but that build-time warning remains unresolved.

# Table Edge Overflow Hint

- [x] Add animated left/right overflow hints to the shared table primitive.
  Verification: `src/components/ui/table.tsx` now tracks horizontal overflow and renders edge overlays by default, with `edgeFade={false}` available as an opt-out.
- [x] Add shared CSS for the subtle blur/fade edge treatment.
  Verification: `src/app.css` now defines the edge overlay visuals and opacity transition.
- [x] Verify overflow and non-overflow states.
  Verification: `bun run typecheck`, `bun run build`, and Playwright checks confirmed the registry table reports `left=false/right=true` at start, `true/true` mid-scroll, `true/false` at the far right, and the alternatives table reports `false/false` when fully fitting. Overlay DOM also reports `pointer-events: none` and `aria-hidden="true"`.

# Table Edge Blur Production Fix

- [x] Move the table edge blur off CSS and onto the overlay elements so export/build output keeps the blur in Chrome.
  Verification: `src/components/ui/table.tsx` now applies inline blur styles directly to both overlays, and `src/app.css` keeps only layout/transition/gradient behavior with an explicit overlay `z-index`.

# Table Edge Blur Polish

- [x] Taper the blur itself toward the table interior and overscan the overlay geometry so the shell edge is fully covered.
  Verification: `src/components/ui/table.tsx` now applies left/right mask images inline, and `src/app.css` overscans the overlay past the shell bounds while keeping the tint falloff aligned with the blur taper.
- [x] Extend the blur reach about 40% farther into the table without changing the overflow logic or mask behavior.
  Verification: `src/app.css` now uses a wider shared edge width token for the table fade overlay.
- [x] Reduce the table edge tint opacity substantially while keeping the same blur width and taper.
  Verification: `src/app.css` now uses much lighter `color-mix(...)` stops for both left and right edge gradients.
- [x] Disable the table edge tint entirely and leave only the blur treatment active.
  Verification: `src/app.css` now uses transparent backgrounds for both edge overlays while `src/components/ui/table.tsx` continues to provide the blur and mask taper.

# Compact Sticky Shell Refactor

- [x] Refactor the shared shell header into a compact sticky nav across breakpoints.
  Verification: `src/components/site-shell.tsx` contains only brand, nav, and newsletter CTA in the sticky shell, with no global explanatory paragraph.
- [x] Add a collapsible mobile navigation that stays closed by default and closes on route changes.
  Verification: mobile shell exposes a menu toggle and collapses its nav panel after navigation.
- [x] Extend Playwright coverage for the shell behavior on mobile and desktop.
  Verification: `tests/e2e/smoke.spec.ts` covers collapsed mobile state, menu open/close behavior, route-change close behavior, desktop inline nav, and mobile header compactness.
- [x] Run final verification and review for unintended side effects.
  Verification: `bun run typecheck`, `bun run test:e2e`, diff review.

Completion review:
- Replaced the sticky multi-row explainer card with a tighter shell-level nav that keeps the brand, primary links, and newsletter CTA while dropping the global descriptive copy from the header.
- Added a collapsible mobile menu using the shared collapsible primitive and tied it to route changes so the panel closes after navigation instead of lingering open across pages.
- Extended Playwright smoke coverage to assert the compact mobile default state, menu expansion, route-change close behavior, and desktop inline navigation visibility.

Residual risks:
- `bun run test:e2e` still logs the repo's pre-existing Nitro prerender `Invalid URL` errors during the build step before serving the exported site. The suite passes against the generated static output, but that separate build warning remains unresolved.

# Mobile Table Edge Blur Tuning

- [x] Keep the shared table blur strength unchanged while narrowing the mobile edge overlay width.
  Verification: `src/components/ui/table.tsx` keeps `blur(10px)` for both blur declarations, and `src/app.css` narrows only `--table-edge-width` at `@media (max-width: 639px)`.
- [x] Add a Playwright regression covering the mobile registry table fade.
  Verification: `tests/e2e/registry-mobile.spec.ts` asserts horizontal overflow, unchanged `10px` blur strength, and a fade width narrower than the desktop baseline at `390x844`.
- [x] Run verification and review the diff for unintended side effects.
  Verification: `bun run typecheck`, `bunx playwright test tests/e2e/registry-mobile.spec.ts tests/e2e/registry-ipo.spec.ts --workers=1`, diff review.

Completion review:
- The shared table fade keeps the same 10px blur strength across breakpoints, so the visual treatment stays consistent while the mobile overlay gets narrower.
- Narrow viewports now reduce only the edge overlay width, which reveals more content near the table edges without changing the blur intensity.
- Added a mobile registry Playwright regression that confirms horizontal overflow still exists at `390x844`, the blur remains `10px`, and the overlay is narrower than the desktop baseline.

Residual risks:
- The repo still emits pre-existing Nitro prerender `Invalid URL` warnings during the Playwright build/export step.

# Nitro Prerender Warning Removal

- [x] Stop Nitro from prerendering during `vite build` and keep the custom exporter as the only static HTML generator.
  Verification: `vite.config.ts` now uses `preset: "node-server"` with no Nitro `prerender` config, while `scripts/export-static.ts` still owns static HTML generation.
- [x] Document the build/export split so future config changes do not reintroduce redundant Nitro prerendering.
  Verification: `README.md` now explicitly states static HTML comes from `scripts/export-static.ts`, not Nitro prerender.
- [x] Verify the warning is gone and the exported site contract is unchanged.
  Verification: `bun run typecheck`, `bun run build`, `bun run build > /tmp/free-the-world-build.log 2>&1 && rg -n 'Invalid URL|\\[500\\]|Internal Server Error|prerender' /tmp/free-the-world-build.log`, `bunx playwright test --workers=1`, and file spot-checks under `.output/public`.

Completion review:
- Nitro no longer runs the GitHub Pages static prerender path during `vite build`, so the custom exporter is the single source of static HTML and the old `Invalid URL` / `[500]` build noise is gone.
- The build still writes the deployable site to `.output/public`, and spot checks confirmed `index.html`, `about/index.html`, `methodology/index.html`, `companies/index.html`, `companies/apple/index.html`, `companies/apple/products/apple-icloud/index.html`, and `404.html` are all present.
- `bun run typecheck` passed, `bun run build` passed, and a serial `bunx playwright test --workers=1` passed all 12 tests without the Nitro prerender warnings appearing during Playwright startup.

Residual risks:
- The default parallel `bun run test:e2e` command still intermittently fails in `tests/e2e/registry-ipo.spec.ts` because the IPO sort option is not always visible after keyboard opening. That race is separate from the Nitro warning fix and still needs a dedicated test-stability pass.

# Content-First Ralph Pipeline Refactor

- [x] Add raw JSON content/taxonomy storage plus migration/compile scripts.
  Verification: `bun run migrate:content`, `bun run content:validate`, `bun run content:compile`
- [x] Switch app/runtime/export code from hand-authored TS arrays to the compiled content graph.
  Verification: `bun run typecheck`, `bun run build`
- [x] Replace the Ralph loop with structured run artifacts, provider config, and sync/company init commands.
  Verification: `bun run loop --company=microsoft --task=moat-analysis`, `bun run company:init --help`, `bun run sync:company --help`, `bun run sync:all --help`, `bun run sync:company --company=microsoft --provider=codex --mode=dry-run` via a temporary local replay provider
- [x] Add regression/unit/e2e coverage for schema validation, compiler integrity, and fixture-driven JSON content rendering.
  Verification: `bun test`, `bun run test:e2e`
- [x] Gate deploy/publish on validation and test/build checks, then review for residual risks.
  Verification: workflow review, `bun run content:validate`, `bun run typecheck`, `bun run build`, `bun test`, `bun run test:e2e`

Completion review:
- Editorial and taxonomy data now live under `content/` JSON, compile into `src/lib/generated/content-graph.ts`, and feed the runtime through a single graph accessor instead of hand-authored TS arrays.
- The Ralph tooling now supports manifest-driven onboarding, structured run artifacts under `research/runs/`, JSON-only sync payloads, validator-backed publish checks, and non-shell provider configs with argv-based execution.
- CI now gates GitHub Pages deploys on content validation, typecheck, unit tests, Playwright, and build; selector lookups now fail fast on broken references instead of silently dropping them.

Residual risks:
- The legacy TS content modules still exist as migration input and historical fallback, even though the runtime no longer reads them. A later cleanup can archive or delete them once the migration utility is no longer needed.
- End-to-end provider verification used a temporary local replay provider instead of live Codex or Claude CLI calls, so the repo-level pipeline is verified without external spend but not against live provider behavior in this session.

# Repo-Local Company Intake Skill and Queue

- [x] Add queued manifest storage and raw queue types without changing the canonical manifest contract.
  Verification: `bun run typecheck`, `bun run content:validate`
- [x] Add queue/promotion helpers and extend the intake CLI with `company:queue` and `company:init --queued`.
  Verification: `bun run company:queue --help`, `bun run company:init --help`, `bun test tests/unit/content/company-intake.test.ts`
- [x] Keep queued drafts out of normal compile/runtime paths and cover the behavior with regression tests.
  Verification: `bun test`, `bun run content:validate`, `bun run build`
- [x] Add a repo-local intake skill plus repo docs that describe the queue -> promote -> sync flow.
  Verification: doc review of `AGENTS.md`, `.codex/skills/company-manifest-queue/SKILL.md`, and `README.md`
- [x] Run the final verification pass and review for unintended side effects.
  Verification: `bun run typecheck`, `bun test`, `bun run content:validate`, `bun run build`, `bun run test:e2e`

Completion review:
- Added `content/manifests/queue/` as a tracked staging layer where queued entries wrap `CompanyManifest` with queue metadata instead of changing the canonical manifest schema.
- Added `company:queue` to validate and enqueue draft manifests, and extended `company:init` so queued manifests can be promoted into canonical manifests and removed from the queue atomically.
- Added a repo-local intake skill and repo-level docs so single-company and batch manifest drafting have a documented, manual entry point before the existing Ralph sync flow.

Residual risks:
- The queue path is intentionally manual-reference only; there is no automatic skill discovery or UI around queued entries yet.
- Live provider execution was not needed for this feature, so the intake flow is verified locally up through queue/promotion/build/test rather than through a full live `sync:company` publish cycle in this task.

# GitHub Pages Deploy Failure Fix

- [x] Inspect the latest failed GitHub Pages deployment run and reproduce the failing step locally.
  Verification: `gh run view 23113292879 --log-failed`, `SITE_BASE_PATH=/free-the-world/ bun run test:e2e`
- [x] Fix Playwright's local static serving so GitHub Pages base-path asset requests resolve during CI.
  Verification: `SITE_BASE_PATH=/free-the-world/ bun run test:e2e`
- [x] Make e2e navigation base-path aware and stabilize the registry assertions against the actual rendered semantics.
  Verification: `SITE_BASE_PATH=/free-the-world/ bun run test:e2e`
- [x] Re-run the workflow-equivalent validation/build/test commands before publish.
  Verification: `bun run content:validate`, `bun run typecheck`, `bun run test`, `SITE_BASE_PATH=/free-the-world/ bun run build`, `SITE_BASE_PATH=/free-the-world/ bun run test:e2e`

Completion review:
- The latest failed deploy was not a build/export failure; it was the CI Playwright step serving `.output/public` from `/` while the built site requested assets under `/free-the-world/`.
- Replaced the bare Python test server with a base-path-aware static server, and updated e2e navigation so tests visit the same base-path URLs that GitHub Pages uses.
- Tightened the registry tests to use the actual search input semantics and added a delayed table edge-fade resync so the mobile overlay state settles reliably after late layout work.

Residual risks:
- The Playwright run still emits benign `NO_COLOR` warnings from the worker environment and a third-party `mergeRefs` unused-import warning during build; neither blocks build, tests, or deploy.

# GitHub Actions Node 20 Warning Removal

- [x] Inspect the Pages workflow warning source and confirm the current upstream action versions.
  Verification: `gh api repos/actions/upload-pages-artifact/releases/latest --jq .tag_name`, `gh api repos/actions/upload-artifact/releases/latest --jq .tag_name`, workflow/action metadata review
- [x] Replace the deprecated artifact upload path and opt the workflow into Node 24 for JavaScript actions.
  Verification: workflow diff review in `.github/workflows/deploy.yml`
- [x] Re-run the local validation/build checks that the Pages workflow depends on.
  Verification: `bun run content:validate`, `bun run typecheck`, `bun run test`, `SITE_BASE_PATH=/free-the-world/ bun run build`

Completion review:
- The warning came from `actions/upload-pages-artifact`, which still pins `actions/upload-artifact@v4.x` internally.
- Replaced that wrapper with an explicit tar step plus `actions/upload-artifact@v7`.
- Confirmed the remaining warning moved to `actions/deploy-pages@v4`, then replaced that action with direct Pages deployment API calls plus status polling so the workflow no longer depends on any Node 20 Pages action.

Residual risks:
- The deploy job now owns the Pages API interaction directly, so if GitHub changes the deployment payload or status contract, the workflow script will need to be adjusted instead of relying on an upstream action update.

# GitHub Actions Inline Script Extraction

- [x] Extract the multiline archive and Pages deployment workflow logic into standalone files under `scripts/ci/`.
  Verification: `.github/workflows/deploy.yml` calls the new script entrypoints and preserves existing step names/env wiring.
- [x] Add pure helper coverage for GitHub Pages env parsing, deployment response parsing, and deployment status classification.
  Verification: `bun test tests/unit/scripts/github-pages.test.ts`
- [x] Add a smoke test for the archive helper and run the workflow-equivalent verification pass.
  Verification: `bun test tests/unit/scripts/archive-pages-artifact.test.ts`, `bun run typecheck`, `bun run test`, `SITE_BASE_PATH=/free-the-world/ bun run build`, local archive smoke check against `.output/public`

Completion review:
- Moved the three multiline deploy workflow blocks into `scripts/ci/`, with a typed GitHub Pages helper under `scripts/lib/github-pages.ts` so the deployment parsing and status logic is unit-tested instead of embedded in YAML.
- Kept the workflow behavior intact while making the archive helper portable: GNU tar still uses the original dereference/exclude flags in CI, and BSD tar falls back to archiving only top-level visible entries so the local smoke test can exercise the same effective output.
- Verified the refactor with targeted helper tests, the full Bun unit suite, `content:validate`, `typecheck`, a `SITE_BASE_PATH=/free-the-world/` production build, and a real archive smoke check against `.output/public`.

Residual risks:
- The Pages API scripts still depend on GitHub’s current deployment response shape and status names, just as the prior inline shell did. If GitHub changes that contract, `scripts/lib/github-pages.ts` will need to be updated.
