import { expect, test } from "bun:test";
import {
  classifyPagesDeploymentStatus,
  loadCreatePagesDeploymentEnv,
  loadWaitForPagesDeploymentEnv,
  parsePagesDeploymentResponse,
} from "../../../scripts/lib/github-pages";

test("loadCreatePagesDeploymentEnv rejects missing required variables", () => {
  // Arrange
  const env = {
    ARTIFACT_ID: "123",
    GITHUB_OUTPUT: "/tmp/github-output",
    GITHUB_REPOSITORY: "owner/repo",
    GITHUB_SHA: "abc123",
    ACTIONS_ID_TOKEN_REQUEST_TOKEN: "token",
    ACTIONS_ID_TOKEN_REQUEST_URL: "https://example.com/oidc",
  };

  // Act / Assert
  expect(() => loadCreatePagesDeploymentEnv(env)).toThrow(/GITHUB_TOKEN/);
});

test("loadWaitForPagesDeploymentEnv rejects missing required variables", () => {
  // Arrange
  const env = {
    GITHUB_REPOSITORY: "owner/repo",
    GITHUB_TOKEN: "token",
  };

  // Act / Assert
  expect(() => loadWaitForPagesDeploymentEnv(env)).toThrow(/DEPLOYMENT_ID/);
});

test("parsePagesDeploymentResponse prefers the explicit deployment id", () => {
  // Arrange
  const response = {
    id: 42,
    status_url: "https://api.github.com/repos/owner/repo/pages/deployments/99",
    page_url: "https://owner.github.io/repo/",
  };

  // Act
  const parsed = parsePagesDeploymentResponse(response);

  // Assert
  expect(parsed).toEqual({
    deploymentId: "42",
    maybePageUrl: "https://owner.github.io/repo/",
  });
});

test("parsePagesDeploymentResponse falls back to the status url when id is absent", () => {
  // Arrange
  const response = {
    status_url: "https://api.github.com/repos/owner/repo/pages/deployments/99",
    page_url: "https://owner.github.io/repo/",
  };

  // Act
  const parsed = parsePagesDeploymentResponse(response);

  // Assert
  expect(parsed).toEqual({
    deploymentId: "99",
    maybePageUrl: "https://owner.github.io/repo/",
  });
});

test("classifyPagesDeploymentStatus marks succeed as success", () => {
  // Arrange
  const status = "succeed";

  // Act
  const phase = classifyPagesDeploymentStatus(status);

  // Assert
  expect(phase).toBe("success");
});

test("classifyPagesDeploymentStatus marks terminal failures as failure", () => {
  // Arrange
  const status = "deployment_failed";

  // Act
  const phase = classifyPagesDeploymentStatus(status);

  // Assert
  expect(phase).toBe("failure");
});

test("classifyPagesDeploymentStatus keeps non-terminal states pending", () => {
  // Arrange
  const status = "building";

  // Act
  const phase = classifyPagesDeploymentStatus(status);

  // Assert
  expect(phase).toBe("pending");
});
