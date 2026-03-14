# Research workspace

This directory separates **draft research artifacts** from the typed data shipped to the site.

## Conventions

- `technology-waves.md` stores the thesis-level assumptions that should keep showing up in scoring and editorial copy.
- `generated/<company-slug>/` is reserved for repeatable AI prompt-loop outputs.
- Generated artifacts are drafts, not canonical truth.
- Canonical site data lives under `src/lib/content/`.

## Ralph loop

The repo includes a basic prompt-loop runner:

```bash
bun run loop --company=microsoft --task=moat-analysis
```

That command writes prompt and manifest files to `research/generated/microsoft/`.

To request actual CLI execution when local providers are available:

```bash
bun run loop --company=microsoft --task=moat-analysis --provider=auto --execute=true
```

For safety and portability, provider execution requires environment-specific command templates:

- `RALPH_LOOP_CLAUDE_COMMAND_TEMPLATE`
- `RALPH_LOOP_CODEX_COMMAND_TEMPLATE`

Templates can use:

- `{{promptFile}}`
- `{{outputFile}}`
- `{{companySlug}}`
- `{{taskId}}`

This keeps the workflow adaptable across local machines without hard-coding a single CLI syntax into the repo.
