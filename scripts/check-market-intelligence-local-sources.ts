import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { validateLocalReplaySourceFiles } from "../packages/core/src/index.js";
import { gate2MarketIntelligenceLocalReplaySourceFixtures } from "../packages/fixtures/src/index.js";

const execFileAsync = promisify(execFile);

export async function loadTrackedRepositoryRefs(rootDir: string): Promise<ReadonlySet<string>> {
  const { stdout } = await execFileAsync("git", ["ls-files", "-z"], {
    cwd: rootDir,
    encoding: "utf8"
  });

  return new Set(
    stdout
      .split("\0")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => entry.replaceAll("\\", "/"))
  );
}

export async function checkMarketIntelligenceLocalSources(rootDir: string): Promise<{
  readonly ok: boolean;
  readonly findings: readonly string[];
  readonly checkedSources: number;
}> {
  const trackedRepositoryRefs = await loadTrackedRepositoryRefs(rootDir);
  const result = validateLocalReplaySourceFiles(
    rootDir,
    gate2MarketIntelligenceLocalReplaySourceFixtures,
    trackedRepositoryRefs
  );

  return {
    ...result,
    checkedSources: gate2MarketIntelligenceLocalReplaySourceFixtures.length
  };
}

async function main(): Promise<void> {
  const result = await checkMarketIntelligenceLocalSources(process.cwd());

  if (!result.ok) {
    console.error("Market intelligence local source check failed.");
    for (const finding of result.findings) {
      console.error(`- ${finding}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Market intelligence local source check passed.");
  console.log(`Checked sources: ${result.checkedSources}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
