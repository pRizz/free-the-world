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

interface StackEventRecord {
  LogicalResourceId?: string;
  ResourceStatus?: string;
  ResourceStatusReason?: string;
  ResourceType?: string;
  Timestamp?: string;
}

interface DescribeStackEventsResponse {
  StackEvents?: StackEventRecord[];
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
export type StackReadinessState = "blocked" | "ready" | "waiting";

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

export interface StackFailureEvent {
  logicalResourceId: string;
  resourceStatus: string;
  resourceStatusReason?: string;
  resourceType: string;
  timestamp: string;
}

export interface StackReadinessAssessment {
  detail: string;
  exists: boolean;
  recentFailureEvents: StackFailureEvent[];
  stackName: string;
  stackState: AwsStackState;
  stackStatus?: string;
  state: StackReadinessState;
  waitedMs: number;
}

export interface StackOperationCompletion {
  finalStackState: AwsStackState;
  recentFailureEvents: StackFailureEvent[];
  waitedMs: number;
}

export interface ChangeSetPlanChange {
  action: string;
  logicalResourceId: string;
  replacement: string;
  resourceType: string;
}

export interface ChangeSetRisk {
  action: string;
  logicalResourceId: string;
  reason: string;
  replacement: string;
  resourceType: string;
}

export interface ChangeSetRiskSummary {
  blockedRoute53Replacements: ChangeSetRisk[];
  hasBlockingRisk: boolean;
}

export interface ChangeSetPlan {
  changeSetName: string;
  changeSetType: "CREATE" | "UPDATE";
  changes: ChangeSetPlanChange[];
  isEmpty: boolean;
  rawStatus: string;
  rawStatusReason: string;
  riskSummary: ChangeSetRiskSummary;
}

export interface AwsDomainCompatibilityLayout {
  CanonicalDomain: ResolvedHostedZoneEntry;
  PrimaryDomain: ResolvedHostedZoneEntry;
  RedirectDomainFour: ResolvedHostedZoneEntry;
  RedirectDomainOne: ResolvedHostedZoneEntry;
  RedirectDomainThree: ResolvedHostedZoneEntry;
  RedirectDomainTwo: ResolvedHostedZoneEntry;
}

export class DomainReadinessError extends Error {
  constructor(readonly assessment: DomainReadinessAssessment) {
    super(formatDomainReadinessMessage(assessment));
    this.name = "DomainReadinessError";
  }
}

export class StackReadinessError extends Error {
  constructor(readonly assessment: StackReadinessAssessment) {
    super(formatStackReadinessMessage(assessment));
    this.name = "StackReadinessError";
  }
}

export class StackOperationError extends Error {
  constructor(
    readonly finalStackState: AwsStackState,
    readonly recentFailureEvents: StackFailureEvent[],
    message: string,
  ) {
    super(message);
    this.name = "StackOperationError";
  }
}

interface HostedZoneSpec {
  domain: string;
  kind: AwsHostedDomainKind;
  label: string;
}

interface WaitForStackReadinessOptions {
  initialState?: AwsStackState;
  loadCurrentState?: () => AwsStackState;
  loadFailureEvents?: () => StackFailureEvent[];
  maxWaitMs?: number;
  pollIntervalMs?: number;
  sleepFn?: (milliseconds: number) => void;
  stackName?: string;
}

interface WaitForStackOperationOptions {
  loadCurrentState?: () => AwsStackState;
  loadFailureEvents?: () => StackFailureEvent[];
  maxWaitMs?: number;
  pollIntervalMs?: number;
  sleepFn?: (milliseconds: number) => void;
  stackName?: string;
}

const mutableStackStatuses = new Set([
  "CREATE_COMPLETE",
  "IMPORT_COMPLETE",
  "UPDATE_COMPLETE",
  "UPDATE_ROLLBACK_COMPLETE",
]);

const blockedStackStatuses = new Set([
  "CREATE_FAILED",
  "DELETE_FAILED",
  "DELETE_IN_PROGRESS",
  "IMPORT_ROLLBACK_COMPLETE",
  "IMPORT_ROLLBACK_FAILED",
  "ROLLBACK_COMPLETE",
  "ROLLBACK_FAILED",
  "UPDATE_ROLLBACK_FAILED",
]);

const protectedLegacyRoute53LogicalIds = new Set([
  "CanonicalDomainARecord",
  "CanonicalDomainAAAARecord",
  "RedirectDomainOneARecord",
  "RedirectDomainOneAAAARecord",
  "RedirectDomainTwoARecord",
  "RedirectDomainTwoAAAARecord",
  "RedirectDomainThreeARecord",
  "RedirectDomainThreeAAAARecord",
]);

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

export function loadStackState(stackName: string = deploymentConfig.awsStackName): AwsStackState {
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
    if (isMissingStackResponse(result.stdout, result.stderr)) {
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

export function loadRecentStackFailureEvents(
  stackName: string = deploymentConfig.awsStackName,
  maxItems = 10,
) {
  const result = runCommand(
    "aws",
    [
      "cloudformation",
      "describe-stack-events",
      "--region",
      deploymentConfig.awsRegion,
      "--stack-name",
      stackName,
      "--max-items",
      String(maxItems),
      "--output",
      "json",
    ],
    { allowFailure: true },
  );

  if (result.status !== 0) {
    if (isMissingStackResponse(result.stdout, result.stderr)) {
      return [];
    }

    throw new Error(
      result.stderr || result.stdout || `Failed to load stack events for ${stackName}.`,
    );
  }

  const response = JSON.parse(result.stdout) as DescribeStackEventsResponse;

  return (response.StackEvents ?? [])
    .filter((event) => (event.ResourceStatus ?? "").includes("FAILED"))
    .map((event) => ({
      logicalResourceId: event.LogicalResourceId ?? "Unknown",
      resourceStatus: event.ResourceStatus ?? "UNKNOWN",
      resourceStatusReason: event.ResourceStatusReason,
      resourceType: event.ResourceType ?? "Unknown",
      timestamp: event.Timestamp ?? new Date(0).toISOString(),
    }))
    .slice(0, maxItems);
}

export function assessStackReadiness(
  stackState: AwsStackState,
  recentFailureEvents: StackFailureEvent[] = [],
  stackName: string = deploymentConfig.awsStackName,
) {
  let state: StackReadinessState;
  let detail: string;

  if (!stackState.exists) {
    state = "ready";
    detail = `Stack ${stackName} does not exist yet. CloudFormation can create it.`;
  } else if (mutableStackStatuses.has(stackState.stackStatus ?? "")) {
    state = "ready";
    detail = `Stack ${stackName} is currently ${stackState.stackStatus} and can accept a new change set.`;
  } else if (isWaitingStackStatus(stackState.stackStatus)) {
    state = "waiting";
    detail = `Stack ${stackName} is currently ${stackState.stackStatus}. Waiting for the existing CloudFormation rollout to finish before continuing.`;
  } else {
    state = "blocked";
    detail = buildBlockedStackMessage(stackName, stackState.stackStatus, recentFailureEvents);
  }

  return {
    detail,
    exists: stackState.exists,
    recentFailureEvents,
    stackName,
    stackState,
    stackStatus: stackState.stackStatus,
    state,
    waitedMs: 0,
  } satisfies StackReadinessAssessment;
}

export function formatStackReadinessMessage(assessment: StackReadinessAssessment) {
  return assessment.detail;
}

export function waitForStackReadiness(options: WaitForStackReadinessOptions = {}) {
  const stackName = options.stackName ?? deploymentConfig.awsStackName;
  const loadCurrentState = options.loadCurrentState ?? (() => loadStackState(stackName));
  const loadFailureEvents =
    options.loadFailureEvents ?? (() => loadRecentStackFailureEvents(stackName));
  const maxWaitMs = options.maxWaitMs ?? 30 * 60 * 1000;
  const pollIntervalMs = options.pollIntervalMs ?? 10_000;
  const sleepFn = options.sleepFn ?? sleep;
  const startedAt = Date.now();
  let stackState = options.initialState ?? loadCurrentState();

  while (true) {
    const assessment = assessStackReadiness(stackState, [], stackName);
    const waitedMs = Date.now() - startedAt;

    if (assessment.state === "ready") {
      return {
        ...assessment,
        waitedMs,
      } satisfies StackReadinessAssessment;
    }

    if (assessment.state === "blocked") {
      const failures = stackState.exists ? loadFailureEvents() : [];
      throw new StackReadinessError({
        ...assessStackReadiness(stackState, failures, stackName),
        waitedMs,
      });
    }

    if (waitedMs >= maxWaitMs) {
      const failures = stackState.exists ? loadFailureEvents() : [];
      throw new StackReadinessError({
        ...assessStackReadiness(stackState, failures, stackName),
        detail: [
          `Timed out after ${formatDuration(maxWaitMs)} waiting for stack ${stackName} to leave ${stackState.stackStatus ?? "UNKNOWN"} and become mutable.`,
          ...(failures.length > 0
            ? ["Recent failed stack events:", ...formatFailureEventLines(failures)]
            : []),
        ].join("\n"),
        waitedMs,
      });
    }

    sleepFn(pollIntervalMs);
    stackState = loadCurrentState();
  }
}

export function buildAwsDomainCompatibilityLayout(
  hostedZones: ResolvedHostedZones,
): AwsDomainCompatibilityLayout {
  const expectedDomains = getCompatibilityDomainMapping();

  return {
    CanonicalDomain: requireHostedZoneEntry(hostedZones.all, expectedDomains.CanonicalDomain),
    PrimaryDomain: requireHostedZoneEntry(hostedZones.all, expectedDomains.PrimaryDomain),
    RedirectDomainFour: requireHostedZoneEntry(hostedZones.all, expectedDomains.RedirectDomainFour),
    RedirectDomainOne: requireHostedZoneEntry(hostedZones.all, expectedDomains.RedirectDomainOne),
    RedirectDomainThree: requireHostedZoneEntry(
      hostedZones.all,
      expectedDomains.RedirectDomainThree,
    ),
    RedirectDomainTwo: requireHostedZoneEntry(hostedZones.all, expectedDomains.RedirectDomainTwo),
  };
}

export function buildAwsStackParameters(hostedZones: ResolvedHostedZones, bucketName: string) {
  const layout = buildAwsDomainCompatibilityLayout(hostedZones);

  return [
    formatCloudFormationParameter("SiteBucketName", bucketName),
    formatCloudFormationParameter("PrimaryDomain", layout.PrimaryDomain.domain),
    formatCloudFormationParameter("PrimaryHostedZoneId", layout.PrimaryDomain.zoneId),
    formatCloudFormationParameter("CanonicalDomain", layout.CanonicalDomain.domain),
    formatCloudFormationParameter("CanonicalHostedZoneId", layout.CanonicalDomain.zoneId),
    formatCloudFormationParameter("RedirectDomainOne", layout.RedirectDomainOne.domain),
    formatCloudFormationParameter("RedirectHostedZoneIdOne", layout.RedirectDomainOne.zoneId),
    formatCloudFormationParameter("RedirectDomainTwo", layout.RedirectDomainTwo.domain),
    formatCloudFormationParameter("RedirectHostedZoneIdTwo", layout.RedirectDomainTwo.zoneId),
    formatCloudFormationParameter("RedirectDomainThree", layout.RedirectDomainThree.domain),
    formatCloudFormationParameter("RedirectHostedZoneIdThree", layout.RedirectDomainThree.zoneId),
    formatCloudFormationParameter("RedirectDomainFour", layout.RedirectDomainFour.domain),
    formatCloudFormationParameter("RedirectHostedZoneIdFour", layout.RedirectDomainFour.zoneId),
  ];
}

export function createStackChangeSet(
  hostedZones: ResolvedHostedZones,
  bucketName: string,
  stackExists: boolean,
) {
  const changeSetType: "CREATE" | "UPDATE" = stackExists ? "UPDATE" : "CREATE";
  const changeSetName = `${deploymentConfig.awsStackName}-${Date.now()}`;
  const parameters = buildAwsStackParameters(hostedZones, bucketName);

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
    ...parameters,
    "--output",
    "json",
  ]);

  return {
    changeSetName,
    changeSetType,
  };
}

export function classifyChangeSetPlanRisks(changes: ChangeSetPlanChange[]) {
  const blockedRoute53Replacements = changes.flatMap((change) => {
    if (change.resourceType !== "AWS::Route53::RecordSet") {
      return [];
    }

    if (!protectedLegacyRoute53LogicalIds.has(change.logicalResourceId)) {
      return [];
    }

    const shouldBlock =
      change.action === "Remove" ||
      (change.action !== "Add" && !["False", "Never"].includes(change.replacement));

    if (!shouldBlock) {
      return [];
    }

    return [
      {
        ...change,
        reason:
          "Legacy Route 53 records must stay attached to their existing logical IDs so CloudFormation can update them in place instead of colliding with already-existing DNS records.",
      } satisfies ChangeSetRisk,
    ];
  });

  return {
    blockedRoute53Replacements,
    hasBlockingRisk: blockedRoute53Replacements.length > 0,
  } satisfies ChangeSetRiskSummary;
}

export function formatChangeSetRiskMessage(riskSummary: ChangeSetRiskSummary) {
  if (!riskSummary.hasBlockingRisk) {
    return "The CloudFormation change set does not contain blocked legacy Route 53 record replacements.";
  }

  return [
    "Blocked CloudFormation change set because it would replace or remove legacy Route 53 records that must be updated in place:",
    ...riskSummary.blockedRoute53Replacements.map(
      (risk) =>
        `- ${risk.logicalResourceId} (${risk.resourceType}, action=${risk.action}, replacement=${risk.replacement}): ${risk.reason}`,
    ),
  ].join("\n");
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
    const changes =
      response.Changes?.map((change) => ({
        action: change.ResourceChange?.Action ?? "Unknown",
        logicalResourceId: change.ResourceChange?.LogicalResourceId ?? "Unknown",
        replacement: change.ResourceChange?.Replacement ?? "Unknown",
        resourceType: change.ResourceChange?.ResourceType ?? "Unknown",
      })) ?? [];

    if (status === "CREATE_COMPLETE") {
      return {
        changeSetName,
        changeSetType,
        changes,
        isEmpty: false,
        rawStatus: status,
        rawStatusReason: statusReason,
        riskSummary: classifyChangeSetPlanRisks(changes),
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
        riskSummary: classifyChangeSetPlanRisks([]),
      } satisfies ChangeSetPlan;
    }

    sleep(5_000);
  }

  throw new Error(`Timed out waiting for change set ${changeSetName}.`);
}

export function executeChangeSet(
  changeSetName: string,
  changeSetType: "CREATE" | "UPDATE",
  options: WaitForStackOperationOptions = {},
) {
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

  return waitForStackOperation(changeSetType, options);
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

function waitForStackOperation(
  changeSetType: "CREATE" | "UPDATE",
  options: WaitForStackOperationOptions,
) {
  const stackName = options.stackName ?? deploymentConfig.awsStackName;
  const loadCurrentState = options.loadCurrentState ?? (() => loadStackState(stackName));
  const loadFailureEvents =
    options.loadFailureEvents ?? (() => loadRecentStackFailureEvents(stackName));
  const maxWaitMs = options.maxWaitMs ?? 30 * 60 * 1000;
  const pollIntervalMs = options.pollIntervalMs ?? 10_000;
  const sleepFn = options.sleepFn ?? sleep;
  const startedAt = Date.now();
  const successStatuses = new Set(
    changeSetType === "CREATE" ? ["CREATE_COMPLETE"] : ["UPDATE_COMPLETE"],
  );

  while (true) {
    const stackState = loadCurrentState();
    const waitedMs = Date.now() - startedAt;
    const stackStatus = stackState.stackStatus ?? "UNKNOWN";

    if (successStatuses.has(stackStatus)) {
      return {
        finalStackState: stackState,
        recentFailureEvents: [],
        waitedMs,
      } satisfies StackOperationCompletion;
    }

    if (isWaitingStackStatus(stackStatus) || stackStatus === "REVIEW_IN_PROGRESS") {
      if (waitedMs >= maxWaitMs) {
        const recentFailureEvents = stackState.exists ? loadFailureEvents() : [];
        throw new StackOperationError(
          stackState,
          recentFailureEvents,
          [
            `Timed out after ${formatDuration(maxWaitMs)} waiting for stack ${stackName} to finish the ${changeSetType.toLowerCase()} change set.`,
            `Current stack status: ${stackStatus}.`,
            ...(recentFailureEvents.length > 0
              ? ["Recent failed stack events:", ...formatFailureEventLines(recentFailureEvents)]
              : []),
          ].join("\n"),
        );
      }

      sleepFn(pollIntervalMs);
      continue;
    }

    const recentFailureEvents = stackState.exists ? loadFailureEvents() : [];

    throw new StackOperationError(
      stackState,
      recentFailureEvents,
      [
        `Stack ${stackName} ended in ${stackStatus} while waiting for the ${changeSetType.toLowerCase()} change set to finish.`,
        ...(recentFailureEvents.length > 0
          ? ["Recent failed stack events:", ...formatFailureEventLines(recentFailureEvents)]
          : []),
      ].join("\n"),
    );
  }
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

function getCompatibilityDomainMapping() {
  const [secondaryLiveDomain] = deploymentConfig.secondaryLiveDomains;

  if (!secondaryLiveDomain) {
    throw new Error("Expected one secondary live domain in the deployment config.");
  }

  return {
    CanonicalDomain: secondaryLiveDomain,
    PrimaryDomain: deploymentConfig.primaryCanonicalDomain,
    RedirectDomainFour: requireConfiguredRedirectDomain("www.freetheworld.ai"),
    RedirectDomainOne: requireConfiguredRedirectDomain("free-the-world.us"),
    RedirectDomainThree: requireConfiguredRedirectDomain("ftwfreetheworld.us"),
    RedirectDomainTwo: requireConfiguredRedirectDomain("ftwfreetheworld.com"),
  } as const;
}

function requireConfiguredRedirectDomain(domain: string) {
  if (!(deploymentConfig.redirectDomains as readonly string[]).includes(domain)) {
    throw new Error(`Expected redirect domain ${domain} in the deployment config.`);
  }

  return domain;
}

function requireHostedZoneEntry(allEntries: ResolvedHostedZoneEntry[], domain: string) {
  const entry = allEntries.find((candidate) => candidate.domain === domain);

  if (!entry) {
    throw new Error(`Expected hosted-zone resolution for ${domain}.`);
  }

  return entry;
}

function isMissingStackResponse(stdout: string, stderr: string) {
  const stackMissingPattern = /does not exist/i;
  return stackMissingPattern.test(stderr) || stackMissingPattern.test(stdout);
}

function isWaitingStackStatus(stackStatus?: string) {
  if (!stackStatus) {
    return false;
  }

  if (blockedStackStatuses.has(stackStatus)) {
    return false;
  }

  return (
    stackStatus === "REVIEW_IN_PROGRESS" ||
    stackStatus.endsWith("_IN_PROGRESS") ||
    stackStatus.endsWith("_CLEANUP_IN_PROGRESS")
  );
}

function buildBlockedStackMessage(
  stackName: string,
  stackStatus: string | undefined,
  recentFailureEvents: StackFailureEvent[],
) {
  return [
    `Stack ${stackName} is currently ${stackStatus ?? "UNKNOWN"}. Manual CloudFormation recovery is required before another deploy can continue.`,
    ...(recentFailureEvents.length > 0
      ? ["Recent failed stack events:", ...formatFailureEventLines(recentFailureEvents)]
      : []),
  ].join("\n");
}

function formatFailureEventLines(events: StackFailureEvent[]) {
  return events.map((event) => {
    const reasonSuffix = event.resourceStatusReason ? `: ${event.resourceStatusReason}` : "";
    return `- ${event.timestamp} ${event.logicalResourceId} (${event.resourceType}) ${event.resourceStatus}${reasonSuffix}`;
  });
}

function buildHostedZoneCandidates(domain: string) {
  const labels = domain.split(".");
  const candidates: string[] = [];

  for (let index = 0; index < labels.length - 1; index += 1) {
    candidates.push(labels.slice(index).join("."));
  }

  return candidates;
}

function formatCloudFormationParameter(key: string, value: string) {
  return `ParameterKey=${key},ParameterValue=${value}`;
}

function formatDuration(milliseconds: number) {
  const roundedMilliseconds = Math.max(0, Math.round(milliseconds));
  if (roundedMilliseconds < 60_000) {
    return `${Math.round(roundedMilliseconds / 1_000)}s`;
  }

  const wholeMinutes = Math.floor(roundedMilliseconds / 60_000);
  const wholeSeconds = Math.round((roundedMilliseconds % 60_000) / 1_000);
  return wholeSeconds === 0 ? `${wholeMinutes}m` : `${wholeMinutes}m ${wholeSeconds}s`;
}

function sleep(milliseconds: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}
