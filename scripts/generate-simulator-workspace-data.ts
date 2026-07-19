import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildSimulatorWorkspaceData } from "./build-simulator-workspace-data.js";

export function renderSimulatorWorkspaceData(): string {
  return `${JSON.stringify(buildSimulatorWorkspaceData(), null, 2)}\n`;
}

export async function generateSimulatorWorkspaceData(): Promise<void> {
  const outputPath = path.join(
    process.cwd(),
    "apps",
    "web",
    "src",
    "simulator-workspace-data.json"
  );
  await writeFile(outputPath, renderSimulatorWorkspaceData(), "utf8");
  console.log(`Simulator workspace data written: ${path.relative(process.cwd(), outputPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateSimulatorWorkspaceData();
}
