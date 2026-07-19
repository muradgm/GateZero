import { readFileSync } from "node:fs";
import path from "node:path";
import { buildLocalCaseCatalog, parseLocalResearchCaseDraft } from "../packages/core/src/index.js";

const fixturePath = path.join(
  process.cwd(),
  "packages",
  "fixtures",
  "data",
  "gate2-local-research-case-003.json"
);

export function buildCheckedInLocalCaseCatalog() {
  const draft = parseLocalResearchCaseDraft(readFileSync(fixturePath, "utf8"));
  return buildLocalCaseCatalog([draft]);
}
