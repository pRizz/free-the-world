import { deploymentConfig } from "../../src/lib/deployment-config";
import { runCommand, runJsonCommand } from "../lib/command";
import { createDeployRun, writeDeploySummary, type DeployVerificationResult } from "../lib/deploy-log";
import { resolveGitHubRepositorySlug } from "../lib/github-repository";

interface WorkflowRunsResponse {
  workflow_runs?: Array<{
    conclusion?: string | null;
    created_at?: string;
    display_title?: string;
    event?: string;
    head_branch?: string;
    head_sha?: string;
    html_url?: string;
    id?: number;
    status?: string;
  }>;
}

const args = parseArgs(process.argv.slice(2));
const mode: "apply" | "check" = args.apply === "true" ? "apply" : "check";
const commandName = "deploy:github:dispatch";
const run = await createDeployRun({
  command: commandName,
  mode,
  target: "github-workflow-dispatch",
});

await run.addBreadcrumb({
  detail: "Validating GitHub CLI access and loading the deploy workflow state.",
  status: "info",
  step: "initialize",
});

runCommand("gh", ["--version"]);
runCommand("gh", ["auth", "status"]);

const repositorySlug = resolveGitHubRepositorySlug(args.repo);
const ref = resolveRef(args.ref);
const headSha = runCommand("git", ["rev-parse", ref]).stdout.trim();
const workflowFile = args.workflow ?? deploymentConfig.githubWorkflowFileName;
const workflowRuns = loadWorkflowRuns(repositorySlug, workflowFile, ref);
const existingRun = workflowRuns.workflow_runs?.find(runRecord => runRecord.head_sha === headSha && isReusableRun(runRecord.conclusion, runRecord.status));
const actionsUrl = `https://github.com/${repositorySlug}/actions/workflows/${workflowFile}`;

await run.addBreadcrumb({
  data: {
    actionsUrl,
    existingRun,
    headSha,
    ref,
    repositorySlug,
    workflowFile,
  },
  detail: "Loaded the existing workflow runs for the requested ref.",
  status: "passed",
  step: "context",
});

const skippedReasons: string[] = [];
const appliedChanges: string[] = [];
const verificationResults: DeployVerificationResult[] = [];

if (existingRun) {
  skippedReasons.push(
    `A reusable workflow run already exists for ${ref}@${headSha}: ${existingRun.html_url ?? existingRun.id ?? existingRun.display_title ?? "existing run"}.`
  );
  await run.addBreadcrumb({
    detail: `Skipped dispatch because a reusable run already exists for ${ref}@${headSha}.`,
    status: "skipped",
    step: "dispatch",
  });
  verificationResults.push({
    detail: existingRun.html_url ?? `Run ${existingRun.id ?? "unknown"} already covers ${ref}@${headSha}.`,
    name: "existing workflow run",
    status: "passed",
  });
} else if (mode === "check") {
  skippedReasons.push(`Check mode only. Workflow ${workflowFile} was not dispatched for ${ref}@${headSha}.`);
  await run.addBreadcrumb({
    detail: `Check mode prevented dispatch for ${ref}@${headSha}.`,
    status: "skipped",
    step: "dispatch",
  });
  verificationResults.push({
    detail: `No reusable workflow run exists yet for ${ref}@${headSha}.`,
    name: "workflow dispatch plan",
    status: "passed",
  });
} else {
  runCommand(
    "gh",
    [
      "api",
      "--method",
      "POST",
      "-H",
      "Accept: application/vnd.github+json",
      "-H",
      `X-GitHub-Api-Version: ${deploymentConfig.githubApiVersion}`,
      "-H",
      "Content-Type: application/json",
      `repos/${repositorySlug}/actions/workflows/${workflowFile}/dispatches`,
      "--input",
      "-",
    ],
    {
      stdin: JSON.stringify({ ref }),
    }
  );

  appliedChanges.push(`Dispatched ${workflowFile} for ${ref}@${headSha}.`);
  await run.addBreadcrumb({
    detail: `Dispatched ${workflowFile} for ${ref}@${headSha}.`,
    status: "passed",
    step: "dispatch",
  });
  verificationResults.push({
    detail: `Workflow dispatch request accepted for ${ref}@${headSha}.`,
    name: "workflow dispatch",
    status: "passed",
  });
}

const { runDirectory } = await writeDeploySummary(
  {
    appliedChanges,
    artifactDir: undefined,
    artifactHash: undefined,
    command: commandName,
    discoveredRemoteState: {
      existingRun,
      headSha,
      ref,
      repositorySlug,
      workflowRuns,
    },
    mode,
    plannedChanges: {
      actionsUrl,
      ref,
      workflowFile,
      willDispatch: !existingRun,
    },
    resultingUrls: existingRun?.html_url ? [actionsUrl, existingRun.html_url] : [actionsUrl],
    skippedReasons,
    target: "github-workflow-dispatch",
    verificationResults,
  },
  { runDirectory: run.runDirectory }
);

console.log(`GitHub workflow dispatch ${mode} complete. Summary: ${runDirectory}`);

function resolveRef(maybeRef: string | undefined) {
  if (maybeRef) {
    return maybeRef;
  }

  const currentBranch = runCommand("git", ["branch", "--show-current"]).stdout.trim();
  return currentBranch || "main";
}

function loadWorkflowRuns(repositorySlug: string, workflowFile: string, ref: string) {
  return runJsonCommand<WorkflowRunsResponse>("gh", [
    "api",
    "--method",
    "GET",
    "-H",
    "Accept: application/vnd.github+json",
    "-H",
    `X-GitHub-Api-Version: ${deploymentConfig.githubApiVersion}`,
    `repos/${repositorySlug}/actions/workflows/${workflowFile}/runs?branch=${encodeURIComponent(ref)}&per_page=20`,
  ]);
}

function isReusableRun(conclusion: string | null | undefined, status: string | undefined) {
  if (status === "queued" || status === "in_progress" || status === "requested" || status === "waiting") {
    return true;
  }

  return conclusion === "success";
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
