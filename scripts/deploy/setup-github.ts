import { deploymentConfig } from "../../src/lib/deployment-config";
import { ensureAwsCliAvailable, loadAwsCallerIdentity } from "../lib/aws-deploy";
import { runCommand, runJsonCommand } from "../lib/command";
import { planGitHubPagesSite, type GitHubPagesSiteState, computeDigest } from "../lib/deploy-setup";
import { createDeployRun, writeDeploySummary, type DeployVerificationResult } from "../lib/deploy-log";
import { resolveGitHubRepositorySlug } from "../lib/github-repository";

interface GitHubEnvironmentResponse {
  html_url?: string;
  id?: number;
  name?: string;
}

interface GitHubPagesResponse {
  build_type?: string;
  html_url?: string;
  source?: {
    branch?: string | null;
    path?: string | null;
  } | null;
}

const args = parseArgs(process.argv.slice(2));
const mode: "apply" | "check" = args.apply === "true" ? "apply" : "check";
const commandName = "deploy:setup:github";
const run = await createDeployRun({
  command: commandName,
  mode,
  target: "github-setup",
});

await run.addBreadcrumb({
  detail: "Validating GitHub CLI access and loading repository configuration.",
  status: "info",
  step: "initialize",
});

ensureGitHubCliAvailable();
ensureGitHubAuthentication();

const repositorySlug = resolveGitHubRepositorySlug(args.repo);
const productionEnvironment = deploymentConfig.githubProductionEnvironmentName;
const pagesEnvironment = deploymentConfig.githubPagesEnvironmentName;
const roleArn = resolveRoleArn(args["role-arn"]);
const roleArnDigest = computeDigest(roleArn);
const settingsUrls = [
  `https://github.com/${repositorySlug}/settings/environments`,
  `https://github.com/${repositorySlug}/settings/pages`,
  `https://github.com/${repositorySlug}/settings/secrets/actions`,
];

await run.addBreadcrumb({
  data: {
    repositorySlug,
    roleArn,
    roleArnDigest,
  },
  detail: "Resolved repository slug and deploy role ARN.",
  status: "passed",
  step: "context",
});

const currentProductionEnvironment = loadEnvironmentState(repositorySlug, productionEnvironment);
const currentPagesEnvironment = loadEnvironmentState(repositorySlug, pagesEnvironment);
const currentPagesSite = loadPagesSiteState(repositorySlug);
const currentDigest = currentProductionEnvironment
  ? loadEnvironmentVariable(repositorySlug, productionEnvironment, deploymentConfig.githubRoleArnDigestVariableName)
  : null;

const environmentPlans = {
  [productionEnvironment]: currentProductionEnvironment ? { action: "none" as const } : { action: "create" as const },
  [pagesEnvironment]: currentPagesEnvironment ? { action: "none" as const } : { action: "create" as const },
};
const pagesPlan = planGitHubPagesSite(currentPagesSite);
const secretPlan =
  currentDigest === roleArnDigest
    ? {
        action: "none" as const,
        reason: "The GitHub environment digest already matches the desired AWS deploy role ARN.",
      }
    : {
        action: "set" as const,
        reason: currentDigest
          ? `The stored digest ${currentDigest} does not match the desired digest ${roleArnDigest}.`
          : "The production environment digest variable is missing.",
      };

await run.addBreadcrumb({
  data: {
    environmentPlans,
    pagesPlan,
    secretPlan,
  },
  detail: "Computed the GitHub repository setup mutation plan.",
  status: "planned",
  step: "plan",
});

const skippedReasons: string[] = [];
const appliedChanges: string[] = [];
const verificationResults: DeployVerificationResult[] = [
  {
    detail: `Authenticated GitHub CLI access for ${repositorySlug}.`,
    name: "gh auth",
    status: "passed",
  },
];

if (allPlansAreNoOps(environmentPlans, pagesPlan, secretPlan)) {
  skippedReasons.push("The production environment, github-pages environment, Pages workflow mode, and deploy role secret already match the desired state.");
  await run.addBreadcrumb({
    detail: "Remote GitHub repository settings already match the desired state.",
    status: "skipped",
    step: "plan",
  });
} else if (mode === "check") {
  skippedReasons.push("Check mode only. No GitHub repository mutations were executed.");
  await run.addBreadcrumb({
    detail: "Check mode prevented GitHub repository mutations.",
    status: "skipped",
    step: "apply",
  });
} else {
  if (environmentPlans[productionEnvironment].action === "create") {
    createEnvironment(repositorySlug, productionEnvironment);
    appliedChanges.push(`Created GitHub environment ${productionEnvironment}.`);
    await run.addBreadcrumb({
      detail: `Created GitHub environment ${productionEnvironment}.`,
      status: "passed",
      step: "environment",
    });
  }

  if (environmentPlans[pagesEnvironment].action === "create") {
    createEnvironment(repositorySlug, pagesEnvironment);
    appliedChanges.push(`Created GitHub environment ${pagesEnvironment}.`);
    await run.addBreadcrumb({
      detail: `Created GitHub environment ${pagesEnvironment}.`,
      status: "passed",
      step: "environment",
    });
  }

  if (pagesPlan.action === "create") {
    updatePagesSite(repositorySlug, "POST");
    appliedChanges.push("Enabled GitHub Pages with GitHub Actions workflow deployments.");
    await run.addBreadcrumb({
      detail: "Enabled GitHub Pages with build_type=workflow.",
      status: "passed",
      step: "pages",
    });
  } else if (pagesPlan.action === "update") {
    updatePagesSite(repositorySlug, "PUT");
    appliedChanges.push("Updated GitHub Pages to use GitHub Actions workflow deployments.");
    await run.addBreadcrumb({
      detail: "Updated GitHub Pages to build_type=workflow.",
      status: "passed",
      step: "pages",
    });
  }

  if (secretPlan.action === "set") {
    setEnvironmentVariable(repositorySlug, productionEnvironment, deploymentConfig.githubRoleArnDigestVariableName, roleArnDigest);
    setEnvironmentSecret(repositorySlug, productionEnvironment, deploymentConfig.githubRoleArnSecretName, roleArn);
    appliedChanges.push(`Updated ${productionEnvironment} environment variable ${deploymentConfig.githubRoleArnDigestVariableName}.`);
    appliedChanges.push(`Updated ${productionEnvironment} environment secret ${deploymentConfig.githubRoleArnSecretName}.`);
    await run.addBreadcrumb({
      detail: `Updated ${productionEnvironment} environment digest variable and deploy role secret.`,
      status: "passed",
      step: "secret",
    });
  }
}

const finalProductionEnvironment = loadEnvironmentState(repositorySlug, productionEnvironment);
const finalPagesEnvironment = loadEnvironmentState(repositorySlug, pagesEnvironment);
const finalPagesSite = loadPagesSiteState(repositorySlug);
const finalDigest = finalProductionEnvironment
  ? loadEnvironmentVariable(repositorySlug, productionEnvironment, deploymentConfig.githubRoleArnDigestVariableName)
  : null;

verificationResults.push(
  buildEnvironmentVerificationResult("production environment", productionEnvironment, finalProductionEnvironment !== null, mode),
  buildEnvironmentVerificationResult("github-pages environment", pagesEnvironment, finalPagesEnvironment !== null, mode),
  buildPagesVerificationResult(finalPagesSite, mode),
  {
    detail:
      finalDigest === roleArnDigest
        ? `${productionEnvironment} environment digest ${finalDigest} matches the desired deploy role ARN.`
        : `${productionEnvironment} environment digest did not match the desired deploy role ARN.`,
    name: "deploy role secret digest",
    status: finalDigest === roleArnDigest ? "passed" : mode === "check" ? "skipped" : "failed",
  }
);

const summary = {
  appliedChanges,
  artifactDir: undefined,
  artifactHash: undefined,
  command: commandName,
  discoveredRemoteState: {
    currentDigest,
    currentPagesEnvironment,
    currentPagesSite,
    currentProductionEnvironment,
    finalDigest,
    finalPagesEnvironment,
    finalPagesSite,
    finalProductionEnvironment,
    repositorySlug,
    roleArn,
    roleArnDigest,
  },
  mode,
  plannedChanges: {
    environmentPlans,
    pagesPlan,
    secretPlan,
  },
  resultingUrls: settingsUrls,
  skippedReasons,
  target: "github-setup",
  verificationResults,
};

const { runDirectory } = await writeDeploySummary(summary, { runDirectory: run.runDirectory });

const maybeFailure = verificationResults.find(result => result.status === "failed");
if (maybeFailure) {
  throw new Error(`${maybeFailure.name} verification failed. See ${runDirectory} for details.`);
}

console.log(`GitHub setup ${mode} complete. Summary: ${runDirectory}`);

function allPlansAreNoOps(
  environmentPlans: Record<string, { action: "create" | "none" }>,
  pagesPlan: ReturnType<typeof planGitHubPagesSite>,
  secretPlan: { action: "none" | "set"; reason: string }
) {
  return Object.values(environmentPlans).every(plan => plan.action === "none") && pagesPlan.action === "none" && secretPlan.action === "none";
}

function ensureGitHubCliAvailable() {
  runCommand("gh", ["--version"]);
}

function ensureGitHubAuthentication() {
  runCommand("gh", ["auth", "status"]);
}

function resolveRoleArn(maybeRoleArn: string | undefined) {
  if (maybeRoleArn) {
    return maybeRoleArn;
  }

  if (process.env.AWS_DEPLOY_ROLE_ARN) {
    return process.env.AWS_DEPLOY_ROLE_ARN;
  }

  ensureAwsCliAvailable();
  const identity = loadAwsCallerIdentity();
  return `arn:aws:iam::${identity.Account}:role/${deploymentConfig.awsDeployRoleName}`;
}

function loadEnvironmentState(repositorySlug: string, environmentName: string) {
  const result = runCommand("gh", buildGitHubApiArgs("GET", `repos/${repositorySlug}/environments/${environmentName}`), {
    allowFailure: true,
  });

  if (result.status !== 0) {
    if (isMissingGitHubResource(result.stderr, result.stdout)) {
      return null;
    }

    throw new Error(result.stderr || result.stdout || `Failed to inspect environment ${environmentName}.`);
  }

  return JSON.parse(result.stdout) as GitHubEnvironmentResponse;
}

function createEnvironment(repositorySlug: string, environmentName: string) {
  runGitHubApiJson<GitHubEnvironmentResponse>("PUT", `repos/${repositorySlug}/environments/${environmentName}`, { wait_timer: 0 });
}

function loadPagesSiteState(repositorySlug: string): GitHubPagesSiteState {
  const result = runCommand("gh", buildGitHubApiArgs("GET", `repos/${repositorySlug}/pages`), {
    allowFailure: true,
  });

  if (result.status !== 0) {
    if (isMissingGitHubResource(result.stderr, result.stdout)) {
      return {
        buildType: null,
        exists: false,
      };
    }

    throw new Error(result.stderr || result.stdout || `Failed to inspect GitHub Pages for ${repositorySlug}.`);
  }

  const response = JSON.parse(result.stdout) as GitHubPagesResponse;
  return {
    buildType: response.build_type ?? null,
    exists: true,
    htmlUrl: response.html_url,
    sourceBranch: response.source?.branch ?? null,
    sourcePath: response.source?.path ?? null,
  };
}

function updatePagesSite(repositorySlug: string, method: "POST" | "PUT") {
  runGitHubApiJson<GitHubPagesResponse>(method, `repos/${repositorySlug}/pages`, { build_type: "workflow" });
}

function loadEnvironmentVariable(repositorySlug: string, environmentName: string, variableName: string) {
  const response = runJsonCommand<Array<{ name: string; value?: string }>>("gh", [
    "variable",
    "list",
    "--repo",
    repositorySlug,
    "--env",
    environmentName,
    "--json",
    "name,value",
  ]);

  return response.find(variable => variable.name === variableName)?.value ?? null;
}

function setEnvironmentVariable(repositorySlug: string, environmentName: string, variableName: string, value: string) {
  runCommand("gh", [
    "variable",
    "set",
    variableName,
    "--repo",
    repositorySlug,
    "--env",
    environmentName,
    "--body",
    value,
  ]);
}

function setEnvironmentSecret(repositorySlug: string, environmentName: string, secretName: string, value: string) {
  runCommand("gh", [
    "secret",
    "set",
    secretName,
    "--repo",
    repositorySlug,
    "--env",
    environmentName,
    "--body",
    value,
  ]);
}

function buildEnvironmentVerificationResult(name: string, environmentName: string, exists: boolean, mode: "apply" | "check"): DeployVerificationResult {
  return {
    detail: exists ? `${environmentName} exists.` : `${environmentName} does not exist yet.`,
    name,
    status: exists ? "passed" : mode === "check" ? "skipped" : "failed",
  };
}

function buildPagesVerificationResult(state: GitHubPagesSiteState, mode: "apply" | "check"): DeployVerificationResult {
  const configured = state.exists && state.buildType === "workflow";

  return {
    detail: configured
      ? `GitHub Pages is enabled with build_type=workflow.`
      : state.exists
        ? `GitHub Pages exists but is configured with build_type=${state.buildType ?? "unknown"}.`
        : "GitHub Pages is not enabled yet.",
    name: "GitHub Pages workflow mode",
    status: configured ? "passed" : mode === "check" ? "skipped" : "failed",
  };
}

function buildGitHubApiArgs(method: "GET" | "POST" | "PUT", endpoint: string, body?: Record<string, unknown>) {
  const args = [
    "api",
    "--method",
    method,
    "-H",
    "Accept: application/vnd.github+json",
    "-H",
    `X-GitHub-Api-Version: ${deploymentConfig.githubApiVersion}`,
    endpoint,
  ];

  if (body) {
    args.push("-H", "Content-Type: application/json");
    args.push("--input", "-");
  }

  return args;
}

function runGitHubApiJson<T>(method: "GET" | "POST" | "PUT", endpoint: string, body?: Record<string, unknown>) {
  return runJsonCommand<T>("gh", buildGitHubApiArgs(method, endpoint, body), {
    stdin: body ? JSON.stringify(body) : undefined,
  });
}

function isMissingGitHubResource(stderr: string, stdout: string) {
  return /(http 404|not found)/i.test(`${stderr}\n${stdout}`);
}

function parseArgs(rawArgs: string[]) {
  return rawArgs.reduce<Record<string, string>>((accumulator, currentArg) => {
    if (!currentArg.startsWith("--")) {
      return accumulator;
    }

    const [key, value = "true"] = currentArg.slice(2).split("=");
    accumulator[key] = value;
    return accumulator;
  }, {});
}
