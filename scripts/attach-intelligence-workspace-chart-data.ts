import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { workspaceCharts } from "./intelligence-workspace-price-series.js";

const target = path.join(
  process.cwd(),
  "apps",
  "intelligence-workspace",
  "public",
  "runtime",
  "workspace-data.json"
);

const snapshot = JSON.parse(await readFile(target, "utf8")) as {
  candidates: Array<{ id: string; chart?: unknown }>;
};

for (const candidate of snapshot.candidates) {
  const chart = workspaceCharts[candidate.id];
  if (!chart) {
    throw new Error(`Missing local chart fixture for workspace candidate: ${candidate.id}`);
  }
  candidate.chart = chart;
}

await writeFile(target, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Attached local OHLC series to ${snapshot.candidates.length} workspace candidates.`);
