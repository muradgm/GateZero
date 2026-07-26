import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  FrozenDecisionRecordSchema,
  ValidatedSimulationOutcomeSchema,
  type LearningFailureMode,
  type LearningInvalidationCode,
  type LearningRegime,
  type OperatorProcessError,
  type ValidatedSimulationOutcome
} from "../packages/contracts/src/index.js";
import {
  buildLearningIntelligenceReport,
  createDeterministicLearningEvent,
  createLearningIntelligenceCase,
  createLearningIntelligenceCheckpoint,
  hashCanonicalValue
} from "../packages/application/src/index.js";

function sourceChain(
  id: string,
  disposition: ValidatedSimulationOutcome["disposition"],
  strategyVersion = "eurusd-overlap-pullback-1.0.0"
) {
  const day = String(10 + Number(id)).padStart(2, "0");
  const bundle = {
    schemaVersion: 1 as const,
    traceId: `epoch4-trace-${id}`,
    setupReviewId: `epoch4-setup-${id}`,
    instrument: "EURUSD" as const,
    decisionTimestamp: `2026-07-${day}T13:00:00.000Z`,
    operatorId: "operator-local",
    sourceId: "historical-adapter",
    rawDataHash: `sha256:epoch4-raw-${id}`,
    normalizedDataHash: `sha256:epoch4-normalized-${id}`,
    strategyId: "EURUSD_LN_NY_PULLBACK" as const,
    strategyVersion,
    strategyParametersHash: `sha256:epoch4-strategy-${id}`,
    featureEngineVersion: "feature-engine-1.0.0",
    riskEngineVersion: "risk-engine-1.0.0",
    simulationPolicyVersion: "simulation-policy-1.0.0",
    applicationCommit: "local-epoch4-proof",
    configurationHash: `sha256:epoch4-configuration-${id}`,
    evidenceBundleHash: `sha256:epoch4-evidence-${id}`,
    canonicalAssessmentHash: `sha256:epoch4-assessment-${id}`,
    riskReviewId: `epoch4-risk-${id}`,
    riskReviewHash: `sha256:epoch4-risk-${id}`,
    simulationPlan: {
      direction: "LONG" as const,
      entryPrice: 1.0835,
      stopPrice: 1.081,
      targetPrice: 1.0885,
      positionSizeUnits: 10_000,
      plannedRiskAmount: 25
    },
    recommendation: "PAPER_SIMULATE" as const,
    blockers: [],
    temporalEvidence: [
      {
        evidenceId: `epoch4-evidence-${id}`,
        sourceId: "historical-adapter",
        observedAt: `2026-07-${day}T12:44:59.000Z`,
        availableAt: `2026-07-${day}T12:45:00.000Z`,
        transformationVersion: "feature-engine-1.0.0",
        contentHash: `sha256:epoch4-temporal-${id}`
      }
    ],
    createdAt: `2026-07-${day}T13:06:00.000Z`
  };
  const frozenRecord = FrozenDecisionRecordSchema.parse({
    schemaVersion: 1,
    bundle,
    bundleHash: hashCanonicalValue(bundle),
    frozenAt: `2026-07-${day}T13:10:00.000Z`
  });
  const outcomePayload = {
    schemaVersion: 1 as const,
    outcomeId: `epoch4-outcome-${id}`,
    traceId: bundle.traceId,
    frozenBundleHash: frozenRecord.bundleHash,
    simulationId: `epoch4-simulation-${id}`,
    simulationOutputHash: `sha256:epoch4-simulation-${id}`,
    disposition,
    operatorNote: `Manual local attribution for Epoch 4 fixture ${id}.`,
    operatorNoteAuthorship: "MANUAL_LOCAL" as const,
    attributedAt: `2026-07-${day}T14:00:00.000Z`,
    performanceClaim: false as const,
    executionPath: false as const
  };
  const outcome = ValidatedSimulationOutcomeSchema.parse({
    ...outcomePayload,
    outcomeHash: hashCanonicalValue(outcomePayload)
  });
  return {
    frozenRecord,
    outcome,
    learningEvent: createDeterministicLearningEvent(outcome)
  };
}

function learningCase(input: {
  id: string;
  disposition: ValidatedSimulationOutcome["disposition"];
  regime: LearningRegime;
  invalidationCode: LearningInvalidationCode;
  evidenceCombination: readonly string[];
  failureModes?: readonly LearningFailureMode[];
  operatorProcessErrors?: readonly OperatorProcessError[];
  strategyVersion?: string;
}) {
  const source = sourceChain(input.id, input.disposition, input.strategyVersion);
  return createLearningIntelligenceCase({
    caseRecordId: `epoch4-learning-case-${input.id}`,
    ...source,
    regime: input.regime,
    invalidationCode: input.invalidationCode,
    evidenceCombination: input.evidenceCombination,
    failureModes: input.failureModes ?? [],
    operatorProcessErrors: input.operatorProcessErrors ?? [],
    observedAt: source.outcome.attributedAt,
    limitations: [
      "Local immutable fixture evidence only.",
      "Operator-process attribution is manual and requires review."
    ]
  });
}

const cases = [
  learningCase({
    id: "1",
    disposition: "TARGET",
    regime: "TREND_PULLBACK",
    invalidationCode: "NONE",
    evidenceCombination: ["trend", "structure", "liquidity", "risk"]
  }),
  learningCase({
    id: "2",
    disposition: "STOP",
    regime: "TREND_PULLBACK",
    invalidationCode: "STRUCTURE_BREAK",
    evidenceCombination: ["trend", "structure", "liquidity", "risk"],
    failureModes: ["TIMING"],
    operatorProcessErrors: ["EARLY_ENTRY"]
  }),
  learningCase({
    id: "3",
    disposition: "STOP",
    regime: "TREND_PULLBACK",
    invalidationCode: "STRUCTURE_BREAK",
    evidenceCombination: ["trend", "structure", "liquidity", "risk"],
    failureModes: ["TIMING"],
    operatorProcessErrors: ["EARLY_ENTRY"]
  }),
  learningCase({
    id: "4",
    disposition: "INVALID",
    regime: "EVENT_RISK",
    invalidationCode: "SIMULATION_AMBIGUITY",
    evidenceCombination: ["event_risk", "risk"],
    failureModes: ["EVIDENCE"],
    operatorProcessErrors: ["MISSED_CONTRADICTION"]
  }),
  learningCase({
    id: "5",
    disposition: "EXPIRED",
    regime: "EVENT_RISK",
    invalidationCode: "EVENT_WINDOW",
    evidenceCombination: ["event_risk", "risk"],
    failureModes: ["EVIDENCE"],
    operatorProcessErrors: ["MISSED_CONTRADICTION"]
  }),
  learningCase({
    id: "6",
    disposition: "NOT_FILLED",
    regime: "VOLATILITY_EXPANSION",
    invalidationCode: "ENTRY_NOT_REACHED",
    evidenceCombination: ["volatility", "structure", "risk"],
    strategyVersion: "eurusd-overlap-pullback-1.1.0"
  })
];
const limitations = [
  "Six local immutable EURUSD fixtures only.",
  "Exact clusters describe shared attributes and do not forecast outcomes.",
  "No pattern changes strategy rules, risk limits, or execution authority."
];
const firstReport = buildLearningIntelligenceReport({
  reportId: "epoch4-learning-report",
  cases,
  generatedAt: "2026-07-24T18:00:00.000Z",
  limitations
});
const secondReport = buildLearningIntelligenceReport({
  reportId: "epoch4-learning-report",
  cases: [...cases].reverse(),
  generatedAt: "2026-07-24T18:00:00.000Z",
  limitations
});
const checkpoint = createLearningIntelligenceCheckpoint({
  checkpointId: "epoch4-learning-checkpoint",
  cases,
  firstReport,
  secondReport,
  checkedAt: "2026-07-24T18:05:00.000Z"
});
const output = {
  dataMode: "LOCAL_DETERMINISTIC_LEARNING_FIXTURE",
  sourceCaseCount: cases.length,
  cases,
  report: firstReport,
  checkpoint,
  limitations
};
const target = path.join(process.cwd(), "apps", "intelligence-workspace", "public", "runtime");
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, "epoch4-learning-case.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8"
);
