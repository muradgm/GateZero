import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { calculateEurUsdRiskFromHistoricalRun } from "../packages/application/src/index.js";
import {
  EurUsdRiskPolicySchema,
  HistoricalIngestionRunSchema
} from "../packages/contracts/src/index.js";

const args = parseArgs(process.argv.slice(2));
const ingestionPath = required(args, "ingestion");
const policyPath = required(args, "policy");
const candidateId = required(args, "candidate");
const outputPath =
  args.output ?? path.join(".local-data", "epoch1", "eurusd-risk-calculation.json");

const [ingestionText, policyText] = await Promise.all([
  readFile(path.resolve(ingestionPath), "utf8"),
  readFile(path.resolve(policyPath), "utf8")
]);
const run = HistoricalIngestionRunSchema.parse(JSON.parse(ingestionText));
const policy = EurUsdRiskPolicySchema.parse(JSON.parse(policyText));
const result = calculateEurUsdRiskFromHistoricalRun({ run, candidateId, policy });
const absoluteOutput = path.resolve(outputPath);

await mkdir(path.dirname(absoluteOutput), { recursive: true });
await writeFile(absoluteOutput, `${JSON.stringify(result, null, 2)}\n`, "utf8");

console.log(`Risk gate: ${result.riskGate}`);
console.log(`Calculation: ${result.riskCalculationId}`);
console.log(`Candidate: ${result.candidateId}`);
console.log(`Position units: ${result.positionSizeUnits}`);
console.log(
  `Worst-case planned loss: ${result.totalWorstCasePlannedLoss} ${result.accountCurrency}`
);
console.log(`Risk budget: ${result.riskBudgetAmount} ${result.accountCurrency}`);
console.log(`Output: ${absoluteOutput}`);

if (result.riskGate === "BLOCKED") {
  for (const blocker of result.blockers) console.error(`- ${blocker}`);
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
      `Missing --${key}. Usage: pnpm run:epoch1-risk -- --ingestion <file> --policy <file> --candidate <id>`
    );
  }
  return value;
}
