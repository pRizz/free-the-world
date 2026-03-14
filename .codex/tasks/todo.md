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
