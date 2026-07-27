import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { FrozenHistoricalDatasetManifestSchema } from "../packages/contracts/src/index.js";
import { importFrozenHistoricalDataset } from "../packages/application/src/index.js";

const args = parseArgs(process.argv.slice(2));
const csvPath = required(args, "csv");
const manifestPath = required(args, "manifest");
const outputPath = args.output ?? path.join(".local-data", "epoch1", "historical-import.json");

const [csv, manifestText] = await Promise.all([
  readFile(path.resolve(csvPath), "utf8"),
  readFile(path.resolve(manifestPath), "utf8")
]);
const manifest = FrozenHistoricalDatasetManifestSchema.parse(JSON.parse(manifestText));
const result = importFrozenHistoricalDataset({ manifest, csv });

if (!result.verification.ready) {
  console.error("Historical dataset import rejected.");
  for (const failure of result.verification.failures) {
    console.error(`- ${failure.code}: ${failure.message}`);
  }
  for (const failure of result.adapter.failures) {
    console.error(`- ADAPTER ${failure.code}: ${failure.message}`);
  }
  process.exitCode = 1;
} else {
  const absoluteOutput = path.resolve(outputPath);
  await mkdir(path.dirname(absoluteOutput), { recursive: true });
  await writeFile(absoluteOutput, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log("Historical dataset import accepted.");
  console.log(`Dataset: ${result.manifest.datasetId}`);
  console.log(`Hash: ${result.verification.sourceHash}`);
  console.log(`Rows: ${result.verification.acceptedRowCount}`);
  console.log(`Output: ${absoluteOutput}`);
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
      `Missing --${key}. Usage: pnpm import:epoch1-dataset -- --csv <file> --manifest <file>`
    );
  }
  return value;
}
