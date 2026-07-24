import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderIntelligenceBriefEvidenceModule } from "./generate-intelligence-brief-evidence.js";

const outputPath = path.join(process.cwd(), "apps", "web", "src", "intelligence-brief-evidence.js");
const actual = await readFile(outputPath, "utf8");
const expected = await renderIntelligenceBriefEvidenceModule();

if (actual !== expected) {
  throw new Error("Intelligence brief evidence is stale. Run pnpm snapshot:intelligence-brief.");
}

console.log("Intelligence brief evidence freshness passed.");
