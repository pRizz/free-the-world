import { compileContent } from "./lib/content";
import {
  generateMarketCapSnapshot,
  writeMarketCapSnapshotArtifacts,
} from "./lib/market-cap-snapshots";

const { graph } = await compileContent();
const sp500Companies = graph.companies.filter((company) =>
  company.indexIds.some((indexId) => indexId.startsWith("sp500-")),
);
const snapshot = await generateMarketCapSnapshot(sp500Companies, {
  log: console,
});

await writeMarketCapSnapshotArtifacts(snapshot);

console.log(
  `Refreshed market-cap snapshots for ${snapshot.rows.length} S&P 500 companies at ${snapshot.generatedAt}.`,
);
