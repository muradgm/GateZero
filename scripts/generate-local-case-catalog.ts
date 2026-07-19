import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { format } from "prettier";
import { buildCheckedInLocalCaseCatalog } from "./build-local-case-catalog.js";

export async function renderLocalCaseCatalog(): Promise<string> {
  return format(JSON.stringify(buildCheckedInLocalCaseCatalog()), {
    parser: "json",
    printWidth: 100,
    trailingComma: "none"
  });
}

export async function generateLocalCaseCatalog(): Promise<void> {
  const outputPath = path.join(process.cwd(), "apps", "web", "src", "research-case-catalog.json");
  await writeFile(outputPath, await renderLocalCaseCatalog(), "utf8");
  console.log(`Local case catalog written: ${path.relative(process.cwd(), outputPath)}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await generateLocalCaseCatalog();
}
