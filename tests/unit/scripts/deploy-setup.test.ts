import { expect, test } from "bun:test";
import {
  buildDomainReadinessAssessment,
  formatDomainReadinessMessage,
} from "../../../scripts/lib/aws-deploy";
import {
  buildAwsDeployPolicy,
  buildGithubOidcTrustPolicy,
  normalizePolicyDocument,
  planGitHubPagesSite,
} from "../../../scripts/lib/deploy-setup";
import { parseGitHubRepositorySlug } from "../../../scripts/lib/github-repository";

test("parseGitHubRepositorySlug supports ssh, https, and bare owner/repo formats", () => {
  expect(parseGitHubRepositorySlug("git@github.com:pRizz/free-the-world.git")).toBe(
    "pRizz/free-the-world",
  );
  expect(parseGitHubRepositorySlug("https://github.com/pRizz/free-the-world.git")).toBe(
    "pRizz/free-the-world",
  );
  expect(parseGitHubRepositorySlug("pRizz/free-the-world")).toBe("pRizz/free-the-world");
});

test("buildGithubOidcTrustPolicy scopes the role to the production environment subject", () => {
  const policy = buildGithubOidcTrustPolicy("123456789012", "pRizz/free-the-world");

  expect(policy.Statement[0]?.Principal.Federated).toBe(
    "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com",
  );
  expect(
    policy.Statement[0]?.Condition.StringEquals["token.actions.githubusercontent.com:sub"],
  ).toBe("repo:pRizz/free-the-world:environment:production");
});

test("buildAwsDeployPolicy scopes Route 53 and S3 resources to the deployment account", () => {
  const policy = buildAwsDeployPolicy("123456789012", {
    all: [
      {
        domain: "freetheworld.ai",
        kind: "canonical",
        label: "primary canonical host",
        zoneId: "ZCANONICAL",
      },
      {
        domain: "free-the-world.com",
        kind: "live",
        label: "secondary live host 1",
        zoneId: "ZLIVE1",
      },
      {
        domain: "www.freetheworld.ai",
        kind: "redirect",
        label: "redirect host 1",
        zoneId: "ZREDIRECT1",
      },
      {
        domain: "free-the-world.us",
        kind: "redirect",
        label: "redirect host 2",
        zoneId: "ZREDIRECT2",
      },
      {
        domain: "ftwfreetheworld.com",
        kind: "redirect",
        label: "redirect host 3",
        zoneId: "ZREDIRECT3",
      },
      {
        domain: "ftwfreetheworld.us",
        kind: "redirect",
        label: "redirect host 4",
        zoneId: "ZREDIRECT4",
      },
    ],
    canonical: {
      domain: "freetheworld.ai",
      kind: "canonical",
      label: "primary canonical host",
      zoneId: "ZCANONICAL",
    },
    live: [
      {
        domain: "free-the-world.com",
        kind: "live",
        label: "secondary live host 1",
        zoneId: "ZLIVE1",
      },
    ],
    redirects: [
      {
        domain: "www.freetheworld.ai",
        kind: "redirect",
        label: "redirect host 1",
        zoneId: "ZREDIRECT1",
      },
      {
        domain: "free-the-world.us",
        kind: "redirect",
        label: "redirect host 2",
        zoneId: "ZREDIRECT2",
      },
      {
        domain: "ftwfreetheworld.com",
        kind: "redirect",
        label: "redirect host 3",
        zoneId: "ZREDIRECT3",
      },
      {
        domain: "ftwfreetheworld.us",
        kind: "redirect",
        label: "redirect host 4",
        zoneId: "ZREDIRECT4",
      },
    ],
  });

  const route53Statement = policy.Statement.find(
    (statement) => statement.Sid === "Route53RecordChanges",
  );
  const s3Statement = policy.Statement.find((statement) => statement.Sid === "S3ObjectManagement");

  expect(route53Statement?.Resource).toEqual([
    "arn:aws:route53:::hostedzone/ZCANONICAL",
    "arn:aws:route53:::hostedzone/ZLIVE1",
    "arn:aws:route53:::hostedzone/ZREDIRECT1",
    "arn:aws:route53:::hostedzone/ZREDIRECT2",
    "arn:aws:route53:::hostedzone/ZREDIRECT3",
    "arn:aws:route53:::hostedzone/ZREDIRECT4",
  ]);
  expect(s3Statement?.Resource).toBe("arn:aws:s3:::free-the-world-site-123456789012/*");
});

test("domain readiness messaging explains missing Route 53 blockers for pending hosts", () => {
  const assessment = buildDomainReadinessAssessment([
    {
      blocker:
        "Public Route 53 hosted zone for freetheworld.ai was not found. ACM validation and alias records for this host are still blocked until registration and delegation finish.",
      domain: "freetheworld.ai",
      kind: "canonical",
      label: "primary canonical host",
      ready: false,
    },
    {
      domain: "free-the-world.com",
      kind: "live",
      label: "secondary live host 1",
      ready: true,
      zoneId: "ZLIVE1",
    },
    {
      blocker:
        "Public Route 53 hosted zone for www.freetheworld.ai was not found. ACM validation and alias records for this host are still blocked until registration and delegation finish.",
      domain: "www.freetheworld.ai",
      kind: "redirect",
      label: "redirect host 1",
      ready: false,
    },
  ]);

  expect(assessment.ready).toBe(false);
  expect(assessment.blockers).toHaveLength(2);
  expect(formatDomainReadinessMessage(assessment)).toContain(
    "AWS domain readiness is still pending for the freetheworld.ai rollout.",
  );
  expect(formatDomainReadinessMessage(assessment)).toContain(
    "Public Route 53 hosted zone for freetheworld.ai was not found.",
  );
});

test("normalizePolicyDocument treats encoded and unordered JSON policy documents as equal", () => {
  const left = normalizePolicyDocument({
    Statement: [
      {
        Action: ["b", "a"],
        Effect: "Allow",
      },
    ],
    Version: "2012-10-17",
  });
  const right = normalizePolicyDocument(
    encodeURIComponent(
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: ["b", "a"],
          },
        ],
      }),
    ),
  );

  expect(left).toBe(right);
});

test("planGitHubPagesSite distinguishes missing, legacy, and workflow configurations", () => {
  expect(
    planGitHubPagesSite({
      buildType: null,
      exists: false,
    }),
  ).toEqual({
    action: "create",
    reason: "GitHub Pages is not enabled for the repository yet.",
  });

  expect(
    planGitHubPagesSite({
      buildType: "legacy",
      exists: true,
    }),
  ).toEqual({
    action: "update",
    reason: "GitHub Pages is configured with build_type=legacy.",
  });

  expect(
    planGitHubPagesSite({
      buildType: "workflow",
      exists: true,
    }),
  ).toEqual({
    action: "none",
    reason: "GitHub Pages is already configured for GitHub Actions workflow deployments.",
  });
});
