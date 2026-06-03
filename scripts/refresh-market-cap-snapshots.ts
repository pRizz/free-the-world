import { compileContent } from "./lib/content";
import {
  assertMarketCapSnapshotCoverage,
  generateMarketCapSnapshot,
  hasSubstantiveMarketCapSnapshotChange,
  parseMarketCapSnapshotTarget,
  readMarketCapSnapshotArtifact,
  selectMarketCapSnapshotCompanies,
  writeMarketCapSnapshotArtifacts,
} from "./lib/market-cap-snapshots";
import { parseArgs } from "./lib/ralph";

const usage = "Usage: bun run market-cap:refresh [--target=all|sp500]";
const args = parseArgs(process.argv.slice(2));

if (args.help === "true") {
  console.log(usage);
  process.exit(0);
}

const { graph } = await compileContent();
const target = parseMarketCapSnapshotTarget(args.target);
const targetCompanies = selectMarketCapSnapshotCompanies(graph.companies, target);
const snapshot = await generateMarketCapSnapshot(targetCompanies, {
  log: console,
});
const coverage = assertMarketCapSnapshotCoverage(snapshot, {
  targetCompanyCount: targetCompanies.length,
});
const previousSnapshot = await readMarketCapSnapshotArtifact();

if (!hasSubstantiveMarketCapSnapshotChange(previousSnapshot, snapshot)) {
  console.log(
    `No substantive market-cap changes for ${target} target; generated artifacts left unchanged.`,
  );
  process.exit(0);
}

await writeMarketCapSnapshotArtifacts(snapshot);

console.log(
  [
    `Refreshed market-cap snapshots for ${snapshot.rows.length}/${targetCompanies.length} ${target} companies at ${snapshot.generatedAt}.`,
    `${coverage.liveCount} live, ${coverage.fallbackCount} fallback, ${coverage.missingRowCount} missing.`,
  ].join(" "),
);
