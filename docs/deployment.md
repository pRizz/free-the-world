# Deployment

Free The World now ships two static artifacts from the same app:

- AWS canonical site: `https://free-the-world.com`
- GitHub Pages mirror: `https://prizz.github.io/free-the-world/`

The three additional AWS domains redirect to the canonical `.com` host:

- `https://free-the-world.us`
- `https://ftwfreetheworld.com`
- `https://ftwfreetheworld.us`

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

Dispatch the production workflow only when the current ref does not already have a reusable run:

```bash
bun run deploy:github:dispatch
bun run deploy:github:dispatch --apply
```

## Idempotency Contract

- Mutating scripts default to check mode.
- Pass `--apply` to allow mutation.
- Every mutating script validates prerequisites, reads remote state, computes a plan, writes a summary, and skips when there is no effective change.
- Every deployment run writes `summary.md` and `summary.json` under `.codex/logs/deploy/`.
- Every deployment run also writes `breadcrumbs.md` and `breadcrumbs.jsonl` in the same timestamped run directory.
- Deploy summaries now include run start/completion timestamps, total duration, and an action timeline with per-step elapsed/duration data.
- When a deploy script runs inside GitHub Actions, it also appends that timing-rich summary to the job step summary via `GITHUB_STEP_SUMMARY`.

## AWS Prerequisites

- AWS CLI installed and authenticated.
- Route 53 public hosted zones exist for all four domains.
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
