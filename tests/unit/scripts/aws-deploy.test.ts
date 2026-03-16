import { expect, test } from "bun:test";
import {
  assessStackReadiness,
  buildAwsDomainCompatibilityLayout,
  buildAwsStackParameters,
  classifyChangeSetPlanRisks,
  type ResolvedHostedZones,
  waitForStackReadiness,
} from "../../../scripts/lib/aws-deploy";

function createHostedZones(): ResolvedHostedZones {
  return {
    all: [
      {
        domain: "freetheworld.ai",
        kind: "canonical",
        label: "primary canonical host",
        zoneId: "ZAI",
      },
      {
        domain: "free-the-world.com",
        kind: "live",
        label: "secondary live host 1",
        zoneId: "ZCOM",
      },
      {
        domain: "www.freetheworld.ai",
        kind: "redirect",
        label: "redirect host 1",
        zoneId: "ZAI",
      },
      {
        domain: "free-the-world.us",
        kind: "redirect",
        label: "redirect host 2",
        zoneId: "ZUS",
      },
      {
        domain: "ftwfreetheworld.com",
        kind: "redirect",
        label: "redirect host 3",
        zoneId: "ZFTWCOM",
      },
      {
        domain: "ftwfreetheworld.us",
        kind: "redirect",
        label: "redirect host 4",
        zoneId: "ZFTWUS",
      },
    ],
    canonical: {
      domain: "freetheworld.ai",
      kind: "canonical",
      label: "primary canonical host",
      zoneId: "ZAI",
    },
    live: [
      {
        domain: "free-the-world.com",
        kind: "live",
        label: "secondary live host 1",
        zoneId: "ZCOM",
      },
    ],
    redirects: [
      {
        domain: "www.freetheworld.ai",
        kind: "redirect",
        label: "redirect host 1",
        zoneId: "ZAI",
      },
      {
        domain: "free-the-world.us",
        kind: "redirect",
        label: "redirect host 2",
        zoneId: "ZUS",
      },
      {
        domain: "ftwfreetheworld.com",
        kind: "redirect",
        label: "redirect host 3",
        zoneId: "ZFTWCOM",
      },
      {
        domain: "ftwfreetheworld.us",
        kind: "redirect",
        label: "redirect host 4",
        zoneId: "ZFTWUS",
      },
    ],
  };
}

test("buildAwsDomainCompatibilityLayout keeps legacy domains on their existing CloudFormation slots", () => {
  // Arrange
  const hostedZones = createHostedZones();

  // Act
  const layout = buildAwsDomainCompatibilityLayout(hostedZones);

  // Assert
  expect(layout.PrimaryDomain.domain).toBe("freetheworld.ai");
  expect(layout.CanonicalDomain.domain).toBe("free-the-world.com");
  expect(layout.RedirectDomainOne.domain).toBe("free-the-world.us");
  expect(layout.RedirectDomainTwo.domain).toBe("ftwfreetheworld.com");
  expect(layout.RedirectDomainThree.domain).toBe("ftwfreetheworld.us");
  expect(layout.RedirectDomainFour.domain).toBe("www.freetheworld.ai");
});

test("buildAwsStackParameters maps .ai hosts additively while preserving legacy parameter slots", () => {
  // Arrange
  const hostedZones = createHostedZones();

  // Act
  const parameters = buildAwsStackParameters(hostedZones, "free-the-world-site-123");

  // Assert
  expect(parameters).toEqual([
    "ParameterKey=SiteBucketName,ParameterValue=free-the-world-site-123",
    "ParameterKey=PrimaryDomain,ParameterValue=freetheworld.ai",
    "ParameterKey=PrimaryHostedZoneId,ParameterValue=ZAI",
    "ParameterKey=CanonicalDomain,ParameterValue=free-the-world.com",
    "ParameterKey=CanonicalHostedZoneId,ParameterValue=ZCOM",
    "ParameterKey=RedirectDomainOne,ParameterValue=free-the-world.us",
    "ParameterKey=RedirectHostedZoneIdOne,ParameterValue=ZUS",
    "ParameterKey=RedirectDomainTwo,ParameterValue=ftwfreetheworld.com",
    "ParameterKey=RedirectHostedZoneIdTwo,ParameterValue=ZFTWCOM",
    "ParameterKey=RedirectDomainThree,ParameterValue=ftwfreetheworld.us",
    "ParameterKey=RedirectHostedZoneIdThree,ParameterValue=ZFTWUS",
    "ParameterKey=RedirectDomainFour,ParameterValue=www.freetheworld.ai",
    "ParameterKey=RedirectHostedZoneIdFour,ParameterValue=ZAI",
  ]);
});

test("assessStackReadiness treats UPDATE_ROLLBACK_COMPLETE as mutable and UPDATE_ROLLBACK_FAILED as blocked", () => {
  // Arrange
  const mutableState = {
    exists: true,
    outputs: {},
    stackStatus: "UPDATE_ROLLBACK_COMPLETE",
  };
  const blockedState = {
    exists: true,
    outputs: {},
    stackStatus: "UPDATE_ROLLBACK_FAILED",
  };
  const failureEvents = [
    {
      logicalResourceId: "CanonicalDomainARecord",
      resourceStatus: "UPDATE_FAILED",
      resourceStatusReason: "already exists",
      resourceType: "AWS::Route53::RecordSet",
      timestamp: "2026-03-16T16:24:41.423Z",
    },
  ];

  // Act
  const mutableAssessment = assessStackReadiness(mutableState);
  const blockedAssessment = assessStackReadiness(blockedState, failureEvents);

  // Assert
  expect(mutableAssessment.state).toBe("ready");
  expect(blockedAssessment.state).toBe("blocked");
  expect(blockedAssessment.detail).toContain("Manual CloudFormation recovery is required");
  expect(blockedAssessment.detail).toContain("CanonicalDomainARecord");
});

test("waitForStackReadiness waits through in-progress states until the stack is mutable", () => {
  // Arrange
  const states = [
    {
      exists: true,
      outputs: {},
      stackStatus: "UPDATE_IN_PROGRESS",
    },
    {
      exists: true,
      outputs: {},
      stackStatus: "UPDATE_COMPLETE",
    },
  ];
  let loadCount = 0;

  // Act
  const assessment = waitForStackReadiness({
    loadCurrentState: () => {
      const state = states[Math.min(loadCount++, states.length - 1)];

      if (!state) {
        throw new Error("Expected a stack state in the test sequence.");
      }

      return state;
    },
    maxWaitMs: 5_000,
    pollIntervalMs: 1,
    sleepFn: () => {},
    stackName: "free-the-world-site",
  });

  // Assert
  expect(assessment.state).toBe("ready");
  expect(assessment.stackStatus).toBe("UPDATE_COMPLETE");
  expect(loadCount).toBe(2);
});

test("classifyChangeSetPlanRisks blocks replacement of legacy Route53 records but allows additive .ai records", () => {
  // Arrange
  const riskSummary = classifyChangeSetPlanRisks([
    {
      action: "Modify",
      logicalResourceId: "CanonicalDomainARecord",
      replacement: "True",
      resourceType: "AWS::Route53::RecordSet",
    },
    {
      action: "Add",
      logicalResourceId: "PrimaryDomainARecord",
      replacement: "False",
      resourceType: "AWS::Route53::RecordSet",
    },
    {
      action: "Modify",
      logicalResourceId: "SiteCertificate",
      replacement: "True",
      resourceType: "AWS::CertificateManager::Certificate",
    },
  ]);

  // Assert
  expect(riskSummary.hasBlockingRisk).toBe(true);
  expect(riskSummary.blockedRoute53Replacements).toHaveLength(1);
  expect(riskSummary.blockedRoute53Replacements[0]?.logicalResourceId).toBe(
    "CanonicalDomainARecord",
  );
});
