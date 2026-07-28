import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  CanonicalDecisionAssessment,
  RegisteredStrategyAssessment
} from "../packages/contracts/src/index.js";
import {
  completeValidatedDecisionTrace,
  createCanonicalRiskReview,
  createDeterministicLearningEvent,
  createMultiStrategyCheckpoint,
  createMultiStrategyLifecycle,
  createStrategyRegistry,
  evaluateStrategyRegistry,
  freezeDecisionBundle,
  recordSimulationOutcome,
  runDeterministicSimulation
} from "../packages/application/src/index.js";

const observations = [
  {
    strategyId: "EURUSD_LN_NY_PULLBACK" as const,
    observation: {
      candidateId: "epoch5-shared-source-case",
      decisionTimestamp: "2026-07-24T13:00:00.000Z",
      direction: "LONG" as const,
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
      eventContextStatus: "AVAILABLE" as const,
      minutesToNearestHighImpactEvent: 90,
      invalidationPrice: 1.081,
      currentPrice: 1.0835,
      candlesSinceTrigger: 1,
      sessionEnded: false,
      evidenceIds: ["epoch5-pullback-15m", "epoch5-pullback-1h", "epoch5-pullback-4h"],
      availableAt: "2026-07-24T13:00:00.000Z"
    }
  },
  {
    strategyId: "EURUSD_LONDON_RANGE_BREAKOUT" as const,
    observation: {
      candidateId: "epoch5-shared-source-case",
      decisionTimestamp: "2026-07-24T08:15:00.000Z",
      direction: "LONG" as const,
      dataReady: true,
      rangeCompleted: true,
      rangeHigh: 1.083,
      rangeLow: 1.081,
      breakoutClose: 1.0832,
      breakoutAgeCandles: 0,
      eventContextStatus: "AVAILABLE" as const,
      minutesToNearestHighImpactEvent: 90,
      invalidationPrice: 1.0809,
      sessionEnded: false,
      evidenceIds: [
        "epoch5-range-1",
        "epoch5-range-2",
        "epoch5-range-3",
        "epoch5-range-4",
        "epoch5-breakout"
      ],
      availableAt: "2026-07-24T08:15:00.000Z"
    }
  }
];

const registry = createStrategyRegistry();
const firstAssessments = evaluateStrategyRegistry(registry, observations);
const secondAssessments = evaluateStrategyRegistry(registry, observations);
const lifecycles = firstAssessments.map((registered, index) =>
  buildCompletedLifecycle(registered, index)
);
const checkpoint = createMultiStrategyCheckpoint({
  checkpointId: "epoch5-multi-strategy-checkpoint",
  registry,
  firstAssessments,
  secondAssessments,
  lifecycles,
  checkedAt: "2026-07-24T18:00:00.000Z"
});
const output = {
  dataMode: "LOCAL_MULTI_STRATEGY_FIXTURE",
  registryHash: registry.registryHash,
  registrations: registry.definitions.map(({ registration }) => registration),
  assessments: firstAssessments,
  lifecycles,
  checkpoint,
  limitations: [
    "Two fixed EURUSD strategies and local historical fixtures only.",
    "Strategy registration is static and allowlisted; no dynamic or external code is loaded.",
    "The fixture demonstrates identity isolation and reproducibility, not edge or performance.",
    "Every result remains local paper-simulation evidence with explicit operator review."
  ]
};
const target = path.join(process.cwd(), "apps", "intelligence-workspace", "public", "runtime");
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, "epoch5-multi-strategy-case.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8"
);

function buildCompletedLifecycle(registered: RegisteredStrategyAssessment, index: number) {
  const assessment = registered.assessment;
  const decisionTimestamp = assessment.decisionTimestamp;
  const riskReview = createCanonicalRiskReview({
    riskReviewId: `epoch5-risk-${index}`,
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
    reviewedAt: addMinutes(decisionTimestamp, 5),
    validUntil: addMinutes(decisionTimestamp, 60)
  });
  const plan = simulationPlan(assessment);
  const frozenRecord = freezeDecisionBundle({
    bundle: {
      schemaVersion: 1,
      traceId: `epoch5-trace-${index}`,
      setupReviewId: `epoch5-setup-${index}`,
      instrument: "EURUSD",
      decisionTimestamp,
      operatorId: "operator-local",
      sourceId: "local-historical-fixture",
      rawDataHash: `sha256:epoch5-raw-${index}`,
      normalizedDataHash: `sha256:epoch5-normalized-${index}`,
      strategyId: assessment.strategyId,
      strategyVersion: assessment.strategyVersion,
      strategyParametersHash: registered.registration.definitionHash,
      featureEngineVersion: assessment.observationEngineVersion,
      riskEngineVersion: riskReview.riskEngineVersion,
      simulationPolicyVersion: "simulation-policy-1.0.0",
      applicationCommit: "local-epoch5-proof",
      configurationHash: `sha256:epoch5-configuration-${index}`,
      evidenceBundleHash: `sha256:epoch5-evidence-${index}`,
      simulationPlan: plan,
      recommendation: "PAPER_SIMULATE",
      blockers: [],
      temporalEvidence: [
        {
          evidenceId: `epoch5-evidence-${index}`,
          sourceId: "local-historical-fixture",
          observedAt: addMinutes(decisionTimestamp, -16),
          availableAt: addMinutes(decisionTimestamp, -15),
          transformationVersion: assessment.observationEngineVersion,
          contentHash: `sha256:epoch5-temporal-${index}`
        }
      ],
      createdAt: addMinutes(decisionTimestamp, 6)
    },
    assessment,
    riskReview,
    frozenAt: addMinutes(decisionTimestamp, 10)
  });
  const policy = {
    schemaVersion: 1 as const,
    policyId: `epoch5-policy-${index}`,
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
    createdAt: addMinutes(decisionTimestamp, -60)
  };
  const candles = [
    {
      candleId: `epoch5-result-${index}`,
      sourceId: "local-historical-fixture",
      instrument: "EURUSD" as const,
      timeframe: "15m" as const,
      openedAt: addMinutes(decisionTimestamp, 15),
      closedAt: addMinutes(decisionTimestamp, 30),
      timezone: "UTC" as const,
      open: plan.entryPrice,
      high: plan.targetPrice + 0.0001,
      low: plan.entryPrice - 0.0001,
      close: plan.targetPrice,
      finalized: true as const,
      sourceHash: `sha256:epoch5-result-${index}`,
      normalizationVersion: "normalizer-1.0.0"
    }
  ];
  const first = runDeterministicSimulation({ frozenRecord, policy, candles });
  const second = runDeterministicSimulation({ frozenRecord, policy, candles });
  const outcome = recordSimulationOutcome({
    frozenRecord,
    simulation: first,
    operatorNote: "Local deterministic Epoch 5 fixture.",
    attributedAt: addMinutes(decisionTimestamp, 45)
  });
  const learningEvent = createDeterministicLearningEvent(outcome);
  const completed = completeValidatedDecisionTrace({
    frozenRecord,
    firstSimulation: first,
    secondSimulation: second,
    outcome,
    learningEvent,
    checkedAt: addMinutes(decisionTimestamp, 50)
  });

  return createMultiStrategyLifecycle({
    registration: registered.registration,
    assessment,
    trace: completed.trace
  });
}

function simulationPlan(assessment: CanonicalDecisionAssessment) {
  return assessment.strategyId === "EURUSD_LONDON_RANGE_BREAKOUT"
    ? {
        direction: "LONG" as const,
        entryPrice: 1.0832,
        stopPrice: 1.0809,
        targetPrice: 1.0878,
        positionSizeUnits: 10_000,
        plannedRiskAmount: 23
      }
    : {
        direction: "LONG" as const,
        entryPrice: 1.0835,
        stopPrice: 1.081,
        targetPrice: 1.0885,
        positionSizeUnits: 10_000,
        plannedRiskAmount: 25
      };
}

function addMinutes(timestamp: string, minutes: number): string {
  return new Date(Date.parse(timestamp) + minutes * 60_000).toISOString();
}
