import { scanRepositoryForForbiddenPatterns } from "../packages/validation/src/forbidden-patterns.js";

const findings = await scanRepositoryForForbiddenPatterns({
  rootDir: process.cwd()
});

if (findings.length > 0) {
  console.error("Gate 0 validation failed. Blocked scope terms were found:");

  for (const finding of findings) {
    console.error(`- ${finding.filePath}: ${finding.label} (${finding.match})`);
  }

  process.exitCode = 1;
} else {
  console.log("Gate 0 validation passed.");
}
