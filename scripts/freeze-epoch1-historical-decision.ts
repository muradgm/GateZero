import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { freezeHistoricalDecisionBundle } from "../packages/application/src/index.js";
import {
  CanonicalRiskReviewSchema,
  EurUsdRiskCalculationSchema,
  HistoricalDecisionFreezeConfigurationSchema,
  HistoricalIngestionRunSchema
} from "../packages/contracts/src/index.js";

const args = parseArgs(process.argv.slice(2));
const ingestionPath = required(args, "ingestion");
const riskPath = required(args, "risk");
const reviewPath = required(args, "review");
const configurationPath = required(args, "configuration");
const outputPath =
  args.output ?? path.join(".local-data", "epoch1", "frozen-historical-decision.json");

const [ingestionText, riskText, reviewText, configurationText] = await Promise.all([
  readFile(path.resolve(ingestionPath), "utf8"),
  readFile(path.resolve(riskPath), "utf8"),
  readFile(path.resolve(reviewPath), "utf8"),
  readFile(path.resolve(configurationPath), "utf8")
]);
const run = HistoricalIngestionRunSchema.parse(JSON.parse(ingestionText));
const riskCalculation = EurUsdRiskCalculationSchema.parse(JSON.parse(riskText));
const riskReview = CanonicalRiskReviewSchema.parse(JSON.parse(reviewText));
const configuration = HistoricalDecisionFreezeConfigurationSchema.parse(
  JSON.parse(configurationText)
);
const artifact = freezeHistoricalDecisionBundle({
  run,
  riskCalculation,
  riskReview,
  configuration
});
const absoluteOutput = path.resolve(outputPath);

await mkdir(path.dirname(absoluteOutput), { recursive: true });
await writeFile(absoluteOutput, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

console.log(`Artifact: ${artifact.artifactId}`);
console.log(`Trace: ${artifact.traceId}`);
console.log(`Historical run: ${artifact.historicalRunId}`);
console.log(`Candidate: ${artifact.candidateEvaluation.detection.candidateId}`);
console.log(`Risk calculation: ${artifact.riskCalculation.riskCalculationId}`);
console.log(`Risk review: ${artifact.riskReview.riskReviewId}`);
console.log(`Bundle hash: ${artifact.decisionRecord.bundleHash}`);
console.log(`Artifact hash: ${artifact.artifactHash}`);
console.log(`Output: ${absoluteOutput}`);

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
      `Missing --${key}. Usage: pnpm freeze:epoch1-decision -- --ingestion <file> --risk <file> --review <file> --configuration <file>`
    );
  }
  return value;
}
