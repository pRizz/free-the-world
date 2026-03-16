import path from "node:path";
import { deploymentConfig } from "../../src/lib/deployment-config";
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

export type AwsHostedDomainKind = "canonical" | "live" | "redirect";

export interface AwsStackState {
  exists: boolean;
  outputs: Record<string, string>;
  stackId?: string;
  stackName?: string;
  stackStatus?: string;
}

export interface HostedZoneReadinessEntry {
  domain: string;
  kind: AwsHostedDomainKind;
  label: string;
  ready: boolean;
  blocker?: string;
  zoneId?: string;
}

export interface ResolvedHostedZoneEntry {
  domain: string;
  kind: AwsHostedDomainKind;
  label: string;
  zoneId: string;
}

export interface ResolvedHostedZones {
  all: ResolvedHostedZoneEntry[];
  canonical: ResolvedHostedZoneEntry;
  live: ResolvedHostedZoneEntry[];
  redirects: ResolvedHostedZoneEntry[];
}

export interface DomainReadinessAssessment {
  all: HostedZoneReadinessEntry[];
  blockers: string[];
  canonical: HostedZoneReadinessEntry;
  live: HostedZoneReadinessEntry[];
  ready: boolean;
  redirects: HostedZoneReadinessEntry[];
}

export class DomainReadinessError extends Error {
  constructor(readonly assessment: DomainReadinessAssessment) {
    super(formatDomainReadinessMessage(assessment));
    this.name = "DomainReadinessError";
  }
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

interface HostedZoneSpec {
  domain: string;
  kind: AwsHostedDomainKind;
  label: string;
}

export function ensureAwsCliAvailable() {
  runCommand("aws", ["--version"]);
}

export function getAwsTemplatePath() {
  return path.resolve("infra/aws/static-site.yaml");
}

export function loadAwsCallerIdentity() {
  return runJsonCommand<AwsCallerIdentity>("aws", [
    "sts",
    "get-caller-identity",
    "--output",
    "json",
  ]);
}

export function buildSiteBucketName(accountId: string) {
  return `${deploymentConfig.bucketNamePrefix}-${accountId.toLowerCase()}`;
}

export function assessAwsDomainReadiness() {
  const entries = getHostedZoneSpecs().map((spec) => {
    const zone = maybeResolveHostedZone(spec.domain);

    return {
      ...spec,
      blocker: zone
        ? undefined
        : `No public Route 53 hosted zone covers ${spec.domain}. ACM validation and alias records for this host are still blocked until registration, delegation, or hosted-zone setup finishes.`,
      ready: zone !== null,
      zoneId: zone?.id,
    } satisfies HostedZoneReadinessEntry;
  });

  return buildDomainReadinessAssessment(entries);
}

export function formatDomainReadinessMessage(assessment: DomainReadinessAssessment) {
  const blockerLines = assessment.blockers.map((blocker) => `- ${blocker}`);

  return [
    "AWS domain readiness is still pending for the freetheworld.ai rollout.",
    ...blockerLines,
    "Check mode can still report the pending state, but apply mode must wait until the missing hosted zones exist.",
  ].join("\n");
}

export function buildDomainReadinessAssessment(entries: HostedZoneReadinessEntry[]) {
  const canonical = entries.find((entry) => entry.kind === "canonical");
  if (!canonical) {
    throw new Error("Expected a primary canonical AWS host in the deployment config.");
  }

  const live = entries.filter((entry) => entry.kind === "live");
  const redirects = entries.filter((entry) => entry.kind === "redirect");

  return {
    all: entries,
    blockers: entries
      .filter((entry) => !entry.ready && entry.blocker)
      .map((entry) => entry.blocker as string),
    canonical,
    live,
    ready: entries.every((entry) => entry.ready),
    redirects,
  } satisfies DomainReadinessAssessment;
}

export function resolveHostedZones() {
  const readiness = assessAwsDomainReadiness();

  if (!readiness.ready) {
    throw new DomainReadinessError(readiness);
  }

  const all = readiness.all.map((entry) => {
    if (!entry.zoneId) {
      throw new Error(`Expected ${entry.domain} to have a resolved hosted zone ID.`);
    }

    return {
      domain: entry.domain,
      kind: entry.kind,
      label: entry.label,
      zoneId: entry.zoneId,
    } satisfies ResolvedHostedZoneEntry;
  });

  const canonical = all.find((entry) => entry.kind === "canonical");
  if (!canonical) {
    throw new Error("Expected a primary canonical hosted zone entry.");
  }

  return {
    all,
    canonical,
    live: all.filter((entry) => entry.kind === "live"),
    redirects: all.filter((entry) => entry.kind === "redirect"),
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
    [
      "cloudformation",
      "describe-stacks",
      "--region",
      deploymentConfig.awsRegion,
      "--stack-name",
      stackName,
      "--output",
      "json",
    ],
    { allowFailure: true },
  );

  if (result.status !== 0) {
    const stackMissingPattern = /does not exist/i;
    if (stackMissingPattern.test(result.stderr) || stackMissingPattern.test(result.stdout)) {
      return {
        exists: false,
        outputs: {},
      };
    }

    throw new Error(
      result.stderr || result.stdout || `Failed to load stack state for ${stackName}.`,
    );
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
        .filter(
          (output): output is Required<Pick<StackOutputRecord, "OutputKey" | "OutputValue">> =>
            Boolean(output.OutputKey && output.OutputValue),
        )
        .map((output) => [output.OutputKey, output.OutputValue]),
    ),
    stackId: stack.StackId,
    stackName: stack.StackName,
    stackStatus: stack.StackStatus,
  };
}

export function createStackChangeSet(
  hostedZones: ResolvedHostedZones,
  bucketName: string,
  stackExists: boolean,
) {
  const changeSetType: "CREATE" | "UPDATE" = stackExists ? "UPDATE" : "CREATE";
  const changeSetName = `${deploymentConfig.awsStackName}-${Date.now()}`;
  const [secondaryLiveDomain] = deploymentConfig.secondaryLiveDomains;
  const [secondaryLiveHostedZone] = hostedZones.live;
  const [redirectDomainOne, redirectDomainTwo, redirectDomainThree, redirectDomainFour] =
    deploymentConfig.redirectDomains;
  const [
    redirectHostedZoneOne,
    redirectHostedZoneTwo,
    redirectHostedZoneThree,
    redirectHostedZoneFour,
  ] = hostedZones.redirects;

  assertExpectedDomainLayout(
    secondaryLiveDomain,
    secondaryLiveHostedZone,
    redirectDomainOne,
    redirectDomainTwo,
    redirectDomainThree,
    redirectDomainFour,
    redirectHostedZoneOne,
    redirectHostedZoneTwo,
    redirectHostedZoneThree,
    redirectHostedZoneFour,
  );

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
    formatCloudFormationParameter("PrimaryDomain", deploymentConfig.primaryCanonicalDomain),
    formatCloudFormationParameter("PrimaryHostedZoneId", hostedZones.canonical.zoneId),
    formatCloudFormationParameter("SecondaryLiveDomainOne", secondaryLiveDomain),
    formatCloudFormationParameter("SecondaryLiveHostedZoneIdOne", secondaryLiveHostedZone.zoneId),
    formatCloudFormationParameter("RedirectDomainOne", redirectDomainOne),
    formatCloudFormationParameter("RedirectHostedZoneIdOne", redirectHostedZoneOne.zoneId),
    formatCloudFormationParameter("RedirectDomainTwo", redirectDomainTwo),
    formatCloudFormationParameter("RedirectHostedZoneIdTwo", redirectHostedZoneTwo.zoneId),
    formatCloudFormationParameter("RedirectDomainThree", redirectDomainThree),
    formatCloudFormationParameter("RedirectHostedZoneIdThree", redirectHostedZoneThree.zoneId),
    formatCloudFormationParameter("RedirectDomainFour", redirectDomainFour),
    formatCloudFormationParameter("RedirectHostedZoneIdFour", redirectHostedZoneFour.zoneId),
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
          response.Changes?.map((change) => ({
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
      const isEmpty = noChangePatterns.some((pattern) => pattern.test(statusReason));

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
  runCommand("aws", [
    "cloudformation",
    "wait",
    waiter,
    "--region",
    deploymentConfig.awsRegion,
    "--stack-name",
    deploymentConfig.awsStackName,
  ]);
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
    { allowFailure: true },
  );
}

function getHostedZoneSpecs() {
  const liveSpecs = deploymentConfig.secondaryLiveDomains.map((domain, index) => ({
    domain,
    kind: "live" as const,
    label: `secondary live host ${index + 1}`,
  }));
  const redirectSpecs = deploymentConfig.redirectDomains.map((domain, index) => ({
    domain,
    kind: "redirect" as const,
    label: `redirect host ${index + 1}`,
  }));

  return [
    {
      domain: deploymentConfig.primaryCanonicalDomain,
      kind: "canonical" as const,
      label: "primary canonical host",
    },
    ...liveSpecs,
    ...redirectSpecs,
  ] satisfies HostedZoneSpec[];
}

function maybeResolveHostedZone(domain: string) {
  const candidates = buildHostedZoneCandidates(domain);

  for (const candidate of candidates) {
    const zone = maybeResolveHostedZoneByName(candidate);
    if (zone) {
      return zone;
    }
  }

  return null;
}

function maybeResolveHostedZoneByName(domain: string) {
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
  const maybeZone = response.HostedZones.find(
    (zone) => zone.Name === expectedZoneName && zone.Config?.PrivateZone !== true,
  );

  return maybeZone
    ? {
        id: maybeZone.Id.replace("/hostedzone/", ""),
        name: maybeZone.Name,
      }
    : null;
}

function buildHostedZoneCandidates(domain: string) {
  const labels = domain.split(".");
  const candidates: string[] = [];

  for (let index = 0; index < labels.length - 1; index += 1) {
    candidates.push(labels.slice(index).join("."));
  }

  return candidates;
}

function assertExpectedDomainLayout(
  secondaryLiveDomain: string | undefined,
  secondaryLiveHostedZone: ResolvedHostedZoneEntry | undefined,
  redirectDomainOne: string | undefined,
  redirectDomainTwo: string | undefined,
  redirectDomainThree: string | undefined,
  redirectDomainFour: string | undefined,
  redirectHostedZoneOne: ResolvedHostedZoneEntry | undefined,
  redirectHostedZoneTwo: ResolvedHostedZoneEntry | undefined,
  redirectHostedZoneThree: ResolvedHostedZoneEntry | undefined,
  redirectHostedZoneFour: ResolvedHostedZoneEntry | undefined,
) {
  if (
    !secondaryLiveDomain ||
    !secondaryLiveHostedZone ||
    !redirectDomainOne ||
    !redirectDomainTwo ||
    !redirectDomainThree ||
    !redirectDomainFour ||
    !redirectHostedZoneOne ||
    !redirectHostedZoneTwo ||
    !redirectHostedZoneThree ||
    !redirectHostedZoneFour
  ) {
    throw new Error(
      "Expected one secondary live domain and four redirect domains in the deployment config and hosted-zone state.",
    );
  }
}

function formatCloudFormationParameter(key: string, value: string) {
  return `ParameterKey=${key},ParameterValue=${value}`;
}

function sleep(milliseconds: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}
