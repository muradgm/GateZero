import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderBacktestRunEvidenceModule } from "./generate-backtest-run-evidence.js";

const outputPath = path.join(process.cwd(), "apps", "web", "src", "backtest-run-evidence.js");
const actual = await readFile(outputPath, "utf8");
const expected = await renderBacktestRunEvidenceModule();

if (actual !== expected) {
  throw new Error("Backtest run evidence is stale. Run pnpm snapshot:backtest-evidence.");
}

console.log("Backtest run evidence freshness passed.");
