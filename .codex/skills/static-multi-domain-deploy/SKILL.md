---
name: static-multi-domain-deploy
description: Use when the user wants to inspect, bootstrap, publish, verify, or modify the Free The World multi-domain static deployment across AWS and GitHub Pages. It covers the target-aware build, idempotent AWS scripts, deploy logs, and the GitHub Pages mirror comparison flow.
---

# Static Multi-Domain Deploy

Use this skill for deployment work on this repo.

## Source of Truth

Read these files first:

- `src/lib/deployment-config.ts`
- `docs/deployment.md`
- `.github/workflows/deploy.yml`
- `infra/aws/static-site.yaml`
- `scripts/lib/deploy-artifact.ts`
- `scripts/deploy/bootstrap-aws.ts`
- `scripts/deploy/publish-aws.ts`
- `scripts/deploy/plan-pages.ts`
- `scripts/deploy/setup.ts`
- `scripts/deploy/setup-aws.ts`
- `scripts/deploy/setup-github.ts`
- `scripts/deploy/dispatch-workflow.ts`
- `scripts/deploy/verify.ts`

## Core Workflow

1. Build both artifacts with `bun run deploy:build`.
2. Inspect `.artifacts/deploy/aws/deploy-manifest.json` and `.artifacts/deploy/github-pages/deploy-manifest.json` if the task is about drift or unexpected deploy behavior.
3. Run `bun run deploy:setup` before the first live deployment. Use `--apply` only after the AWS and GitHub setup summary looks correct.
4. Run `bun run deploy:aws:bootstrap` before any AWS infra mutation. Use `--apply` only after the check summary looks correct.
5. Run `bun run deploy:aws:publish --artifact=.artifacts/deploy/aws` before any AWS content mutation. Use `--apply` only after the plan is correct.
6. Run `bun run deploy:pages:plan --artifact=.artifacts/deploy/github-pages` to decide whether a Pages deploy should happen.
7. Run `bun run deploy:github:dispatch` if you need to manually hand off deployment to GitHub Actions for the current ref.
8. Run `bun run deploy:verify` after infra or content changes.

## Guardrails

- Do not make ad hoc AWS console changes without also updating the repo-owned CloudFormation template or deploy scripts.
- Treat `--apply` as opt-in. The default mode is the safety mode.
- Every deploy script writes a summary plus breadcrumb logs under `.codex/logs/deploy/`; review both before concluding a deploy is healthy.
- Keep `.codex/tasks/todo.md` updated when changing the deployment system itself.
