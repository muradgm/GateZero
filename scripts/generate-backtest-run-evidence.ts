import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { format } from "prettier";
import { buildBacktestRunEvidence } from "./build-backtest-run-evidence.js";

export async function renderBacktestRunEvidenceModule(): Promise<string> {
  return format(
    `export const backtestRunEvidence = ${JSON.stringify(buildBacktestRunEvidence())};`,
    {
      parser: "babel",
      printWidth: 100,
      trailingComma: "none"
    }
  );
}

export async function generateBacktestRunEvidenceModule(): Promise<void> {
  const outputPath = path.join(process.cwd(), "apps", "web", "src", "backtest-run-evidence.js");
  await writeFile(outputPath, await renderBacktestRunEvidenceModule(), "utf8");
  console.log(`Backtest evidence written: ${path.relative(process.cwd(), outputPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateBacktestRunEvidenceModule();
}
