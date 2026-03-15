import type { RalphProviderPreference, RalphSyncMode } from "../src/lib/domain/content-types";
import { parseArgs, syncCompany } from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

if (args.help === "true") {
  console.log(
    "Usage: bun run sync:company --company=<slug> [--provider=auto|codex|claude|both] [--mode=dry-run|publish] [--no-commit=true]"
  );
  process.exit(0);
}

if (!args.company) {
  console.log(
    "Usage: bun run sync:company --company=<slug> [--provider=auto|codex|claude|both] [--mode=dry-run|publish] [--no-commit=true]"
  );
  process.exit(1);
}

const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const mode = (args.mode ?? "dry-run") as RalphSyncMode;
const noCommit = args["no-commit"] === "true" || args["no-commit"] === "1";

const result = await syncCompany({
  companySlug: args.company,
  providerPreference,
  mode,
  noCommit,
});

console.log(`Sync run written to ${result.runDir}`);
