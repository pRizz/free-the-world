import { expect, test } from "bun:test";
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
    canonical: "ZCANONICAL",
    redirects: ["ZREDIRECT1", "ZREDIRECT2", "ZREDIRECT3"],
  });

  const route53Statement = policy.Statement.find(
    (statement) => statement.Sid === "Route53RecordChanges",
  );
  const s3Statement = policy.Statement.find((statement) => statement.Sid === "S3ObjectManagement");

  expect(route53Statement?.Resource).toEqual([
    "arn:aws:route53:::hostedzone/ZCANONICAL",
    "arn:aws:route53:::hostedzone/ZREDIRECT1",
    "arn:aws:route53:::hostedzone/ZREDIRECT2",
    "arn:aws:route53:::hostedzone/ZREDIRECT3",
  ]);
  expect(s3Statement?.Resource).toBe("arn:aws:s3:::free-the-world-site-123456789012/*");
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
