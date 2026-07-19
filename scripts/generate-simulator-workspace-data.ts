import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { format } from "prettier";
import { buildSimulatorWorkspaceData } from "./build-simulator-workspace-data.js";

export async function renderSimulatorWorkspaceData(): Promise<string> {
  return format(JSON.stringify(buildSimulatorWorkspaceData()), {
    parser: "json",
    printWidth: 100,
    trailingComma: "none"
  });
}

export async function generateSimulatorWorkspaceData(): Promise<void> {
  const outputPath = path.join(
    process.cwd(),
    "apps",
    "web",
    "src",
    "simulator-workspace-data.json"
  );
  await writeFile(outputPath, await renderSimulatorWorkspaceData(), "utf8");
  console.log(`Simulator workspace data written: ${path.relative(process.cwd(), outputPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateSimulatorWorkspaceData();
}
