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
