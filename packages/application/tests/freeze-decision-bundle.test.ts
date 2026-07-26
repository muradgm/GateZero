import { describe, expect, it } from "vitest";
import {
  buildCanonicalDecisionAssessment,
  completeValidatedDecisionTrace,
  createCanonicalRiskReview,
  createDeterministicLearningEvent,
  freezeDecisionBundle,
  recordSimulationOutcome,
  runDeterministicSimulation
} from "../src/index.js";

const assessment = buildCanonicalDecisionAssessment({
  candidateId: "eurusd-freeze-001",
  decisionTimestamp: "2026-07-24T13:00:00.000Z",
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
  evidenceIds: ["ev-freeze-15m", "ev-freeze-1h", "ev-freeze-4h"],
  availableAt: "2026-07-24T13:00:00.000Z"
});

const riskReview = createCanonicalRiskReview({
  riskReviewId: "risk-review-freeze-001",
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

const bundle = {
  schemaVersion: 1 as const,
  traceId: "trace-freeze-001",
  setupReviewId: "setup-review-freeze-001",
  instrument: "EURUSD" as const,
  decisionTimestamp: assessment.decisionTimestamp,
  operatorId: "operator-local-001",
  sourceId: "historical-adapter-001",
  rawDataHash: "sha256:raw",
  normalizedDataHash: "sha256:normalized",
  strategyVersion: assessment.strategyVersion,
  strategyParametersHash: "sha256:strategy-parameters",
  featureEngineVersion: assessment.observationEngineVersion,
  riskEngineVersion: riskReview.riskEngineVersion,
  simulationPolicyVersion: "simulation-policy-1.0.0",
  applicationCommit: "abc1234",
  configurationHash: "sha256:configuration",
  evidenceBundleHash: "sha256:evidence-bundle",
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
      evidenceId: "ev-freeze-15m",
      sourceId: "historical-adapter-001",
      observedAt: "2026-07-24T12:44:59.000Z",
      availableAt: "2026-07-24T12:45:00.000Z",
      transformationVersion: assessment.observationEngineVersion,
      contentHash: "sha256:evidence"
    }
  ],
  createdAt: "2026-07-24T13:06:00.000Z"
};

const policy = {
  schemaVersion: 1 as const,
  policyId: "policy-freeze-001",
  version: "simulation-policy-1.0.0",
  instrument: "EURUSD" as const,
  executionMode: "deterministic_paper_simulation" as const,
  orderType: "LIMIT" as const,
  triggerCondition: "Touch the frozen entry after the decision timestamp.",
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

function candle(
  id: string,
  openedAt: string,
  closedAt: string,
  prices: { open: number; high: number; low: number; close: number }
) {
  return {
    candleId: id,
    sourceId: "historical-adapter-001",
    instrument: "EURUSD" as const,
    timeframe: "15m" as const,
    openedAt,
    closedAt,
    timezone: "UTC" as const,
    ...prices,
    finalized: true as const,
    sourceHash: `sha256:${id}`,
    normalizationVersion: "normalizer-1.0.0"
  };
}

describe("freezeDecisionBundle", () => {
  it("creates a hash-linked recursively immutable record", () => {
    const record = freezeDecisionBundle({
      bundle,
      assessment,
      riskReview,
      frozenAt: "2026-07-24T13:10:00.000Z"
    });

    expect(record.bundle.riskReviewId).toBe(riskReview.riskReviewId);
    expect(record.bundle.riskReviewHash).toBe(riskReview.reviewHash);
    expect(record.bundleHash).toMatch(/^sha256:/);
    expect(Object.isFrozen(record)).toBe(true);
    expect(Object.isFrozen(record.bundle)).toBe(true);
    expect(Object.isFrozen(record.bundle.temporalEvidence)).toBe(true);
  });

  it("refuses to freeze a paper-simulation bundle without risk evidence", () => {
    expect(() =>
      freezeDecisionBundle({
        bundle,
        assessment,
        frozenAt: "2026-07-24T13:10:00.000Z"
      })
    ).toThrow(/validated risk review/);
  });

  it("produces the same bundle hash for identical inputs", () => {
    const first = freezeDecisionBundle({
      bundle,
      assessment,
      riskReview,
      frozenAt: "2026-07-24T13:10:00.000Z"
    });
    const second = freezeDecisionBundle({
      bundle,
      assessment,
      riskReview,
      frozenAt: "2026-07-24T13:10:00.000Z"
    });

    expect(second).toEqual(first);
  });
});

describe("runDeterministicSimulation", () => {
  const record = freezeDecisionBundle({
    bundle,
    assessment,
    riskReview,
    frozenAt: "2026-07-24T13:10:00.000Z"
  });

  it("calculates deterministic fill, target, excursion, costs, and R-multiple evidence", () => {
    const candles = [
      candle("c1", "2026-07-24T13:15:00.000Z", "2026-07-24T13:30:00.000Z", {
        open: 1.084,
        high: 1.0842,
        low: 1.0834,
        close: 1.0841
      }),
      candle("c2", "2026-07-24T13:30:00.000Z", "2026-07-24T13:45:00.000Z", {
        open: 1.0841,
        high: 1.0886,
        low: 1.0838,
        close: 1.0884
      })
    ];

    const first = runDeterministicSimulation({ frozenRecord: record, policy, candles });
    const second = runDeterministicSimulation({ frozenRecord: record, policy, candles });

    expect(first.status).toBe("TARGET");
    expect(first.fillPrice).toBe(1.0836);
    expect(first.exitPrice).toBe(1.0885);
    expect(first.mfeR).toBeGreaterThan(0);
    expect(first.maeR).toBeLessThanOrEqual(0);
    expect(first.realizedR).toBeCloseTo(1.8, 5);
    expect(first.outputHash).toMatch(/^sha256:/);
    expect(second).toEqual(first);
  });

  it("fails closed when the frozen bundle hash is altered", () => {
    expect(() =>
      runDeterministicSimulation({
        frozenRecord: { ...record, bundleHash: "sha256:tampered" },
        policy,
        candles: []
      })
    ).toThrow(/bundle hash mismatch/);
  });

  it("invalidates an ambiguous same-candle outcome when lower-timeframe evidence is required", () => {
    const result = runDeterministicSimulation({
      frozenRecord: record,
      policy: { ...policy, sameCandleConflictPolicy: "LOWER_TIMEFRAME_REQUIRED" },
      candles: [
        candle("conflict", "2026-07-24T13:15:00.000Z", "2026-07-24T13:30:00.000Z", {
          open: 1.0835,
          high: 1.089,
          low: 1.08,
          close: 1.084
        })
      ]
    });

    expect(result.status).toBe("INVALID");
    expect(result.invalidationReason).toContain("lower-timeframe");
    expect(result.executionPath).toBe(false);
  });

  it("attributes an outcome and deterministic learning event to exact source hashes", () => {
    const simulation = runDeterministicSimulation({
      frozenRecord: record,
      policy,
      candles: [
        candle("outcome-1", "2026-07-24T13:15:00.000Z", "2026-07-24T13:30:00.000Z", {
          open: 1.0835,
          high: 1.0886,
          low: 1.0834,
          close: 1.0884
        })
      ]
    });
    const outcome = recordSimulationOutcome({
      frozenRecord: record,
      simulation,
      operatorNote: "Reviewed the local result against the frozen assumptions.",
      attributedAt: "2026-07-24T14:00:00.000Z"
    });
    const learning = createDeterministicLearningEvent(outcome);

    expect(outcome.frozenBundleHash).toBe(record.bundleHash);
    expect(outcome.simulationOutputHash).toBe(simulation.outputHash);
    expect(outcome.operatorNoteAuthorship).toBe("MANUAL_LOCAL");
    expect(outcome.outcomeHash).toMatch(/^sha256:/);
    expect(learning.sourceOutcomeHash).toBe(outcome.outcomeHash);
    expect(learning.category).toBe("PLAN_COMPLETED");
    expect(learning.autonomyChange).toBe("NONE");
  });

  it("rejects outcome attribution after simulation evidence is altered", () => {
    const simulation = runDeterministicSimulation({
      frozenRecord: record,
      policy,
      candles: []
    });

    expect(() =>
      recordSimulationOutcome({
        frozenRecord: record,
        simulation: { ...simulation, barsHeld: 99 },
        operatorNote: "This altered result must not be recorded.",
        attributedAt: "2026-07-24T14:00:00.000Z"
      })
    ).toThrow(/does not match/);
  });

  it("completes Epoch 1 only when two replay outputs and the attribution chain match", () => {
    const candles = [
      candle("replay-1", "2026-07-24T13:15:00.000Z", "2026-07-24T13:30:00.000Z", {
        open: 1.0835,
        high: 1.0886,
        low: 1.0834,
        close: 1.0884
      })
    ];
    const first = runDeterministicSimulation({ frozenRecord: record, policy, candles });
    const second = runDeterministicSimulation({ frozenRecord: record, policy, candles });
    const outcome = recordSimulationOutcome({
      frozenRecord: record,
      simulation: first,
      operatorNote: "Verified the full local decision trace.",
      attributedAt: "2026-07-24T14:00:00.000Z"
    });
    const learningEvent = createDeterministicLearningEvent(outcome);
    const completed = completeValidatedDecisionTrace({
      frozenRecord: record,
      firstSimulation: first,
      secondSimulation: second,
      outcome,
      learningEvent,
      checkedAt: "2026-07-24T14:05:00.000Z"
    });

    expect(completed.checkpoint.status).toBe("PASS");
    expect(completed.checkpoint.mismatchReasons).toEqual([]);
    expect(completed.trace.lifecycleStatus).toBe("COMPLETE");
    expect(completed.trace.completenessScore).toBe(100);
    expect(completed.trace.gates.every((gate) => gate.status === "PASS")).toBe(true);
  });

  it("refuses a complete trace when replay output differs", () => {
    const first = runDeterministicSimulation({ frozenRecord: record, policy, candles: [] });
    const second = runDeterministicSimulation({
      frozenRecord: record,
      policy,
      candles: [
        candle("replay-mismatch", "2026-07-24T13:15:00.000Z", "2026-07-24T13:30:00.000Z", {
          open: 1.0835,
          high: 1.0886,
          low: 1.0834,
          close: 1.0884
        })
      ]
    });
    const outcome = recordSimulationOutcome({
      frozenRecord: record,
      simulation: first,
      operatorNote: "Mismatch fixture.",
      attributedAt: "2026-07-24T14:00:00.000Z"
    });
    const learningEvent = createDeterministicLearningEvent(outcome);

    const incomplete = completeValidatedDecisionTrace({
      frozenRecord: record,
      firstSimulation: first,
      secondSimulation: second,
      outcome,
      learningEvent,
      checkedAt: "2026-07-24T14:05:00.000Z"
    });

    expect(incomplete.checkpoint.status).toBe("FAIL");
    expect(incomplete.trace.lifecycleStatus).toBe("INCOMPLETE");
    expect(incomplete.trace.gates.some((gate) => gate.status === "FAIL")).toBe(true);
  });

  it("fails the checkpoint when aligned source objects retain stale content hashes", () => {
    const first = runDeterministicSimulation({ frozenRecord: record, policy, candles: [] });
    const outcome = recordSimulationOutcome({
      frozenRecord: record,
      simulation: first,
      operatorNote: "Integrity-negative fixture.",
      attributedAt: "2026-07-24T14:00:00.000Z"
    });
    const learningEvent = createDeterministicLearningEvent(outcome);
    const tamperedSimulation = { ...first, barsHeld: 7 };
    const tamperedOutcome = {
      ...outcome,
      operatorNote: "Changed after the outcome hash was created."
    };
    const tamperedLearning = {
      ...learningEvent,
      summary: "Changed after the learning hash was created."
    };

    const incomplete = completeValidatedDecisionTrace({
      frozenRecord: record,
      firstSimulation: tamperedSimulation,
      secondSimulation: tamperedSimulation,
      outcome: tamperedOutcome,
      learningEvent: tamperedLearning,
      checkedAt: "2026-07-24T14:05:00.000Z"
    });

    expect(incomplete.checkpoint.status).toBe("FAIL");
    expect(incomplete.checkpoint.mismatchReasons).toEqual(
      expect.arrayContaining([
        "simulation output hash mismatch",
        "outcome or learning content hash mismatch"
      ])
    );
    expect(incomplete.trace.lifecycleStatus).toBe("INCOMPLETE");
  });
});
