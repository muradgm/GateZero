import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { runEpoch1HistoricalIngestion } from "../packages/application/src/index.js";
import { FrozenHistoricalDatasetManifestSchema } from "../packages/contracts/src/index.js";

const args = parseArgs(process.argv.slice(2));
const csvPath = required(args, "csv");
const manifestPath = required(args, "manifest");
const eventContextPath = args["event-context"];
const outputPath =
  args.output ?? path.join(".local-data", "epoch1", "historical-ingestion-run.json");

const [csv, manifestText, eventContextText] = await Promise.all([
  readFile(path.resolve(csvPath), "utf8"),
  readFile(path.resolve(manifestPath), "utf8"),
  eventContextPath ? readFile(path.resolve(eventContextPath), "utf8") : Promise.resolve(undefined)
]);
const manifest = FrozenHistoricalDatasetManifestSchema.parse(JSON.parse(manifestText));
const eventContextByDecisionTimestamp = eventContextText
  ? parseEventContext(JSON.parse(eventContextText))
  : undefined;
const result = runEpoch1HistoricalIngestion({
  manifest,
  csv,
  ...(eventContextByDecisionTimestamp ? { eventContextByDecisionTimestamp } : {})
});
const absoluteOutput = path.resolve(outputPath);
await mkdir(path.dirname(absoluteOutput), { recursive: true });
await writeFile(absoluteOutput, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log(`Historical ingestion status: ${result.status}`);
console.log(`Run: ${result.runId}`);
console.log(`Dataset: ${result.manifest.datasetId}`);
console.log(`Raw hash: ${result.hashes.rawDataHash}`);
console.log(`15m / 1H / 4H: ${result.counts.normalized15m} / ${result.counts.aggregated1H} / ${result.counts.aggregated4H}`);
console.log(`Candidates / assessments: ${result.counts.candidates} / ${result.counts.assessments}`);
console.log(`Output: ${absoluteOutput}`);

if (result.status === "REJECTED") {
  for (const failure of result.failures.import) {
    console.error(`- IMPORT ${failure.code}: ${failure.message}`);
  }
  for (const failure of result.failures.adapter) {
    console.error(`- ADAPTER ${failure.code}: ${failure.message}`);
  }
  for (const failure of [
    ...result.failures.validation,
    ...result.failures.aggregation1H,
    ...result.failures.aggregation4H
  ]) {
    console.error(`- ${failure.code}: ${failure.message}`);
  }
  process.exitCode = 1;
}

function parseEventContext(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("event-context JSON must be an object keyed by ISO decision timestamp");
  }

  const entries = Object.entries(value);
  for (const [timestamp, minutes] of entries) {
    if (typeof minutes !== "number") {
      throw new Error(`event-context value for ${timestamp} must be a number`);
    }
  }
  return Object.fromEntries(entries) as Record<string, number>;
}

function parseArgs(values: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (!token?.startsWith("--")) continue;
    const key = token.slice(2);
    const value = values[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for --${key}`);
    parsed[key] = value;
    index += 1;
  }
  return parsed;
}

function required(values: Record<string, string>, key: string): string {
  const value = values[key];
  if (!value) {
    throw new Error(
      `Missing --${key}. Usage: pnpm run:epoch1-ingestion -- --csv <file> --manifest <file>`
    );
  }
  return value;
}
