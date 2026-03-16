import path from "node:path";
import { deploymentConfig, getHostedDomains } from "../../src/lib/deployment-config";
import { runCommand, runJsonCommand } from "./command";

interface AwsCallerIdentity {
  Account: string;
  Arn: string;
  UserId: string;
}

interface HostedZoneRecord {
  Config?: {
    PrivateZone?: boolean;
  };
  Id: string;
  Name: string;
}

interface ListHostedZonesResponse {
  HostedZones: HostedZoneRecord[];
}

interface StackOutputRecord {
  OutputKey?: string;
  OutputValue?: string;
}

interface DescribeStacksResponse {
  Stacks?: Array<{
    Outputs?: StackOutputRecord[];
    StackId?: string;
    StackName?: string;
    StackStatus?: string;
  }>;
}

interface ChangeSetResponse {
  Changes?: Array<{
    ResourceChange?: {
      Action?: string;
      LogicalResourceId?: string;
      Replacement?: string;
      ResourceType?: string;
    };
  }>;
  ExecutionStatus?: string;
  StackId?: string;
  Status?: string;
  StatusReason?: string;
}

export interface AwsStackState {
  exists: boolean;
  outputs: Record<string, string>;
  stackId?: string;
  stackName?: string;
  stackStatus?: string;
}

export interface ResolvedHostedZones {
  canonical: string;
  redirects: [string, string, string];
}

export interface ChangeSetPlan {
  changeSetName: string;
  changeSetType: "CREATE" | "UPDATE";
  changes: Array<{
    action: string;
    logicalResourceId: string;
    replacement: string;
    resourceType: string;
  }>;
  isEmpty: boolean;
  rawStatus: string;
  rawStatusReason: string;
}

export function ensureAwsCliAvailable() {
  runCommand("aws", ["--version"]);
}

export function getAwsTemplatePath() {
  return path.resolve("infra/aws/static-site.yaml");
}

export function loadAwsCallerIdentity() {
  return runJsonCommand<AwsCallerIdentity>("aws", ["sts", "get-caller-identity", "--output", "json"]);
}

export function buildSiteBucketName(accountId: string) {
  return `${deploymentConfig.bucketNamePrefix}-${accountId.toLowerCase()}`;
}

export function resolveHostedZones() {
  const [canonicalDomain, ...redirectDomains] = getHostedDomains();

  return {
    canonical: resolveHostedZoneId(canonicalDomain),
    redirects: [
      resolveHostedZoneId(redirectDomains[0]!),
      resolveHostedZoneId(redirectDomains[1]!),
      resolveHostedZoneId(redirectDomains[2]!),
    ],
  } satisfies ResolvedHostedZones;
}

export function validateAwsTemplate(templatePath = getAwsTemplatePath()) {
  return runJsonCommand<Record<string, unknown>>("aws", [
    "cloudformation",
    "validate-template",
    "--region",
    deploymentConfig.awsRegion,
    "--template-body",
    `file://${templatePath}`,
    "--output",
    "json",
  ]);
}

export function loadStackState(stackName = deploymentConfig.awsStackName): AwsStackState {
  const result = runCommand(
    "aws",
    ["cloudformation", "describe-stacks", "--region", deploymentConfig.awsRegion, "--stack-name", stackName, "--output", "json"],
    { allowFailure: true }
  );

  if (result.status !== 0) {
    const stackMissingPattern = /does not exist/i;
    if (stackMissingPattern.test(result.stderr) || stackMissingPattern.test(result.stdout)) {
      return {
        exists: false,
        outputs: {},
      };
    }

    throw new Error(result.stderr || result.stdout || `Failed to load stack state for ${stackName}.`);
  }

  const response = JSON.parse(result.stdout) as DescribeStacksResponse;
  const stack = response.Stacks?.[0];

  if (!stack) {
    return {
      exists: false,
      outputs: {},
    };
  }

  return {
    exists: true,
    outputs: Object.fromEntries(
      (stack.Outputs ?? [])
        .filter((output): output is Required<Pick<StackOutputRecord, "OutputKey" | "OutputValue">> => Boolean(output.OutputKey && output.OutputValue))
        .map(output => [output.OutputKey, output.OutputValue])
    ),
    stackId: stack.StackId,
    stackName: stack.StackName,
    stackStatus: stack.StackStatus,
  };
}

export function createStackChangeSet(hostedZones: ResolvedHostedZones, bucketName: string, stackExists: boolean) {
  const changeSetType: "CREATE" | "UPDATE" = stackExists ? "UPDATE" : "CREATE";
  const changeSetName = `${deploymentConfig.awsStackName}-${Date.now()}`;
  const redirectDomains = deploymentConfig.redirectDomains;

  runCommand("aws", [
    "cloudformation",
    "create-change-set",
    "--region",
    deploymentConfig.awsRegion,
    "--stack-name",
    deploymentConfig.awsStackName,
    "--change-set-name",
    changeSetName,
    "--change-set-type",
    changeSetType,
    "--template-body",
    `file://${getAwsTemplatePath()}`,
    "--parameters",
    formatCloudFormationParameter("SiteBucketName", bucketName),
    formatCloudFormationParameter("CanonicalDomain", deploymentConfig.canonicalDomain),
    formatCloudFormationParameter("CanonicalHostedZoneId", hostedZones.canonical),
    formatCloudFormationParameter("RedirectDomainOne", redirectDomains[0]),
    formatCloudFormationParameter("RedirectHostedZoneIdOne", hostedZones.redirects[0]),
    formatCloudFormationParameter("RedirectDomainTwo", redirectDomains[1]),
    formatCloudFormationParameter("RedirectHostedZoneIdTwo", hostedZones.redirects[1]),
    formatCloudFormationParameter("RedirectDomainThree", redirectDomains[2]),
    formatCloudFormationParameter("RedirectHostedZoneIdThree", hostedZones.redirects[2]),
    "--output",
    "json",
  ]);

  return {
    changeSetName,
    changeSetType,
  };
}

export function waitForChangeSet(changeSetName: string, changeSetType: "CREATE" | "UPDATE") {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 10 * 60 * 1000) {
    const response = runJsonCommand<ChangeSetResponse>("aws", [
      "cloudformation",
      "describe-change-set",
      "--region",
      deploymentConfig.awsRegion,
      "--stack-name",
      deploymentConfig.awsStackName,
      "--change-set-name",
      changeSetName,
      "--output",
      "json",
    ]);

    const status = response.Status ?? "";
    const statusReason = response.StatusReason ?? "";

    if (status === "CREATE_COMPLETE") {
      return {
        changeSetName,
        changeSetType,
        changes:
          response.Changes?.map(change => ({
            action: change.ResourceChange?.Action ?? "Unknown",
            logicalResourceId: change.ResourceChange?.LogicalResourceId ?? "Unknown",
            replacement: change.ResourceChange?.Replacement ?? "Unknown",
            resourceType: change.ResourceChange?.ResourceType ?? "Unknown",
          })) ?? [],
        isEmpty: false,
        rawStatus: status,
        rawStatusReason: statusReason,
      } satisfies ChangeSetPlan;
    }

    if (status === "FAILED") {
      const noChangePatterns = [/didn'?t contain changes/i, /no updates are to be performed/i];
      const isEmpty = noChangePatterns.some(pattern => pattern.test(statusReason));

      if (!isEmpty) {
        throw new Error(`Change set ${changeSetName} failed: ${statusReason}`);
      }

      return {
        changeSetName,
        changeSetType,
        changes: [],
        isEmpty,
        rawStatus: status,
        rawStatusReason: statusReason,
      } satisfies ChangeSetPlan;
    }

    sleep(5_000);
  }

  throw new Error(`Timed out waiting for change set ${changeSetName}.`);
}

export function executeChangeSet(changeSetName: string, changeSetType: "CREATE" | "UPDATE") {
  runCommand("aws", [
    "cloudformation",
    "execute-change-set",
    "--region",
    deploymentConfig.awsRegion,
    "--stack-name",
    deploymentConfig.awsStackName,
    "--change-set-name",
    changeSetName,
  ]);

  const waiter = changeSetType === "CREATE" ? "stack-create-complete" : "stack-update-complete";
  runCommand("aws", ["cloudformation", "wait", waiter, "--region", deploymentConfig.awsRegion, "--stack-name", deploymentConfig.awsStackName]);
}

export function deleteChangeSet(changeSetName: string) {
  runCommand(
    "aws",
    [
      "cloudformation",
      "delete-change-set",
      "--region",
      deploymentConfig.awsRegion,
      "--stack-name",
      deploymentConfig.awsStackName,
      "--change-set-name",
      changeSetName,
    ],
    { allowFailure: true }
  );
}

function resolveHostedZoneId(domain: string) {
  const response = runJsonCommand<ListHostedZonesResponse>("aws", [
    "route53",
    "list-hosted-zones-by-name",
    "--dns-name",
    domain,
    "--max-items",
    "10",
    "--output",
    "json",
  ]);

  const expectedZoneName = `${domain}.`;
  const maybeZone = response.HostedZones.find(zone => zone.Name === expectedZoneName && zone.Config?.PrivateZone !== true);

  if (!maybeZone) {
    throw new Error(`Could not find a public Route 53 hosted zone for ${domain}.`);
  }

  return maybeZone.Id.replace("/hostedzone/", "");
}

function formatCloudFormationParameter(key: string, value: string) {
  return `ParameterKey=${key},ParameterValue=${value}`;
}

function sleep(milliseconds: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}
