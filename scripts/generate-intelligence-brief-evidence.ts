import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { format } from "prettier";
import { buildIntelligenceBriefEvidence } from "./build-intelligence-brief-evidence.js";

export async function renderIntelligenceBriefEvidenceModule(): Promise<string> {
  return format(
    `export const intelligenceBriefEvidence = ${JSON.stringify(buildIntelligenceBriefEvidence())};`,
    {
      parser: "babel",
      printWidth: 100,
      trailingComma: "none"
    }
  );
}

export async function generateIntelligenceBriefEvidenceModule(): Promise<void> {
  const outputPath = path.join(
    process.cwd(),
    "apps",
    "web",
    "src",
    "intelligence-brief-evidence.js"
  );
  await writeFile(outputPath, await renderIntelligenceBriefEvidenceModule(), "utf8");
  console.log(`Intelligence brief evidence written: ${path.relative(process.cwd(), outputPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateIntelligenceBriefEvidenceModule();
}
