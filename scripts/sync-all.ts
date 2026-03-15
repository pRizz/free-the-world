import type { RalphProviderPreference, RalphSyncMode } from "../src/lib/domain/content-types";
import { loadRawContent } from "./lib/content";
import { collectSyncTargets, parseArgs, syncCompany } from "./lib/ralph";

const args = parseArgs(process.argv.slice(2));

if (args.help === "true") {
  console.log(
    "Usage: bun run sync:all [--provider=auto|codex|claude|both] [--mode=dry-run|publish] [--stale-only=true] [--no-commit=true]"
  );
  process.exit(0);
}

const providerPreference = (args.provider ?? "auto") as RalphProviderPreference;
const mode = (args.mode ?? "dry-run") as RalphSyncMode;
const staleOnly = args["stale-only"] === "true" || args["stale-only"] === "1";
const noCommit = args["no-commit"] === "true" || args["no-commit"] === "1";

const raw = await loadRawContent();
const targets = collectSyncTargets(raw, staleOnly);
const failures: string[] = [];

for (const companySlug of targets) {
  try {
    await syncCompany({
      companySlug,
      providerPreference,
      mode,
      noCommit,
    });
  } catch (error) {
    failures.push(`${companySlug}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (failures.length > 0) {
  console.error("Sync failures:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Completed sync for ${targets.length} companies.`);
