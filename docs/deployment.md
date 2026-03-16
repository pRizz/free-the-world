# Deployment

Free The World now ships two static artifacts from the same app:

- AWS canonical site: `https://free-the-world.com`
- GitHub Pages mirror: `https://prizz.github.io/free-the-world/`

The three additional AWS domains redirect to the canonical `.com` host:

- `https://free-the-world.us`
- `https://ftwfreetheworld.com`
- `https://ftwfreetheworld.us`

## Commands

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

## Idempotency Contract

- Mutating scripts default to check mode.
- Pass `--apply` to allow mutation.
- Every mutating script validates prerequisites, reads remote state, computes a plan, writes a summary, and skips when there is no effective change.
- Every deployment run writes `summary.md` and `summary.json` under `.codex/logs/deploy/`.

## AWS Prerequisites

- AWS CLI installed and authenticated.
- Route 53 public hosted zones exist for all four domains.
- The deploy role used by CI can create/update:
  - CloudFormation stacks in `us-east-1`
  - ACM certificates in `us-east-1`
  - Route 53 records
  - CloudFront distributions/functions/invalidations
  - S3 buckets and objects

## CI Notes

- The GitHub Actions workflow builds both artifacts once.
- The AWS job uses OIDC via `aws-actions/configure-aws-credentials`.
- The Pages job compares the new artifact to the live Pages deploy manifest and skips the Pages publish when unchanged.
- The AWS publish job compares the local artifact manifest to the manifest already in S3 and skips upload/invalidation when unchanged.
