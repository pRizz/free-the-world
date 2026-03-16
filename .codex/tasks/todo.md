# AWS Bootstrap Durability

- [x] Preserve CloudFormation ownership of existing Route 53 records while adding the new `.ai` records and aliases.
  Verification: `bun test tests/unit/scripts/aws-deploy.test.ts`
- [x] Add stack-readiness waiting/blocking guards plus bootstrap risk classification for unsafe record replacements.
  Verification: `bun test tests/unit/scripts/aws-deploy.test.ts`
- [x] Wire the new safeguards into bootstrap/publish flows and update deployment docs.
  Verification: `bun run typecheck`, `bun test tests/unit/scripts/aws-deploy.test.ts tests/unit/scripts/deploy-setup.test.ts tests/unit/scripts/deploy-config.test.ts tests/unit/scripts/deploy-artifact.test.ts`, `bun run deploy:build`

Completion review:
- Reworked the CloudFormation template and AWS parameter mapping so the legacy Route 53 logical IDs continue owning `free-the-world.com`, `free-the-world.us`, `ftwfreetheworld.com`, and `ftwfreetheworld.us`, while `freetheworld.ai` and `www.freetheworld.ai` are added with new logical resources.
- Added shared stack-readiness polling plus change-set risk classification in the AWS deploy helper layer, and wired both bootstrap and publish through that guard so they wait through safe in-progress stack states and stop with explicit recovery guidance for blocked rollback states.
- Added deploy-focused unit coverage for compatibility mapping, stack-state handling, and blocked legacy DNS replacements, and validated the real AWS account in check mode: bootstrap now plans additive `.ai` records with in-place updates for the legacy records instead of another create-before-delete collision.

Residual risks:
- I did not run `bun run deploy:aws:bootstrap --apply` or `bun run deploy:aws:publish --apply` from this workspace, so production still needs one live apply to move the CloudFormation stack from the rolled-back `.com` model to the repaired `.ai` model.
- The safe AWS publish check still sees a large artifact diff, which is expected until the repaired infrastructure rollout is applied and a new AWS artifact is actually published.

# Primary Canonical Domain Switch

- [x] Refactor deployment config and UI metadata so `freetheworld.ai` is the primary canonical host, `free-the-world.com` stays a live secondary AWS host, and the remaining domains are modeled as redirect-only.
  Verification: `bun test tests/unit/scripts/deploy-config.test.ts`
- [x] Generalize AWS deployment helpers and CloudFormation for 2 live AWS hosts plus 4 redirect hosts, with readiness gating for the pending `freetheworld.ai` Route 53 setup.
  Verification: `bun test tests/unit/scripts/deploy-setup.test.ts`
- [x] Update deployment verification, docs, and artifact metadata to canonicalize to `.ai` while reporting pending-domain blockers clearly.
  Verification: `bun test tests/unit/scripts/deploy-artifact.test.ts` and `bun run test tests/unit/scripts/deploy-config.test.ts tests/unit/scripts/deploy-setup.test.ts tests/unit/scripts/deploy-artifact.test.ts`
- [x] Run final verification and review the diff for unintended side effects.
  Verification: `bun run typecheck`, `bun test tests/unit/scripts/deploy-config.test.ts tests/unit/scripts/deploy-setup.test.ts tests/unit/scripts/deploy-artifact.test.ts`, `bun run test:e2e --grep mirrors`

Completion review:
- Reworked the deployment model so `freetheworld.ai` is the sole canonical origin, `free-the-world.com` remains a live AWS-served secondary host, GitHub Pages stays a noindex mirror, and `www.freetheworld.ai` joins the legacy `.us` and `ftw*` domains as redirect-only aliases.
- Generalized the AWS deploy/setup/bootstrap code and CloudFormation template from the previous one-canonical-plus-three-redirect assumption to one canonical host, one secondary live host, and four redirect hosts, with explicit Route 53 readiness assessment before any apply-mode IAM or CloudFormation mutation.
- Updated `deploy:verify`, artifact metadata, the mirrors UI, docs, and tests so canonical tags, sitemaps, and Pages all point to `.ai`, while missing `.ai` DNS now produces a direct domain-readiness blocker instead of a generic fetch failure.

Residual risks:
- The code path is ready, but `bun run deploy:setup --apply`, `bun run deploy:aws:bootstrap --apply`, and `bun run deploy:verify` will remain intentionally blocked until Route 53 finishes the `freetheworld.ai` and `www.freetheworld.ai` hosted-zone/delegation path.
- I validated the repo locally with typecheck, lint, targeted deploy unit tests, a mirrors Playwright smoke test, and `bun run deploy:build`, but I did not run live AWS mutations from this workspace.

# S&P 500 Next 10 Intake

- [ ] Add the next 10 missing S&P 500 companies from a frozen market-cap snapshot, including any required taxonomy updates.
  Verification: manifests resolve against valid taxonomy IDs and match the March 13, 2026 FinanceCharts ranks 26-35 snapshot.
- [ ] Run the intake pipeline on the new batch with the default provider order and company-level concurrency.
  Verification: `bun run company:pipeline --batch-id=sp500-top35-2026-03-13 --provider=auto --concurrency=5` completes without failed queue, promotion, loop, or sync steps.
- [ ] Run post-intake verification and review the diff for unintended side effects.
  Verification: `bun run content:validate`, `bun run content:compile`, `bun run build`

# Company Pipeline Concurrency

- [x] Add configurable company-level concurrency to `bun run company:pipeline` for the loop phase and dry-run syncs, while keeping publish syncs serial.
  Verification: pipeline coverage proves overlapping dry-run work with `--concurrency=2`, and unit coverage locks publish sync concurrency to 1.
- [x] Document the new pipeline concurrency flag and publish-mode serial guardrail.
  Verification: README company-pipeline guidance mentions `--concurrency` and the publish-mode behavior.
- [x] Run verification and review the diff for unintended side effects.
  Verification: `bun run format`, `bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`

Completion review:
- `company:pipeline` now accepts the same company-level concurrency control as the low-level `loop` command, with a default of 5.
- The pipeline runs its low-level loop phase and `dry-run` sync phase through the shared bounded worker pool, while `publish` syncs are explicitly forced back to concurrency 1.
- Added regression coverage that proves overlapping `dry-run` loop and sync work with `--concurrency=2`, plus a helper-level guard for publish mode.

Residual risks:
- Parallel `dry-run` syncs still execute separate model runs against the same current canonical content snapshot, so they do not validate interactions between multiple unpublished candidate payloads in one combined graph. That is acceptable for independent dry-runs, but publish mode remains serial for this reason.

# Ralph Loop Concurrency

- [x] Add configurable company-level concurrency to `bun run loop` with a safe default of 5.
  Verification: unit coverage proves the pool caps active work, and CLI coverage accepts `--concurrency`.
- [x] Document the new concurrency flag in the Ralph loop docs.
  Verification: README loop usage mentions `--concurrency` and the default.
- [x] Run targeted verification and review the diff for unintended side effects.
  Verification: `bun run format`, `bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`

Completion review:
- Added a small bounded worker-pool helper and wired `bun run loop` to process multiple company targets in parallel while keeping each company's task sequence isolated.
- Added `--concurrency=<n>` parsing with a default of 5 and validation that rejects non-positive values.
- Extended unit and CLI coverage so the concurrency limit is enforced in code and accepted in the low-level loop interface.

Residual risks:
- The new pool only parallelizes across companies. A run with many selected tasks per company still executes those tasks sequentially inside each company worker, which keeps per-company traces simple but limits maximum throughput for multi-task runs.

# Company Intake Pipeline

- [x] Add a repo-level `company:pipeline` command that composes queueing, promotion, Ralph loop research, and structured sync with safe defaults.
  Verification: targeted CLI test covers queue -> promote -> loop -> sync in a temp fixture repo.
- [x] Document the new pipeline command in repo docs and company-intake guidance.
  Verification: README and `.codex/skills/company-manifest-queue/SKILL.md` both describe when to use `bun run company:pipeline`.
- [x] Run the repo verification pass and review the diff for unintended side effects.
  Verification: `bun run format`, `bun run lint`, `bun run typecheck`, `bun run test`

Completion review:
- Added `bun run company:pipeline`, backed by a reusable helper in `scripts/lib/company-pipeline.ts`, so the repo now has one command that can queue draft manifests, promote queued entries, run a low-level Ralph loop, and then kick off structured sync.
- Added integration-style CLI coverage with a fake provider to prove the command works end-to-end in a temp fixture repo without depending on live Claude or Codex access.
- Updated README guidance and the existing company-manifest queue skill so the end-to-end path is discoverable where intake work already starts.

Residual risks:
- The command intentionally defaults the low-level loop to `company-overview` plus `mode=dry-run` and `no-commit=true` to keep the bulk path safe. Teams that want heavier pre-sync research still need to opt into `--loop-tasks=all` or a custom task list.

# Mirrors Page

- [x] Add a repo-owned helper in `src/lib/deployment-config.ts` that exposes normalized canonical, mirror, and redirect host metadata for UI use.
  Verification: helper returns canonical first, includes the GitHub Pages mirror as noindex, and maps all redirect domains back to the canonical target in `tests/unit/scripts/deploy-config.test.ts`.
- [x] Add the `/mirrors` route and wire it into shared navigation plus static route export.
  Verification: `/mirrors` appears in `src/lib/site-routes.ts`, `src/components/site-shell.tsx`, and renders the mirror inventory plus Tor notice.
- [x] Extend automated coverage for the new mirrors page and navigation affordances.
  Verification: `tests/e2e/smoke.e2e.ts` covers `/mirrors`, the Tor notice, and the `Mirrors` nav item on mobile and desktop.

Completion review:
- Added a deployment-config helper that exposes the canonical AWS host, the GitHub Pages mirror, and all redirect-only domains in a single ordered UI-facing list.
- Added a new `/mirrors` route plus shared navigation and static-route registration so the page ships with the rest of the exported site.
- Extended unit and e2e coverage around both the helper output and the new route/navigation affordances.

Residual risks:
- The page intentionally reflects only repo-configured hosts. If future mirror types such as Tor `.onion` addresses are added outside `src/lib/deployment-config.ts`, this page will not show them until that source of truth is extended.

# Multi-Domain Static Deployment

# AWS Deployment Summary Timing

- [x] Add run-level timing metadata to deploy summaries and expose it in GitHub Actions step summaries.
  Verification: `bun test tests/unit/scripts/deploy-log.test.ts`
- [x] Instrument AWS bootstrap and publish scripts with finer-grained timed breadcrumbs for each scripted action.
  Verification: script review of `scripts/deploy/bootstrap-aws.ts` and `scripts/deploy/publish-aws.ts`, plus `bun test tests/unit/scripts/deploy-log.test.ts`
- [x] Document the timing-rich summary behavior and review the diff for unintended workflow changes.
  Verification: `bun run typecheck`, doc review of `docs/deployment.md`, diff review

Completion review:
- Deploy summaries now persist run start/end timing plus a breadcrumb timeline, and the same markdown is appended into `GITHUB_STEP_SUMMARY` when the scripts run in GitHub Actions.
- The AWS bootstrap and publish scripts now emit more granular breadcrumbs around identity lookup, hosted-zone/stack inspection, change-set work, artifact integrity checks, remote manifest reads, uploads, deletes, invalidations, and post-run verification.
- Added unit coverage for the richer summary contract and confirmed the changed scripts still typecheck.

Residual risks:
- This session did not execute a live GitHub Actions deployment, so the rendered GitHub job summary still needs one real workflow run to confirm the final presentation in the Actions UI.

- [x] Add centralized deployment config, gitignored deploy logs, and target-aware build outputs for AWS and GitHub Pages.
  Verification: `bun run typecheck`, `bun run deploy:build`
- [x] Add canonical/meta/robots/sitemap handling plus deterministic deploy manifests and artifact assertions.
  Verification: `bun test`, `bun run deploy:build`, `bun run test:e2e`
- [x] Add repo-managed AWS infrastructure plus idempotent bootstrap and publish scripts with summary logging.
  Verification: `bun run typecheck`, unit coverage for deploy helpers, script review of `infra/aws/static-site.yaml`, `scripts/deploy/bootstrap-aws.ts`, and `scripts/deploy/publish-aws.ts`
- [x] Add GitHub Pages mirror planning, CI workflow updates, deployment docs, and a repo-local deployment skill.
  Verification: workflow/doc/skill review of `.github/workflows/deploy.yml`, `docs/deployment.md`, and `.codex/skills/static-multi-domain-deploy/SKILL.md`
- [x] Run the final local verification pass and review the diff for unintended regressions.
  Verification: `bun run typecheck`, `bun test`, `bun run deploy:build`, `bun run test:e2e`

Completion review:
- Added a single deployment config surface that now drives canonical domain metadata, GitHub Pages mirror behavior, cache policy classes, and target-specific build settings.
- Reworked the build so the repo emits `.artifacts/deploy/aws` and `.artifacts/deploy/github-pages`, each with `robots.txt`, `sitemap.xml`, `deploy-manifest.json`, and artifact assertions that fail on mixed root/repo-path URLs.
- Added repo-owned AWS infrastructure in `infra/aws/static-site.yaml` plus idempotent `deploy:aws:bootstrap` and `deploy:aws:publish` scripts that inspect remote state first, default to check mode, and write summaries under `.codex/logs/deploy/`.
- Added `deploy:pages:plan` and `deploy:verify`, updated the production workflow to build once then deploy AWS and Pages separately, and documented the process in `docs/deployment.md` and the new repo skill.

Residual risks:
- Live AWS behavior is not exercised in this session because no AWS credentials or hosted-zone access were available locally. The CloudFormation stack, OIDC workflow wiring, redirects, and S3/CloudFront publish path still need a real `--apply` run plus `bun run deploy:verify` in CI or an authenticated local shell.
- The GitHub Pages mirror gating compares against the live Pages `deploy-manifest.json`. If the Pages site is temporarily unreachable, the planner intentionally treats that as “deploy needed” rather than blocking the workflow.
- CloudFront URL rewriting and host redirection live inside the inline CloudFront Function in `infra/aws/static-site.yaml`; if AWS changes Function event-field behavior, that template may need a small follow-up after the first live deployment.

# Deployment Setup Automation

- [x] Extend the deploy log contract so each deployment command writes summary files plus breadcrumb traces.
  Verification: `bun test tests/unit/scripts/deploy-log.test.ts`, `bun run deploy:build`, `bun run deploy:pages:plan --artifact=.artifacts/deploy/github-pages`
- [x] Add idempotent AWS setup automation for the GitHub OIDC provider, deploy role, and managed policy.
  Verification: `bun run typecheck`, `bun test tests/unit/scripts/deploy-setup.test.ts`, live check pass pending `bun run deploy:setup:aws`
- [x] Add idempotent GitHub setup automation for environments, Pages workflow mode, and the deploy role secret digest.
  Verification: `bun run typecheck`, `bun test tests/unit/scripts/deploy-setup.test.ts`, live check pass pending `bun run deploy:setup:github`
- [x] Add wrapper commands and docs for setup and workflow dispatch.
  Verification: package/doc/skill review of `package.json`, `docs/deployment.md`, and `.codex/skills/static-multi-domain-deploy/SKILL.md`

Completion review:
- Added repo-owned setup commands for AWS IAM/OIDC and GitHub repo configuration, so the production deployment prerequisites can be checked and applied from the workspace instead of a manual checklist.
- Extended the deployment logging contract to emit append-only breadcrumb traces alongside the existing JSON and Markdown summaries for build, setup, planning, publish, and verification runs.
- Added an idempotent workflow-dispatch helper so the repo can skip redundant manual dispatches when the current ref already has a reusable deployment run.

Residual risks:
- The new setup scripts depend on live GitHub and AWS credentials and were not applied in this session, so the real create/update paths still need one authenticated `--apply` pass.
- The GitHub setup flow uses an environment-scoped digest variable to decide whether the `AWS_DEPLOY_ROLE_ARN` secret needs to be updated. If someone changes the secret manually without updating the digest variable, the next check will treat the digest as source of truth and skip the secret update.

# Git Provenance Metadata

- [x] Add a shared build-metadata resolver plus repo-slug helper so local builds and deploy builds can derive a commit SHA, commit URL, ISO timestamp, and fixed UTC label from git without hardcoding the repo URL.
  Verification: `bun test tests/unit/scripts/build-metadata.test.ts`, `bun run typecheck`
- [x] Propagate provenance env vars through the build pipeline and expose them through site config for app use.
  Verification: `bun run build`, `bun run typecheck`
- [x] Render compact commit provenance in the global footer and a fuller metadata card on the About page.
  Verification: `bunx playwright test tests/e2e/smoke.e2e.ts --workers=1`
- [x] Tighten deploy artifact assertions so external GitHub commit links do not false-positive as GitHub Pages base-path leaks.
  Verification: `bun test tests/unit/scripts/deploy-artifact.test.ts`, `bun run build`

Completion review:
- Added script-layer helpers that resolve build provenance once and feed the same commit metadata into deploy builds, while still letting plain `bun run build` self-resolve from the local git checkout.
- The footer now shows `Commit <short-sha> · <UTC timestamp>` on every page, and the About page exposes a dedicated build-metadata section with the linked short SHA plus the full ISO commit timestamp.
- Tightened the AWS artifact guard so it only rejects root-relative GitHub Pages path leaks, not external GitHub commit URLs that happen to include the repo name.

Residual risks:
- Local dev via `bun run dev` still omits provenance because that path does not go through `scripts/build-site.ts`; the metadata is present on static/exported builds, which is the publish path exercised here.

# Deploy Artifact Integrity Guard

- [x] Preserve hidden files in the CI handoff for the AWS and GitHub Pages deploy artifacts.
  Verification: workflow review of `.github/workflows/deploy.yml`
- [x] Add a shared artifact-integrity preflight for deploy consumers and cover the missing-hidden-files failure mode with a unit test.
  Verification: `bun test tests/unit/scripts/deploy-artifact.test.ts`, `bun run deploy:build`

Completion review:
- The deploy workflow now uploads the built artifacts with hidden files included, so `_build/.vite/manifest.json` and `.nojekyll` survive the build-to-deploy job handoff.
- Both `deploy:aws:publish` and `deploy:pages:plan` now validate that every file listed in `deploy-manifest.json` is actually present before they attempt publish or mirror-planning work.

Residual risks:
- The new integrity guard catches incomplete artifacts early, but it cannot repair them. If a future CI/storage step strips files again, the workflow will still fail until that step preserves the artifact correctly.

# UI Standardization Refactor

# SolidStart Stable Migration And Hydration Fix

- [x] Migrate the repo from `@solidjs/start@2.0.0-alpha.2` + Nitro V2 config to stable SolidStart/Vinxi config.
  Verification: `bun run typecheck`, `bun run build`
- [x] Replace the custom static export path with framework prerendered output and update local/CI static serving accordingly.
  Verification: `bun run build`, targeted output inspection, `bun run test:e2e`
- [x] Add a local `source-map-js` browser shim so the SolidStart dev overlay can resolve `SourceMapConsumer`.
  Verification: `bun run test:e2e:dev`
- [x] Add hydration/dev-overlay regression coverage for initial load plus first scroll on `/` and `/companies`.
  Verification: `bun run test:e2e:dev`
- [x] Re-test the shell after the framework migration and only apply a shell fallback if the same hydration key remains.
  Verification: targeted dev repro check, diff review

Completion review:
- Migrated the app to stable `@solidjs/start@1.3.2` plus `vinxi`, replaced the alpha-era `vite.config.ts` flow with `app.config.ts`, and updated the client entry plus runtime base-path handling for the new server config shape.
- Added a local `source-map-js` ESM shim and a dedicated dev Playwright config/spec that loads `/` and `/companies`, scrolls after hydration, and fails on `Hydration Mismatch`, `SourceMapConsumer`, or `get-source-map`.
- Stable Vinxi still emits prerendered static output to `.output/public`, so the repo keeps that authoritative output path and uses a small post-build finalizer for `.nojekyll` and root `404.html` instead of forcing a `dist` migration.

Residual risks:
- Stable Vinxi still uses `.output/public`, so build, local static serving, and deploy assumptions remain coupled to that output layout unless the project adopts a custom output relocation later.
- Upstream dependency warnings remain during verification (`NO_COLOR` vs `FORCE_COLOR`, unused `mergeRefs` in a dependency), but they are non-blocking and unrelated to the hydration/runtime fix.
- The shell fallback was intentionally skipped because the migrated dev runtime no longer reproduced the original mobile-menu hydration key; if the issue resurfaces in a user profile, re-check `src/components/site-shell.tsx` before broadening the fix.

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

# Top-20 S&P 500 Intake And Loop Support

- [x] Expand taxonomy and align the canonical top-10 manifests/bundles for a new `sp500-top20` index.
  Verification: `bun run content:validate`, `bun run content:compile`
- [x] Queue the missing top-20 companies using the reverified March 13, 2026 company-level roster.
  Verification: `bun run company:queue ... --batch-id=sp500-top20-2026-03-15`, queue file review
- [x] Extend `bun run loop` to support queued batch targets and manifest-only canonical targets with source-aware run metadata.
  Verification: `bun run typecheck`, `bun test tests/unit/content/ralph.test.ts tests/unit/content/ralph-loop.test.ts`
- [x] Improve loop troubleshooting and preserve provider-config-based execution behavior.
  Verification: targeted error-path assertions in `tests/unit/content/ralph-loop.test.ts` plus dry-run CLI checks

Completion review:
- Added `sp500-top20`, filled the missing taxonomy needed by the newly queued companies, and kept canonical bundle/manifests aligned so the compiler accepts the new index cleanly.
- Reverified the roster against FinanceCharts’ March 13, 2026 company-level S&P 500 market-cap screener and queued the 10 missing companies: Eli Lilly, JPMorgan Chase, Exxon Mobil, Visa, Johnson & Johnson, Micron Technology, Costco, Oracle, Mastercard, and Netflix.
- Extended the low-level Ralph loop so queued batches and manifest-only canonical targets can generate prompts under `research/runs/` before promotion, while preserving the separate `sync:company` path and improving provider-config troubleshooting.

Residual risks:
- The queued manifests are intentionally lightweight. They are ready for low-level prompt generation, but they still need promotion and full `sync:company` work before they become canonical published content.
- The batch roster is pinned to the March 13, 2026 FinanceCharts snapshot. A later run should reverify the roster again instead of assuming it remains stable.

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
# S&P 500 Top 25 Intake

- [x] Freeze the exact S&P 500 top-25 company snapshot and identify the missing slugs versus the 10 canonical plus 10 queued manifests.
  Verification: FinanceCharts S&P 500 screener snapshot dated March 13, 2026 matches ranks 1-20 already present in canonical plus queued manifests, leaving Chevron, AbbVie, Palantir Technologies, Procter & Gamble, and Home Depot as the missing top-25 batch.
- [x] Add taxonomy support for the expanded batch, including `sp500-top25` and any missing sector or industry ids required by the confirmed companies.
  Verification: added `sp500-top25`, `home-improvement-retail`, and `household-products`; `bun run content:validate` passed.
- [x] Draft one manifest per missing company using valid taxonomy ids and queue them with a shared batch id and request notes.
  Verification: draft manifests created for `abbvie`, `chevron`, `home-depot`, `palantir-technologies`, and `procter-gamble` under `.codex/tmp/sp500-top25-drafts/`; structural `jq` checks passed.
- [x] Queue the new manifests with a shared batch id and request notes.
  Verification: queued manifests now exist for `abbvie`, `chevron`, `home-depot`, `palantir-technologies`, and `procter-gamble`; `bun run content:validate` and `bun run content:compile` both passed after queueing.
- [x] Promote the queued manifests into canonical manifests.
  Verification: `bun run company:init --queued=<slug>` succeeded for `abbvie`, `chevron`, `home-depot`, `palantir-technologies`, and `procter-gamble`; canonical manifests now exist under `content/manifests/companies/` and the corresponding queue entries were removed.
- [ ] Run Ralph sync for each promoted company.
  Verification: `bun run sync:company --company=<slug> --provider=auto --mode=dry-run` succeeds for each new company.

# Standard Bun Linting With Biome

- [x] Add Biome as a dev dependency, expose `lint` / `lint:fix` / `format` Bun scripts, and add a scoped root `biome.json`.
  Verification: `bun run lint --help` resolves via package scripts and `biome.json` excludes generated/content/build paths.
- [x] Run the initial Biome cleanup across scoped code/config files and fix any remaining diagnostics without broad rule disablement.
  Verification: `bun run lint` passes cleanly and ignored paths such as `src/lib/generated/content-graph.ts` and `content/` are not reported.
- [x] Update developer docs for the new local lint workflow and complete the core verification pass.
  Verification: `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build`

Completion review:
- Added Biome 2.4.7 as the repo’s lint/format tool, exposed it through `bun run lint`, `bun run lint:fix`, and `bun run format`, and committed a root `biome.json` that scopes linting to app/script/test/config code.
- Ran the initial formatter/import-order cleanup across the scoped files, then fixed the remaining typed/runtime diagnostics directly and used one narrow `biome-ignore` for the shared `Label` primitive’s caller-associated accessibility contract.
- Updated the README with a local verification section and an explicit note that editorial content, generated runtime data, and build artifacts are intentionally outside the v1 lint baseline.

Residual risks:
- This first adoption rewrote a large number of existing source files to establish a Biome baseline, so future reviews should expect one large normalization diff before subsequent lint-only changes get smaller again.
- Linting is still local-first in this pass. GitHub Actions does not enforce `bun run lint` yet, so CI gating remains a follow-up rather than part of this rollout.
