import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCanonicalRiskReviewFromCalculation } from "../packages/application/src/index.js";
import {
  EurUsdRiskCalculationSchema,
  HistoricalIngestionRunSchema,
  HistoricalRiskReviewDecisionSchema
} from "../packages/contracts/src/index.js";

const args = parseArgs(process.argv.slice(2));
const ingestionPath = required(args, "ingestion");
const riskPath = required(args, "risk");
const decisionPath = required(args, "decision");
const outputPath = args.output ?? path.join(".local-data", "epoch1", "canonical-risk-review.json");

const [ingestionText, riskText, decisionText] = await Promise.all([
  readFile(path.resolve(ingestionPath), "utf8"),
  readFile(path.resolve(riskPath), "utf8"),
  readFile(path.resolve(decisionPath), "utf8")
]);
const run = HistoricalIngestionRunSchema.parse(JSON.parse(ingestionText));
const calculation = EurUsdRiskCalculationSchema.parse(JSON.parse(riskText));
const decision = HistoricalRiskReviewDecisionSchema.parse(JSON.parse(decisionText));
const evaluation = run.candidateEvaluations.find(
  (candidate) => candidate.detection.candidateId === calculation.candidateId
);

if (!evaluation) {
  throw new Error(`Candidate ${calculation.candidateId} is not present in ${run.runId}.`);
}
if (calculation.sourceLineage.historicalRunId !== run.runId) {
  throw new Error("Risk calculation does not belong to the supplied historical ingestion run.");
}

const review = createCanonicalRiskReviewFromCalculation({
  riskReviewId: `risk-review-${calculation.riskCalculationId}`,
  assessment: evaluation.assessment,
  calculation,
  reviewDecision: decision.reviewDecision,
  portfolioExposurePctAfterEntry: decision.portfolioExposurePctAfterEntry,
  reviewedBy: decision.reviewedBy,
  reviewedAt: decision.reviewedAt,
  validUntil: decision.validUntil,
  ...(decision.additionalAssumptions
    ? { additionalAssumptions: decision.additionalAssumptions }
    : {}),
  ...(decision.additionalBlockers ? { additionalBlockers: decision.additionalBlockers } : {})
});
const absoluteOutput = path.resolve(outputPath);

await mkdir(path.dirname(absoluteOutput), { recursive: true });
await writeFile(absoluteOutput, `${JSON.stringify(review, null, 2)}\n`, "utf8");

console.log(`Risk review: ${review.reviewStatus}`);
console.log(`Review ID: ${review.riskReviewId}`);
console.log(`Risk calculation: ${review.riskCalculationId}`);
console.log(`Position units: ${review.positionSizeUnits}`);
console.log(`Output: ${absoluteOutput}`);

if (review.reviewStatus !== "APPROVED_FOR_LOCAL_SIMULATION") {
  for (const blocker of review.blockers) console.error(`- ${blocker}`);
  process.exitCode = 1;
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
      `Missing --${key}. Usage: pnpm run:epoch1-risk-review -- --ingestion <file> --risk <file> --decision <file>`
    );
  }
  return value;
}
