import { describe, expect, it } from "vitest";
import type {
  CanonicalDecisionAssessment,
  RegisteredStrategyAssessment
} from "@traderframe/contracts";
import {
  EPOCH5_STRATEGY_DEFINITIONS,
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
} from "../src/index.js";

const observations = [
  {
    strategyId: "EURUSD_LN_NY_PULLBACK" as const,
    observation: {
      candidateId: "shared-source-case",
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
      evidenceIds: ["pullback-15m", "pullback-1h", "pullback-4h"],
      availableAt: "2026-07-24T13:00:00.000Z"
    }
  },
  {
    strategyId: "EURUSD_LONDON_RANGE_BREAKOUT" as const,
    observation: {
      candidateId: "shared-source-case",
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
      evidenceIds: ["range-1", "range-2", "range-3", "range-4", "breakout"],
      availableAt: "2026-07-24T08:15:00.000Z"
    }
  }
];

describe("Epoch 5 strategy platform", () => {
  it("registers two static strategies with immutable research-only boundaries", () => {
    const registry = createStrategyRegistry();

    expect(registry.definitions).toHaveLength(2);
    expect(registry.registryHash).toMatch(/^sha256:/);
    expect(
      registry.definitions.every(
        ({ registration }) =>
          registration.localResearchOnly &&
          registration.executionPath === false &&
          registration.automatedAction === false &&
          registration.optimizationAuthority === false
      )
    ).toBe(true);
    expect(Object.isFrozen(registry)).toBe(true);
  });

  it("rejects duplicate registrations and missing observations without fallback", () => {
    expect(() =>
      createStrategyRegistry([EPOCH5_STRATEGY_DEFINITIONS[0]!, EPOCH5_STRATEGY_DEFINITIONS[0]!])
    ).toThrow(/duplicate strategy identities/);

    expect(() => evaluateStrategyRegistry(createStrategyRegistry(), [observations[0]!])).toThrow(
      /one observation per registered strategy/
    );
  });

  it("isolates candidate and assessment identity across strategies", () => {
    const assessments = evaluateStrategyRegistry(createStrategyRegistry(), observations);

    expect(assessments).toHaveLength(2);
    expect(new Set(assessments.map(({ assessment }) => assessment.candidateId)).size).toBe(2);
    expect(assessments.map(({ assessment }) => assessment.strategyId).sort()).toEqual([
      "EURUSD_LN_NY_PULLBACK",
      "EURUSD_LONDON_RANGE_BREAKOUT"
    ]);
    expect(
      assessments.every(({ assessment }) => assessment.recommendation === "PAPER_SIMULATE")
    ).toBe(true);
  });

  it("completes both strategies through the same protected loop deterministically", () => {
    const registry = createStrategyRegistry();
    const first = evaluateStrategyRegistry(registry, observations);
    const second = evaluateStrategyRegistry(registry, observations);
    const lifecycles = first.map((registered, index) => completedLifecycle(registered, index));
    const checkpoint = createMultiStrategyCheckpoint({
      checkpointId: "epoch5-multi-strategy-checkpoint",
      registry,
      firstAssessments: first,
      secondAssessments: second,
      lifecycles,
      checkedAt: "2026-07-24T18:00:00.000Z"
    });

    expect(checkpoint).toMatchObject({
      status: "PASS",
      deterministic: true,
      identityIsolated: true,
      protectedLoopShared: true,
      completeLifecycleCount: 2,
      executionPath: false,
      automatedAction: false,
      optimizationAuthority: false
    });
  });

  it("fails closed when a strategy assessment hash is substituted", () => {
    const registry = createStrategyRegistry();
    const first = evaluateStrategyRegistry(registry, observations);
    const tampered = first.map((entry, index) =>
      index === 1 ? { ...entry, assessmentHash: first[0]!.assessmentHash } : entry
    );
    const checkpoint = createMultiStrategyCheckpoint({
      checkpointId: "epoch5-tamper-checkpoint",
      registry,
      firstAssessments: tampered,
      secondAssessments: tampered,
      lifecycles: first.map((registered, index) => completedLifecycle(registered, index)),
      checkedAt: "2026-07-24T18:00:00.000Z"
    });

    expect(checkpoint.status).toBe("FAIL");
    expect(checkpoint.deterministic).toBe(false);
  });

  it("rejects cross-strategy lifecycle substitution", () => {
    const registry = createStrategyRegistry();
    const assessments = evaluateStrategyRegistry(registry, observations);
    const pullbackLifecycle = completedTrace(assessments[0]!, 0);
    const rangeRegistration = assessments[1]!.registration;

    expect(() =>
      createMultiStrategyLifecycle({
        registration: rangeRegistration,
        assessment: assessments[1]!.assessment,
        trace: pullbackLifecycle
      })
    ).toThrow(/identity or assessment chain mismatch/);
  });
});

function completedLifecycle(registered: RegisteredStrategyAssessment, index: number) {
  return createMultiStrategyLifecycle({
    registration: registered.registration,
    assessment: registered.assessment,
    trace: completedTrace(registered, index)
  });
}

function completedTrace(registered: RegisteredStrategyAssessment, index: number) {
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
      applicationCommit: "epoch5-test",
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
  return completeValidatedDecisionTrace({
    frozenRecord,
    firstSimulation: first,
    secondSimulation: second,
    outcome,
    learningEvent,
    checkedAt: addMinutes(decisionTimestamp, 50)
  }).trace;
}

function simulationPlan(assessment: CanonicalDecisionAssessment) {
  if (assessment.strategyId === "EURUSD_LONDON_RANGE_BREAKOUT") {
    return {
      direction: "LONG" as const,
      entryPrice: 1.0832,
      stopPrice: 1.0809,
      targetPrice: 1.0878,
      positionSizeUnits: 10_000,
      plannedRiskAmount: 23
    };
  }
  return {
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
