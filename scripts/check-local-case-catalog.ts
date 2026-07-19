import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderLocalCaseCatalog } from "./generate-local-case-catalog.js";

const outputPath = path.join(process.cwd(), "apps", "web", "src", "research-case-catalog.json");
if ((await readFile(outputPath, "utf8")) !== (await renderLocalCaseCatalog())) {
  throw new Error("Local case catalog is stale. Run pnpm snapshot:case-catalog.");
}
console.log("Local case catalog freshness passed.");
