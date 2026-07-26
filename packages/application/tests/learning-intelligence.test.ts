import { describe, expect, it } from "vitest";
import {
  FrozenDecisionRecordSchema,
  ValidatedSimulationOutcomeSchema,
  type LearningFailureMode,
  type LearningInvalidationCode,
  type LearningRegime,
  type OperatorProcessError,
  type ValidatedSimulationOutcome
} from "@traderframe/contracts";
import {
  buildLearningIntelligenceReport,
  createDeterministicLearningEvent,
  createLearningIntelligenceCase,
  createLearningIntelligenceCheckpoint,
  hashCanonicalValue
} from "../src/index.js";

function sourceChain(
  id: string,
  disposition: ValidatedSimulationOutcome["disposition"],
  strategyVersion = "eurusd-overlap-pullback-1.0.0"
) {
  const bundle = {
    schemaVersion: 1 as const,
    traceId: `trace-${id}`,
    setupReviewId: `setup-${id}`,
    instrument: "EURUSD" as const,
    decisionTimestamp: `2026-07-${String(10 + Number(id)).padStart(2, "0")}T13:00:00.000Z`,
    operatorId: "operator-local",
    sourceId: "historical-adapter",
    rawDataHash: `sha256:raw-${id}`,
    normalizedDataHash: `sha256:normalized-${id}`,
    strategyVersion,
    strategyParametersHash: `sha256:strategy-${id}`,
    featureEngineVersion: "feature-engine-1.0.0",
    riskEngineVersion: "risk-engine-1.0.0",
    simulationPolicyVersion: "simulation-policy-1.0.0",
    applicationCommit: "epoch4-local-proof",
    configurationHash: `sha256:configuration-${id}`,
    evidenceBundleHash: `sha256:evidence-${id}`,
    canonicalAssessmentHash: `sha256:assessment-${id}`,
    riskReviewId: `risk-${id}`,
    riskReviewHash: `sha256:risk-${id}`,
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
        evidenceId: `evidence-${id}`,
        sourceId: "historical-adapter",
        observedAt: `2026-07-${String(10 + Number(id)).padStart(2, "0")}T12:44:59.000Z`,
        availableAt: `2026-07-${String(10 + Number(id)).padStart(2, "0")}T12:45:00.000Z`,
        transformationVersion: "feature-engine-1.0.0",
        contentHash: `sha256:temporal-${id}`
      }
    ],
    createdAt: `2026-07-${String(10 + Number(id)).padStart(2, "0")}T13:06:00.000Z`
  };
  const frozenRecord = FrozenDecisionRecordSchema.parse({
    schemaVersion: 1,
    bundle,
    bundleHash: hashCanonicalValue(bundle),
    frozenAt: `2026-07-${String(10 + Number(id)).padStart(2, "0")}T13:10:00.000Z`
  });
  const outcomePayload = {
    schemaVersion: 1 as const,
    outcomeId: `outcome-${id}`,
    traceId: bundle.traceId,
    frozenBundleHash: frozenRecord.bundleHash,
    simulationId: `simulation-${id}`,
    simulationOutputHash: `sha256:simulation-${id}`,
    disposition,
    operatorNote: `Manual local attribution for fixture ${id}.`,
    operatorNoteAuthorship: "MANUAL_LOCAL" as const,
    attributedAt: `2026-07-${String(10 + Number(id)).padStart(2, "0")}T14:00:00.000Z`,
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
    caseRecordId: `learning-case-${input.id}`,
    ...source,
    regime: input.regime,
    invalidationCode: input.invalidationCode,
    evidenceCombination: input.evidenceCombination,
    failureModes: input.failureModes ?? [],
    operatorProcessErrors: input.operatorProcessErrors ?? [],
    observedAt: source.outcome.attributedAt,
    limitations: [
      "Local immutable fixture.",
      "Manual process attribution requires operator review."
    ]
  });
}

function fixtureCases() {
  return [
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
}

function report(cases = fixtureCases()) {
  return buildLearningIntelligenceReport({
    reportId: "epoch4-learning-report",
    cases,
    generatedAt: "2026-07-24T18:00:00.000Z",
    limitations: [
      "Six local immutable fixtures only.",
      "Observed recurrence is descriptive and does not predict a future outcome."
    ]
  });
}

describe("learning intelligence", () => {
  it("creates a normalized immutable case linked to frozen outcome and learning hashes", () => {
    const record = fixtureCases()[1]!;

    expect(record.caseHash).toMatch(/^sha256:/);
    expect(record.evidenceCombination).toEqual(["liquidity", "risk", "structure", "trend"]);
    expect(record.attributionMode).toBe("MANUAL_LOCAL");
    expect(record.operatorConfirmed).toBe(true);
    expect(record.predictiveClaim).toBe(false);
    expect(record.performanceClaim).toBe(false);
    expect(record.executionPath).toBe(false);
  });

  it("rejects tampered outcome and learning source chains", () => {
    const source = sourceChain("1", "TARGET");

    expect(() =>
      createLearningIntelligenceCase({
        caseRecordId: "tampered-outcome",
        ...source,
        outcome: { ...source.outcome, disposition: "STOP" },
        regime: "TREND_PULLBACK",
        invalidationCode: "NONE",
        evidenceCombination: ["trend"],
        failureModes: [],
        operatorProcessErrors: [],
        observedAt: source.outcome.attributedAt,
        limitations: ["Local fixture."]
      })
    ).toThrow(/outcome chain mismatch/);
  });

  it("extracts recurring invalidations, evidence failures, and manual process patterns", () => {
    const result = report();

    expect(result.recurringInvalidations).toEqual([
      {
        invalidationCode: "STRUCTURE_BREAK",
        caseRecordIds: ["learning-case-2", "learning-case-3"],
        occurrenceCount: 2
      }
    ]);
    expect(result.evidenceFailurePatterns.map((pattern) => pattern.failureMode)).toEqual([
      "EVIDENCE",
      "TIMING"
    ]);
    expect(result.operatorProcessPatterns.map((pattern) => pattern.processError)).toEqual([
      "EARLY_ENTRY",
      "MISSED_CONTRADICTION"
    ]);
  });

  it("builds exact comparable clusters and inspects declared drift without scoring", () => {
    const result = report();

    expect(result.comparableCaseClusters).toHaveLength(2);
    expect(
      result.comparableCaseClusters.every((cluster) => cluster.caseRecordIds.length >= 2)
    ).toBe(true);
    expect(result.driftInspection).toMatchObject({
      strategyVersionChanged: true,
      regimeChangeCount: 2,
      status: "REVIEW_REQUIRED"
    });
    expect(result).not.toHaveProperty("score");
    expect(result).not.toHaveProperty("winRate");
    expect(result).not.toHaveProperty("recommendation");
    expect(result.predictiveClaim).toBe(false);
    expect(result.performanceClaim).toBe(false);
    expect(result.updatesRules).toBe(false);
    expect(result.updatesRiskLimits).toBe(false);
  });

  it("is deterministic regardless of source-case input order", () => {
    const cases = fixtureCases();

    expect(report([...cases].reverse())).toEqual(report(cases));
  });

  it("fails closed for too few, duplicate, or hash-tampered learning cases", () => {
    const cases = fixtureCases();
    expect(() => report(cases.slice(0, 2))).toThrow(/at least three/);
    expect(() => report([cases[0]!, cases[0]!, cases[1]!])).toThrow(/duplicate/);
    expect(() => report([{ ...cases[0]!, regime: "RANGE" }, ...cases.slice(1)])).toThrow(
      /hash mismatch/
    );
  });

  it("passes the epoch checkpoint only when every pattern family is deterministic", () => {
    const cases = fixtureCases();
    const first = report(cases);
    const second = report([...cases].reverse());
    const checkpoint = createLearningIntelligenceCheckpoint({
      checkpointId: "epoch4-learning-checkpoint",
      cases,
      firstReport: first,
      secondReport: second,
      checkedAt: "2026-07-24T18:05:00.000Z"
    });

    expect(checkpoint).toMatchObject({
      status: "PASS",
      deterministic: true,
      sourceChainsValid: true,
      requiredPatternsExercised: true,
      recommendationFinal: false,
      predictiveClaim: false,
      performanceClaim: false,
      executionPath: false
    });
  });

  it("fails the epoch checkpoint when identical reports retain stale hashes", () => {
    const cases = fixtureCases();
    const original = report(cases);
    const tampered = {
      ...original,
      limitations: [...original.limitations, "Added after report hashing."]
    };
    const checkpoint = createLearningIntelligenceCheckpoint({
      checkpointId: "epoch4-tampered-checkpoint",
      cases,
      firstReport: tampered,
      secondReport: tampered,
      checkedAt: "2026-07-24T18:05:00.000Z"
    });

    expect(checkpoint.status).toBe("FAIL");
    expect(checkpoint.sourceChainsValid).toBe(false);
    expect(checkpoint.deterministic).toBe(false);
    expect(checkpoint.reasons).toContain(
      "One or more learning source or report hashes are invalid."
    );
  });
});
