import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildCanonicalDecisionAssessment,
  completeValidatedDecisionTrace,
  createCanonicalRiskReview,
  createDeterministicLearningEvent,
  freezeDecisionBundle,
  recordSimulationOutcome,
  runDeterministicSimulation
} from "../packages/application/src/index.js";

const decisionTimestamp = "2026-07-24T13:00:00.000Z";
const assessment = buildCanonicalDecisionAssessment({
  candidateId: "epoch1-validated-eurusd",
  decisionTimestamp,
  direction: "LONG",
  dataReady: true,
  sessionEligible: true,
  higherTimeframeAligned: true,
  pullbackRetracementAtr: 0.65,
  pullbackAgeCandles: 4,
  liquiditySweepDetected: true,
  sweepPenetrationPips: 2,
  sweepReclaimedWithinCandles: 2,
  displacementAtr: 0.8,
  triggerConfirmed: true,
  triggerAgeCandles: 1,
  eventContextStatus: "AVAILABLE",
  minutesToNearestHighImpactEvent: 90,
  invalidationPrice: 1.081,
  currentPrice: 1.0835,
  candlesSinceTrigger: 1,
  sessionEnded: false,
  evidenceIds: ["epoch1-15m", "epoch1-1h", "epoch1-4h"],
  availableAt: decisionTimestamp
});
const riskReview = createCanonicalRiskReview({
  riskReviewId: "epoch1-risk-review",
  assessment,
  riskEngineVersion: "risk-engine-1.0.0",
  reviewStatus: "APPROVED_FOR_LOCAL_SIMULATION",
  maximumRiskPct: 0.5,
  maximumRiskAmount: 50,
  positionSizeUnits: 10_000,
  portfolioExposurePctAfterEntry: 12,
  spreadPips: 0.8,
  commissionAmount: 4,
  slippagePips: 0.2,
  assumptions: ["Local deterministic paper simulation only."],
  blockers: [],
  reviewedBy: "operator-risk-reviewer",
  reviewedAt: "2026-07-24T13:05:00.000Z",
  validUntil: "2026-07-24T14:00:00.000Z"
});
const frozenRecord = freezeDecisionBundle({
  bundle: {
    schemaVersion: 1,
    traceId: "epoch1-validated-trace",
    setupReviewId: "epoch1-setup-review",
    instrument: "EURUSD",
    decisionTimestamp,
    operatorId: "operator-local",
    sourceId: "historical-adapter",
    rawDataHash: "sha256:epoch1-raw",
    normalizedDataHash: "sha256:epoch1-normalized",
    strategyId: assessment.strategyId,
    strategyVersion: assessment.strategyVersion,
    strategyParametersHash: "sha256:epoch1-strategy",
    featureEngineVersion: assessment.observationEngineVersion,
    riskEngineVersion: riskReview.riskEngineVersion,
    simulationPolicyVersion: "simulation-policy-1.0.0",
    applicationCommit: "local-epoch1-proof",
    configurationHash: "sha256:epoch1-configuration",
    evidenceBundleHash: "sha256:epoch1-evidence",
    simulationPlan: {
      direction: "LONG",
      entryPrice: 1.0835,
      stopPrice: 1.081,
      targetPrice: 1.0885,
      positionSizeUnits: 10_000,
      plannedRiskAmount: 25
    },
    recommendation: "PAPER_SIMULATE",
    blockers: [],
    temporalEvidence: [
      {
        evidenceId: "epoch1-15m",
        sourceId: "historical-adapter",
        observedAt: "2026-07-24T12:44:59.000Z",
        availableAt: "2026-07-24T12:45:00.000Z",
        transformationVersion: assessment.observationEngineVersion,
        contentHash: "sha256:epoch1-candle"
      }
    ],
    createdAt: "2026-07-24T13:06:00.000Z"
  },
  assessment,
  riskReview,
  frozenAt: "2026-07-24T13:10:00.000Z"
});
const policy = {
  schemaVersion: 1 as const,
  policyId: "epoch1-policy",
  version: "simulation-policy-1.0.0",
  instrument: "EURUSD" as const,
  executionMode: "deterministic_paper_simulation" as const,
  orderType: "LIMIT" as const,
  triggerCondition: "Touch the frozen entry after decision time.",
  fillAssumption: "TOUCH_WITH_SPREAD" as const,
  spreadModel: { type: "FIXED_PIPS" as const, valuePips: 0.8 },
  commissionModel: { type: "FIXED_ACCOUNT_CURRENCY" as const, value: 4 },
  slippageModel: { type: "FIXED_PIPS" as const, value: 0.2 },
  gapPolicy: "FILL_AT_FIRST_AVAILABLE_PRICE" as const,
  stopExecutionPolicy: "TOUCH" as const,
  targetExecutionPolicy: "TOUCH" as const,
  sameCandleConflictPolicy: "STOP_FIRST" as const,
  partialFillPolicy: "FULL_FILL_ONLY" as const,
  sessionClosurePolicy: "EXPIRE_UNFILLED" as const,
  maximumHoldingBars: 4,
  pricePrecision: 5,
  pipSize: 0.0001,
  createdAt: "2026-07-24T12:00:00.000Z"
};
const candles = [
  {
    candleId: "epoch1-result-candle",
    sourceId: "historical-adapter",
    instrument: "EURUSD" as const,
    timeframe: "15m" as const,
    openedAt: "2026-07-24T13:15:00.000Z",
    closedAt: "2026-07-24T13:30:00.000Z",
    timezone: "UTC" as const,
    open: 1.0835,
    high: 1.0886,
    low: 1.0834,
    close: 1.0884,
    finalized: true as const,
    sourceHash: "sha256:epoch1-result-candle",
    normalizationVersion: "normalizer-1.0.0"
  }
];
const first = runDeterministicSimulation({ frozenRecord, policy, candles });
const second = runDeterministicSimulation({ frozenRecord, policy, candles });
const outcome = recordSimulationOutcome({
  frozenRecord,
  simulation: first,
  operatorNote: "Local fixture reviewed against frozen evidence and assumptions.",
  attributedAt: "2026-07-24T14:00:00.000Z"
});
const learningEvent = createDeterministicLearningEvent(outcome);
const completed = completeValidatedDecisionTrace({
  frozenRecord,
  firstSimulation: first,
  secondSimulation: second,
  outcome,
  learningEvent,
  checkedAt: "2026-07-24T14:05:00.000Z"
});
const output = {
  dataMode: "LOCAL_VALIDATED_FIXTURE",
  trace: completed.trace,
  checkpoint: completed.checkpoint,
  simulation: first,
  outcome,
  learningEvent,
  limitations: [
    "One local EURUSD fixture only.",
    "This is reproducibility evidence, not a performance claim or execution approval."
  ]
};
const target = path.join(process.cwd(), "apps", "intelligence-workspace", "public", "runtime");
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, "epoch1-validated-case.json"),
  `${JSON.stringify(output, null, 2)}\n`
);
