# Research workspace

This directory separates **draft research artifacts** from the JSON content shipped to the site.

## Conventions

- `technology-waves.md` stores the thesis-level assumptions that should keep showing up in scoring and editorial copy.
- `runs/<company-slug>/<run-id>/` is reserved for repeatable AI prompt-loop and sync outputs.
- Run artifacts are drafts plus validation/publish traces, not canonical truth by themselves.
- Provider-native debug exhaust such as `*.debug.log`, `*.stderr.txt`, `*.last-message.txt`, and `latest` symlinks is treated as local troubleshooting output and is gitignored.
- Canonical site data lives under `content/`.

## Ralph loop

The repo includes a low-level prompt-loop runner:

```bash
bun run loop --company=microsoft --task=moat-analysis
```

That command writes prompt and manifest files to `research/runs/microsoft/<run-id>/`.

To request actual CLI execution when local providers are available:

```bash
bun run loop --company=microsoft --task=moat-analysis --provider=auto --execute=true
```

For the main structured publish flow:

```bash
bun run sync:company --company=microsoft --provider=auto --mode=dry-run
```

Provider execution uses JSON config files instead of shell-string templates:

- `config/ralph.providers.example.json`
- `.codex/ralph.providers.local.json`

The sync pipeline expects pure JSON responses, validates them against the content compiler, and only publishes canonical JSON content when validation passes.
