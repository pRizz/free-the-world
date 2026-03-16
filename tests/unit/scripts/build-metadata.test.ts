import { expect, test } from "bun:test";
import { formatUtcTimestampLabel, readBuildMetadataFromEnv, resolveBuildMetadata } from "../../../scripts/lib/build-metadata";
import type { CommandOptions, CommandResult } from "../../../scripts/lib/command";

type CommandRunner = (command: string, args: string[], options?: CommandOptions) => CommandResult;

test("resolveBuildMetadata prefers GitHub env metadata when available", () => {
  // Arrange
  const runCommandImpl = createCommandRunner({
    "git rev-parse abc123": "0123456789abcdef0123456789abcdef01234567\n",
    "git show -s --format=%cI 0123456789abcdef0123456789abcdef01234567": "2026-03-15T22:33:29-05:00\n",
  });

  // Act
  const metadata = resolveBuildMetadata({
    env: {
      GITHUB_REPOSITORY: "pRizz/free-the-world",
      GITHUB_SHA: "abc123",
    },
    runCommandImpl,
  });

  // Assert
  expect(metadata).toEqual({
    commitSha: "0123456789abcdef0123456789abcdef01234567",
    commitTimestamp: "2026-03-15T22:33:29-05:00",
    commitTimestampLabel: "2026-03-16 03:33 UTC",
    commitUrl: "https://github.com/pRizz/free-the-world/commit/0123456789abcdef0123456789abcdef01234567",
  });
});

test("resolveBuildMetadata falls back to local git commands and normalizes ssh remotes", () => {
  // Arrange
  const runCommandImpl = createCommandRunner({
    "git rev-parse HEAD": "fedcba9876543210fedcba9876543210fedcba98\n",
    "git remote get-url origin": "git@github.com:pRizz/free-the-world.git\n",
    "git show -s --format=%cI fedcba9876543210fedcba9876543210fedcba98": "2026-03-14T12:00:00+02:00\n",
  });

  // Act
  const metadata = resolveBuildMetadata({
    env: {},
    runCommandImpl,
  });

  // Assert
  expect(metadata).toEqual({
    commitSha: "fedcba9876543210fedcba9876543210fedcba98",
    commitTimestamp: "2026-03-14T12:00:00+02:00",
    commitTimestampLabel: "2026-03-14 10:00 UTC",
    commitUrl: "https://github.com/pRizz/free-the-world/commit/fedcba9876543210fedcba9876543210fedcba98",
  });
});

test("resolveBuildMetadata normalizes https remotes into a GitHub commit URL", () => {
  // Arrange
  const runCommandImpl = createCommandRunner({
    "git rev-parse HEAD": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
    "git remote get-url origin": "https://github.com/pRizz/free-the-world.git\n",
    "git show -s --format=%cI aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa": "2026-03-15T00:15:00Z\n",
  });

  // Act
  const metadata = resolveBuildMetadata({
    env: {},
    runCommandImpl,
  });

  // Assert
  expect(metadata?.commitUrl).toBe("https://github.com/pRizz/free-the-world/commit/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
});

test("resolveBuildMetadata returns null when required git metadata cannot be resolved", () => {
  // Arrange
  const runCommandImpl = createCommandRunner({
    "git rev-parse HEAD": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\n",
    "git remote get-url origin": "git@example.com:owner/repo.git\n",
    "git show -s --format=%cI aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa": "2026-03-15T00:15:00Z\n",
  });

  // Act
  const metadata = resolveBuildMetadata({
    env: {},
    runCommandImpl,
  });

  // Assert
  expect(metadata).toBeNull();
});

test("readBuildMetadataFromEnv omits partial metadata", () => {
  // Arrange
  const env = {
    VITE_SITE_GIT_COMMIT_SHA: "abc123",
    VITE_SITE_GIT_COMMIT_TIMESTAMP: "2026-03-15T00:15:00Z",
    VITE_SITE_GIT_COMMIT_URL: "https://github.com/pRizz/free-the-world/commit/abc123",
  };

  // Act
  const metadata = readBuildMetadataFromEnv(env);

  // Assert
  expect(metadata).toBeNull();
});

test("formatUtcTimestampLabel renders a stable UTC label", () => {
  // Arrange
  const timestamp = "2026-03-15T22:33:29-05:00";

  // Act
  const label = formatUtcTimestampLabel(timestamp);

  // Assert
  expect(label).toBe("2026-03-16 03:33 UTC");
});

function createCommandRunner(stdoutByInvocation: Record<string, string>): CommandRunner {
  return (command, args) => {
    const invocation = `${command} ${args.join(" ")}`;
    const maybeStdout = stdoutByInvocation[invocation];

    if (maybeStdout === undefined) {
      throw new Error(`Unexpected command: ${invocation}`);
    }

    return {
      command,
      args,
      status: 0,
      stdout: maybeStdout,
      stderr: "",
    };
  };
}
