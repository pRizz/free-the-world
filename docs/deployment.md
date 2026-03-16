# Deployment

Free The World now ships two static artifacts from the same app:

- AWS primary canonical site: `https://freetheworld.ai`
- AWS secondary live site: `https://free-the-world.com`
- GitHub Pages mirror: `https://prizz.github.io/free-the-world/`

The four additional AWS domains redirect to the primary `.ai` host:

- `https://www.freetheworld.ai`
- `https://free-the-world.us`
- `https://ftwfreetheworld.com`
- `https://ftwfreetheworld.us`

The `.com` host stays live on the same CloudFront distribution, but its HTML canonical tags, sitemap, and Open Graph URLs all point to `https://freetheworld.ai`.

## Commands

Bootstrap the GitHub and AWS deployment prerequisites without mutating:

```bash
bun run deploy:setup
```

Apply the GitHub and AWS deployment prerequisites:

```bash
bun run deploy:setup --apply
```

Run only the AWS IAM/OIDC setup:

```bash
bun run deploy:setup:aws
bun run deploy:setup:aws --apply
```

Run only the GitHub repo/environment setup:

```bash
bun run deploy:setup:github
bun run deploy:setup:github --apply
```

Build both deployable artifacts:

```bash
bun run deploy:build
```

Build one target only:

```bash
bun run deploy:build:aws
bun run deploy:build:pages
```

Check AWS infrastructure without mutating:

```bash
bun run deploy:aws:bootstrap
```

Apply AWS infrastructure changes:

```bash
bun run deploy:aws:bootstrap --apply
```

The bootstrap command now waits for safe in-progress CloudFormation states for up to 30 minutes before creating a change set. It still fails fast when the stack needs manual recovery, such as `UPDATE_ROLLBACK_FAILED`, `ROLLBACK_COMPLETE`, or delete-in-progress states.

Check AWS content publish without mutating:

```bash
bun run deploy:aws:publish --artifact=.artifacts/deploy/aws
```

Apply AWS content publish:

```bash
bun run deploy:aws:publish --artifact=.artifacts/deploy/aws --apply
```

Compare the GitHub Pages artifact to the live Pages mirror:

```bash
bun run deploy:pages:plan --artifact=.artifacts/deploy/github-pages
```

Verify the canonical host, redirects, and Pages mirror:

```bash
bun run deploy:verify
```

## Staged Rollout

The repo changes for the `.ai` cutover can land before `freetheworld.ai` is fully registered or delegated in Route 53.

1. Merge the repo changes.
2. Run `bun run deploy:setup` and `bun run deploy:aws:bootstrap` in check mode while the domain is still pending.
3. Wait until Route 53 has a public hosted zone for `freetheworld.ai` and the registrar has delegated the domain publicly.
4. Re-run `bun run deploy:setup --apply`, `bun run deploy:aws:bootstrap --apply`, and `bun run deploy:verify`.

When `.ai` is not ready yet:

- `deploy:setup:aws` reports a domain-readiness blocker in check mode and refuses to mutate IAM/OIDC state in apply mode.
- `deploy:aws:bootstrap` reports the blocker in check mode and refuses to execute CloudFormation in apply mode.
- `deploy:verify` reports a DNS/readiness blocker instead of a generic fetch failure if the new `.ai` hosts do not resolve publicly yet.

Dispatch the production workflow only when the current ref does not already have a reusable run:

```bash
bun run deploy:github:dispatch
bun run deploy:github:dispatch --apply
```

## Idempotency Contract

- Mutating scripts default to check mode.
- Pass `--apply` to allow mutation.
- Every mutating script validates prerequisites, reads remote state, computes a plan, writes a summary, and skips when there is no effective change.
- `deploy:aws:bootstrap` preserves the legacy Route 53 logical-resource ownership for `free-the-world.com`, `free-the-world.us`, `ftwfreetheworld.com`, and `ftwfreetheworld.us`, and adds `.ai` records with new logical IDs instead of trying to replace already-existing DNS records.
- `deploy:aws:bootstrap` blocks apply mode if the change set would replace or remove those legacy Route 53 records, because CloudFormation would otherwise collide with existing record sets during create-before-delete replacement.
- `deploy:aws:bootstrap` and `deploy:aws:publish` now wait for a mutable stack state when another rollout is already in progress, then continue automatically.
- Every deployment run writes `summary.md` and `summary.json` under `.codex/logs/deploy/`.
- Every deployment run also writes `breadcrumbs.md` and `breadcrumbs.jsonl` in the same timestamped run directory.
- Deploy summaries now include run start/completion timestamps, total duration, and an action timeline with per-step elapsed/duration data.
- When a deploy script runs inside GitHub Actions, it also appends that timing-rich summary to the job step summary via `GITHUB_STEP_SUMMARY`.

## AWS Prerequisites

- AWS CLI installed and authenticated.
- Route 53 public hosted zones exist for:
  - `freetheworld.ai`
  - `free-the-world.com`
  - `free-the-world.us`
  - `ftwfreetheworld.com`
  - `ftwfreetheworld.us`
- `www.freetheworld.ai` should normally be a record inside the `freetheworld.ai` hosted zone, not a separate hosted zone.
- If the new `.ai` domain is still pending registration or delegation, the repo changes can still be merged, but AWS apply steps must wait until those hosted zones exist.
- IAM permissions to create or update:
  - the GitHub OIDC provider in the target AWS account
  - the `free-the-world-github-deploy` IAM role
  - the `free-the-world-github-deploy` managed IAM policy
- The deploy role used by CI can create/update:
  - CloudFormation stacks in `us-east-1`
  - ACM certificates in `us-east-1`
  - Route 53 records
  - CloudFront distributions/functions/invalidations
  - S3 buckets and objects

## CI Notes

- The GitHub Actions workflow builds both artifacts once.
- The AWS job uses OIDC via `aws-actions/configure-aws-credentials`.
- `bun run deploy:setup --apply` creates the GitHub OIDC provider, deploy role, managed policy, GitHub environments, GitHub Pages workflow mode, and the `AWS_DEPLOY_ROLE_ARN` environment secret plus digest variable.
- The Pages job compares the new artifact to the live Pages deploy manifest and skips the Pages publish when unchanged.
- The AWS publish job compares the local artifact manifest to the manifest already in S3 and skips upload/invalidation when unchanged.
