import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderSimulatorWorkspaceData } from "./generate-simulator-workspace-data.js";

const outputPath = path.join(process.cwd(), "apps", "web", "src", "simulator-workspace-data.json");
const actual = await readFile(outputPath, "utf8");
const expected = renderSimulatorWorkspaceData();

if (actual !== expected) {
  throw new Error("Simulator workspace data is stale. Run pnpm snapshot:simulator-workspace.");
}

console.log("Simulator workspace data freshness passed.");
