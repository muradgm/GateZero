import { pathToFileURL } from "node:url";
import path from "node:path";

interface ScenarioRecommendation {
  readonly id: string;
  readonly candidate: string;
  readonly redFlag: string;
  readonly evidenceRefs: readonly string[];
  readonly sourceRefs: readonly string[];
}

interface RecommendationRiskReview {
  readonly id: string;
  readonly blockerRefs: readonly string[];
}

interface SimulationCandidate {
  readonly id: string;
  readonly simulationRecord: string;
  readonly evidenceDetail: string;
}

export interface MarketIntelligenceWorkspaceConsistencyInput {
  readonly workspaceRefs: readonly string[];
  readonly recommendation: ScenarioRecommendation;
  readonly riskReview: RecommendationRiskReview;
  readonly simulationCandidate: SimulationCandidate;
}

export interface MarketIntelligenceWorkspaceConsistencyResult {
  readonly ok: boolean;
  readonly findings: readonly string[];
}

export function checkMarketIntelligenceWorkspaceConsistency(
  input: MarketIntelligenceWorkspaceConsistencyInput
): MarketIntelligenceWorkspaceConsistencyResult {
  const findings: string[] = [];
  const workspaceRefs = new Set(input.workspaceRefs);

  requireWorkspaceRef(findings, workspaceRefs, input.recommendation.id, "scenario recommendation");
  requireWorkspaceRef(findings, workspaceRefs, input.recommendation.candidate, "signal candidate");
  requireWorkspaceRef(findings, workspaceRefs, input.recommendation.redFlag, "red flag");
  requireWorkspaceRef(findings, workspaceRefs, input.riskReview.id, "recommendation risk review");
  requireWorkspaceRef(
    findings,
    workspaceRefs,
    input.simulationCandidate.id,
    "simulation candidate"
  );

  for (const evidenceRef of input.recommendation.evidenceRefs) {
    requireWorkspaceRef(findings, workspaceRefs, evidenceRef, "scenario evidence");
  }

  if (!input.riskReview.blockerRefs.includes(input.recommendation.redFlag)) {
    findings.push("Recommendation red flag is not linked by the risk review.");
  }

  if (!input.simulationCandidate.simulationRecord || !input.simulationCandidate.evidenceDetail) {
    findings.push("Simulation candidate is missing its local simulation evidence links.");
  }

  for (const sourceRef of input.recommendation.sourceRefs) {
    if (!isLocalSourceRef(sourceRef)) {
      findings.push(`Scenario source is not a checked-in local path: ${sourceRef}`);
    }
  }

  const duplicateRefs = findDuplicates(input.workspaceRefs);
  for (const duplicateRef of duplicateRefs) {
    findings.push(`Duplicate market workspace reference: ${duplicateRef}`);
  }

  return { ok: findings.length === 0, findings };
}

export function renderMarketIntelligenceWorkspaceConsistencyResult(
  result: MarketIntelligenceWorkspaceConsistencyResult
): string {
  return result.ok
    ? "Market intelligence workspace consistency passed."
    : ["Market intelligence workspace consistency failed.", ...result.findings].join("\n");
}

async function loadWorkspaceInput(
  rootDir: string
): Promise<MarketIntelligenceWorkspaceConsistencyInput> {
  const dataUrl = pathToFileURL(
    path.join(rootDir, "apps", "web", "src", "command-center-data.js")
  ).href;
  const imported: unknown = await import(dataUrl);
  const data = asRecord(imported).commandCenterData;
  const root = asRecord(data);
  const strategyWorkspace = asRecord(root.strategyReviewWorkspace);
  const marketWorkspace = asRecord(root.marketIntelligenceWorkspace);
  const recommendation = asRecord(marketWorkspace.recommendation);
  const riskReview = asRecord(marketWorkspace.riskReview);
  const simulationCandidate = asRecord(marketWorkspace.simulationCandidate);

  return {
    workspaceRefs: asStringList(strategyWorkspace.marketIntelligence),
    recommendation: {
      id: asString(recommendation.id),
      candidate: asString(recommendation.candidate),
      redFlag: asString(recommendation.redFlag),
      evidenceRefs: asStringList(recommendation.evidenceRefs),
      sourceRefs: asStringList(recommendation.sourceRefs)
    },
    riskReview: {
      id: asString(riskReview.id),
      blockerRefs: asStringList(riskReview.blockerRefs)
    },
    simulationCandidate: {
      id: asString(simulationCandidate.id),
      simulationRecord: asString(simulationCandidate.simulationRecord),
      evidenceDetail: asString(simulationCandidate.evidenceDetail)
    }
  };
}

function requireWorkspaceRef(
  findings: string[],
  workspaceRefs: ReadonlySet<string>,
  ref: string,
  label: string
): void {
  if (!ref || !workspaceRefs.has(ref)) {
    findings.push(`Missing ${label} reference in strategy workspace: ${ref || "not recorded"}`);
  }
}

function isLocalSourceRef(value: string): boolean {
  return /^(apps|docs|ops|packages|scripts|skills)\//.test(value) && !value.includes("://");
}

function findDuplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  }

  return [...duplicates];
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Expected a command center record.");
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Expected a command center string value.");
  }
  return value;
}

function asStringList(value: unknown): readonly string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error("Expected a command center string list.");
  }
  return value;
}

async function main(): Promise<void> {
  const result = checkMarketIntelligenceWorkspaceConsistency(
    await loadWorkspaceInput(process.cwd())
  );
  const output = renderMarketIntelligenceWorkspaceConsistencyResult(result);

  if (result.ok) {
    console.log(output);
  } else {
    console.error(output);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
