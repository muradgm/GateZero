import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { rankSimilarSetups } from "../packages/application/src/rank-similar-setups.js";
import { workspaceHistoricalCases } from "./intelligence-workspace-historical-cases.js";

const target = path.join(
  process.cwd(),
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "workspace-data.json"
);

const snapshot = JSON.parse(await readFile(target, "utf8")) as {
  candidates: Array<{
    market: string;
    context: { trend: string; structure: string; momentum: string; volatility: string };
    report: { instrument: string; contributions: Array<{ dimension: string }> };
    similarSetups?: unknown;
  }>;
};

for (const candidate of snapshot.candidates) {
  candidate.similarSetups = rankSimilarSetups(
    {
      instrument: candidate.report.instrument,
      market: candidate.market,
      trend: candidate.context.trend,
      structure: candidate.context.structure,
      momentum: candidate.context.momentum,
      volatility: candidate.context.volatility,
      evidenceDimensions: candidate.report.contributions.map((contribution) => contribution.dimension)
    },
    workspaceHistoricalCases,
    3
  );
}

await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Attached historical similarity matches to ${snapshot.candidates.length} workspace candidates.`);
