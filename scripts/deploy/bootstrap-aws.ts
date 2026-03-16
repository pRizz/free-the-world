import { buildSiteBucketName, createStackChangeSet, deleteChangeSet, ensureAwsCliAvailable, executeChangeSet, loadAwsCallerIdentity, loadStackState, resolveHostedZones, validateAwsTemplate, waitForChangeSet } from "../lib/aws-deploy";
import { createDeployRun, writeDeploySummary, type DeployVerificationResult } from "../lib/deploy-log";
import { deploymentConfig } from "../../src/lib/deployment-config";

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
ensureAwsCliAvailable();

const identity = loadAwsCallerIdentity();
const hostedZones = resolveHostedZones();
const bucketName = buildSiteBucketName(identity.Account);
const templateValidation = validateAwsTemplate();
const currentStackState = loadStackState();
const { changeSetName, changeSetType } = createStackChangeSet(hostedZones, bucketName, currentStackState.exists);
const changeSetPlan = waitForChangeSet(changeSetName, changeSetType);

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
    skippedReasons.push(`CloudFormation reported no infrastructure changes: ${changeSetPlan.rawStatusReason}`);
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
    executeChangeSet(changeSetName, changeSetType);
    appliedChanges.push(`Executed ${changeSetType.toLowerCase()} change set ${changeSetName}.`);
    await run.addBreadcrumb({
      detail: `Executed ${changeSetType.toLowerCase()} change set ${changeSetName}.`,
      status: "passed",
      step: "apply",
    });
    verificationResults.push({
      detail: `Stack ${deploymentConfig.awsStackName} reached a complete state after executing ${changeSetType.toLowerCase()}.`,
      name: "stack",
      status: "passed",
    });
  }
} finally {
  deleteChangeSet(changeSetName);
}

const finalStackState = loadStackState();
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
    ...(finalStackState.outputs["DistributionDomainName"] ? [`https://${finalStackState.outputs["DistributionDomainName"]}`] : []),
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
