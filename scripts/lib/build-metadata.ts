import { runCommand } from "./command";
import { resolveGitHubRepositorySlug } from "./github-repository";

type CommandRunner = typeof runCommand;

export interface BuildMetadata {
  commitSha: string;
  commitTimestamp: string;
  commitTimestampLabel: string;
  commitUrl: string;
}

interface ResolveBuildMetadataOptions {
  env?: Record<string, string | undefined>;
  runCommandImpl?: CommandRunner;
}

export function buildMetadataToEnv(metadata: BuildMetadata) {
  return {
    VITE_SITE_GIT_COMMIT_SHA: metadata.commitSha,
    VITE_SITE_GIT_COMMIT_TIMESTAMP: metadata.commitTimestamp,
    VITE_SITE_GIT_COMMIT_TIMESTAMP_LABEL: metadata.commitTimestampLabel,
    VITE_SITE_GIT_COMMIT_URL: metadata.commitUrl,
  } satisfies Record<string, string>;
}

export function readBuildMetadataFromEnv(env: Record<string, string | undefined>) {
  const commitSha = normalizeValue(env.VITE_SITE_GIT_COMMIT_SHA);
  const commitTimestamp = normalizeValue(env.VITE_SITE_GIT_COMMIT_TIMESTAMP);
  const commitTimestampLabel = normalizeValue(env.VITE_SITE_GIT_COMMIT_TIMESTAMP_LABEL);
  const commitUrl = normalizeValue(env.VITE_SITE_GIT_COMMIT_URL);

  if (!commitSha || !commitTimestamp || !commitTimestampLabel || !commitUrl) {
    return null;
  }

  return {
    commitSha,
    commitTimestamp,
    commitTimestampLabel,
    commitUrl,
  } satisfies BuildMetadata;
}

export function resolveBuildMetadata(options: ResolveBuildMetadataOptions = {}) {
  const env = options.env ?? process.env;
  const runCommandImpl = options.runCommandImpl ?? runCommand;

  try {
    const requestedSha = normalizeValue(env.GITHUB_SHA) ?? "HEAD";
    const commitSha = normalizeValue(runCommandImpl("git", ["rev-parse", requestedSha]).stdout);
    if (!commitSha) {
      return null;
    }

    const repositorySlug = resolveGitHubRepositorySlug(undefined, {
      env,
      runCommandImpl,
    });
    const commitTimestamp = normalizeValue(
      runCommandImpl("git", ["show", "-s", "--format=%cI", commitSha]).stdout,
    );
    if (!commitTimestamp) {
      return null;
    }

    return {
      commitSha,
      commitTimestamp,
      commitTimestampLabel: formatUtcTimestampLabel(commitTimestamp),
      commitUrl: `https://github.com/${repositorySlug}/commit/${commitSha}`,
    } satisfies BuildMetadata;
  } catch {
    return null;
  }
}

export function formatUtcTimestampLabel(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.valueOf())) {
    throw new Error(`Invalid commit timestamp: ${timestamp}`);
  }

  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

function normalizeValue(value: string | undefined) {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
}
