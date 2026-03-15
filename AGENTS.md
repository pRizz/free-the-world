# Repo Guidance

## Company Intake Skill

When the user asks to queue a company, draft a company manifest, or seed companies from an index, sector, region, or arbitrary grouping, consult `.codex/skills/company-manifest-queue/SKILL.md`.

## Intake Flow

- Queue draft manifests in `content/manifests/queue/` with `bun run company:queue --manifest=...`
- Promote queued manifests with `bun run company:init --queued=<slug>`
- Start Ralph sync only after the manifest is canonical
