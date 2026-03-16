import { deploymentConfig } from "../../src/lib/deployment-config";
import {
  buildSiteBucketName,
  createStackChangeSet,
  deleteChangeSet,
  ensureAwsCliAvailable,
  executeChangeSet,
  loadAwsCallerIdentity,
  loadStackState,
  resolveHostedZones,
  validateAwsTemplate,
  waitForChangeSet,
} from "../lib/aws-deploy";
import {
  createDeployRun,
  type DeployBreadcrumb,
  type DeployRunContext,
  type DeployVerificationResult,
  writeDeploySummary,
} from "../lib/deploy-log";

const args = parseArgs(process.argv.slice(2));
const mode: "apply" | "check" = args.apply === "true" ? "apply" : "check";
const commandName = "deploy:aws:bootstrap";
const run = await createDeployRun({
  command: commandName,
  mode,
  target: "aws",
});

await run.addBreadcrumb({
  detail: "Validating AWS CLI access and current stack prerequisites.",
  status: "info",
  step: "initialize",
});
await recordTimedAction(
  run,
  {
    detail: "Validated AWS CLI access.",
    status: "passed",
    step: "aws cli",
  },
  () => ensureAwsCliAvailable(),
);

const identity = await recordTimedAction(
  run,
  {
    data: (currentIdentity: ReturnType<typeof loadAwsCallerIdentity>) => ({
      accountId: currentIdentity.Account,
      arn: currentIdentity.Arn,
      userId: currentIdentity.UserId,
    }),
    detail: "Loaded the active AWS caller identity.",
    status: "passed",
    step: "caller identity",
  },
  () => loadAwsCallerIdentity(),
);
const hostedZones = await recordTimedAction(
  run,
  {
    data: (resolvedHostedZones: ReturnType<typeof resolveHostedZones>) => resolvedHostedZones,
    detail: "Resolved the canonical and redirect Route 53 hosted zones.",
    status: "passed",
    step: "hosted zones",
  },
  () => resolveHostedZones(),
);
const bucketName = buildSiteBucketName(identity.Account);
const templateValidation = await recordTimedAction(
  run,
  {
    detail: `Validated CloudFormation template ${deploymentConfig.awsStackName}.`,
    status: "passed",
    step: "template validation",
  },
  () => validateAwsTemplate(),
);
const currentStackState = await recordTimedAction(
  run,
  {
    data: (stackState: ReturnType<typeof loadStackState>) => ({
      exists: stackState.exists,
      stackId: stackState.stackId,
      stackStatus: stackState.stackStatus,
    }),
    detail: "Loaded the current CloudFormation stack state.",
    status: "passed",
    step: "stack state",
  },
  () => loadStackState(),
);
const { changeSetName, changeSetType } = await recordTimedAction(
  run,
  {
    data: (changeSet: ReturnType<typeof createStackChangeSet>) => ({
      bucketName,
      changeSetName: changeSet.changeSetName,
      changeSetType: changeSet.changeSetType,
      stackExists: currentStackState.exists,
    }),
    detail: "Created the CloudFormation change set.",
    status: "planned",
    step: "change set create",
  },
  () => createStackChangeSet(hostedZones, bucketName, currentStackState.exists),
);
const changeSetPlan = await recordTimedAction(
  run,
  {
    data: (plan: ReturnType<typeof waitForChangeSet>) => ({
      changeCount: plan.changes.length,
      isEmpty: plan.isEmpty,
      rawStatus: plan.rawStatus,
      rawStatusReason: plan.rawStatusReason,
    }),
    detail: "Waited for the CloudFormation change set to reach a terminal state.",
    status: "planned",
    step: "change set wait",
  },
  () => waitForChangeSet(changeSetName, changeSetType),
);

await run.addBreadcrumb({
  data: {
    bucketName,
    changeSetName,
    changeSetType,
    hostedZones,
    stackExists: currentStackState.exists,
  },
  detail: "Created and inspected the CloudFormation change set.",
  status: "planned",
  step: "plan",
});

const skippedReasons: string[] = [];
const appliedChanges: string[] = [];
const verificationResults: DeployVerificationResult[] = [
  {
    detail: `Validated ${deploymentConfig.awsStackName} CloudFormation template.`,
    name: "template",
    status: "passed",
  },
];

try {
  if (changeSetPlan.isEmpty) {
    skippedReasons.push(
      `CloudFormation reported no infrastructure changes: ${changeSetPlan.rawStatusReason}`,
    );
    await run.addBreadcrumb({
      detail: `No infrastructure changes were needed: ${changeSetPlan.rawStatusReason}`,
      status: "skipped",
      step: "apply",
    });
  } else if (mode === "check") {
    skippedReasons.push(`Check mode only. Change set ${changeSetName} was not executed.`);
    await run.addBreadcrumb({
      detail: `Check mode prevented execution of change set ${changeSetName}.`,
      status: "skipped",
      step: "apply",
    });
  } else {
    await recordTimedAction(
      run,
      {
        detail: `Executed ${changeSetType.toLowerCase()} change set ${changeSetName}.`,
        status: "passed",
        step: "apply",
      },
      () => executeChangeSet(changeSetName, changeSetType),
    );
    appliedChanges.push(`Executed ${changeSetType.toLowerCase()} change set ${changeSetName}.`);
    verificationResults.push({
      detail: `Stack ${deploymentConfig.awsStackName} reached a complete state after executing ${changeSetType.toLowerCase()}.`,
      name: "stack",
      status: "passed",
    });
  }
} finally {
  await recordTimedAction(
    run,
    {
      detail: `Deleted CloudFormation change set ${changeSetName}.`,
      status: "passed",
      step: "cleanup",
    },
    () => deleteChangeSet(changeSetName),
  );
}

const finalStackState = await recordTimedAction(
  run,
  {
    data: (stackState: ReturnType<typeof loadStackState>) => ({
      exists: stackState.exists,
      stackId: stackState.stackId,
      stackStatus: stackState.stackStatus,
    }),
    detail: "Loaded the final CloudFormation stack state after the run.",
    status: "passed",
    step: "final stack state",
  },
  () => loadStackState(),
);
const summary = {
  appliedChanges,
  artifactDir: undefined,
  artifactHash: undefined,
  command: commandName,
  discoveredRemoteState: {
    currentStackState,
    finalStackState,
    hostedZones,
    identity,
    templateValidation,
  },
  mode,
  plannedChanges: changeSetPlan,
  resultingUrls: [
    deploymentConfig.canonicalOrigin,
    ...(finalStackState.outputs.DistributionDomainName
      ? [`https://${finalStackState.outputs.DistributionDomainName}`]
      : []),
  ],
  skippedReasons,
  target: "aws",
  verificationResults,
};

const { runDirectory } = await writeDeploySummary(summary, { runDirectory: run.runDirectory });
console.log(`AWS bootstrap ${mode} complete. Summary: ${runDirectory}`);

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

async function recordTimedAction<T>(
  run: DeployRunContext,
  breadcrumb: Omit<DeployBreadcrumb, "at" | "durationMs" | "startedAt"> & {
    data?: unknown | ((result: T) => unknown);
    failureDetail?: string | ((error: Error) => string);
  },
  action: () => Promise<T> | T,
) {
  const startedAtMs = Date.now();
  const startedAt = new Date(startedAtMs).toISOString();

  try {
    const result = await action();
    await run.addBreadcrumb({
      ...breadcrumb,
      data: typeof breadcrumb.data === "function" ? breadcrumb.data(result) : breadcrumb.data,
      durationMs: Date.now() - startedAtMs,
      startedAt,
    });
    return result;
  } catch (error) {
    const errorDetail = error instanceof Error ? error.message : String(error);
    await run.addBreadcrumb({
      detail:
        typeof breadcrumb.failureDetail === "function"
          ? breadcrumb.failureDetail(error instanceof Error ? error : new Error(errorDetail))
          : (breadcrumb.failureDetail ?? `${breadcrumb.detail} Failed: ${errorDetail}`),
      durationMs: Date.now() - startedAtMs,
      startedAt,
      status: "failed",
      step: breadcrumb.step,
    });
    throw error;
  }
}
