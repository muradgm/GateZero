import { describe, expect, it } from "vitest";
import {
  FrozenDecisionBundleSchema,
  SimulationPolicySchema,
  ValidatedDecisionTraceSchema
} from "../src/index.js";

const temporalEvidence = {
  evidenceId: "evidence-trend-001",
  sourceId: "historical-adapter-001",
  observedAt: "2026-01-15T09:00:00.000Z",
  availableAt: "2026-01-15T09:00:01.000Z",
  validUntil: "2026-01-15T10:00:00.000Z",
  transformationVersion: "feature-engine-1.0.0",
  contentHash: "sha256:evidence-001"
} as const;

const bundle = {
  schemaVersion: 1,
  traceId: "trace-eurusd-001",
  setupReviewId: "setup-review-eurusd-001",
  instrument: "EURUSD",
  decisionTimestamp: "2026-01-15T09:30:00.000Z",
  operatorId: "operator-local-001",
  sourceId: "historical-adapter-001",
  rawDataHash: "sha256:raw",
  normalizedDataHash: "sha256:normalized",
  strategyId: "EURUSD_LN_NY_PULLBACK" as const,
  strategyVersion: "eurusd-overlap-pullback-1.0.0",
  strategyParametersHash: "sha256:strategy-parameters",
  featureEngineVersion: "feature-engine-1.0.0",
  riskEngineVersion: "risk-engine-1.0.0",
  simulationPolicyVersion: "simulation-policy-1.0.0",
  applicationCommit: "abc1234",
  configurationHash: "sha256:configuration",
  evidenceBundleHash: "sha256:evidence-bundle",
  canonicalAssessmentHash: "sha256:assessment",
  recommendation: "WATCH",
  blockers: ["event-risk restriction failed"],
  temporalEvidence: [temporalEvidence],
  createdAt: "2026-01-15T09:30:01.000Z"
} as const;

const gate = (name: "COMPLETENESS" | "VALIDITY" | "REPRODUCIBILITY" | "WORKFLOW") => ({
  gate: name,
  status: "PASS" as const,
  reasons: ["Gate requirements passed."],
  checkedAt: "2026-01-15T12:00:00.000Z"
});

describe("Validated decision trace contracts", () => {
  it("accepts a complete validated trace with all four release gates", () => {
    const result = ValidatedDecisionTraceSchema.parse({
      schemaVersion: 1,
      traceId: bundle.traceId,
      lifecycleStatus: "COMPLETE",
      completenessScore: 100,
      requirements: [
        {
          requirementId: "market-data-provenance",
          label: "Market-data provenance",
          status: "COMPLETE",
          weight: 10,
          evidenceIds: [temporalEvidence.evidenceId]
        }
      ],
      validityChecks: [
        {
          checkId: "no-look-ahead",
          area: "timestamp_integrity",
          status: "PASS",
          ruleVersion: "1.0.0",
          message: "All evidence was available at decision time.",
          evidenceIds: [temporalEvidence.evidenceId],
          checkedAt: "2026-01-15T12:00:00.000Z"
        }
      ],
      gates: [gate("COMPLETENESS"), gate("VALIDITY"), gate("REPRODUCIBILITY"), gate("WORKFLOW")],
      frozenDecisionBundle: bundle,
      outcomeId: "outcome-001",
      learningEventId: "learning-001"
    });

    expect(result.lifecycleStatus).toBe("COMPLETE");
  });

  it("rejects evidence that was unavailable at decision time", () => {
    expect(() =>
      FrozenDecisionBundleSchema.parse({
        ...bundle,
        temporalEvidence: [
          {
            ...temporalEvidence,
            availableAt: "2026-01-15T09:31:00.000Z"
          }
        ]
      })
    ).toThrow(/unavailable at decision time/);
  });

  it("rejects paper simulation while unresolved blockers remain", () => {
    expect(() =>
      FrozenDecisionBundleSchema.parse({
        ...bundle,
        recommendation: "PAPER_SIMULATE"
      })
    ).toThrow(/unresolved blockers/);
  });

  it("rejects paper simulation without a hash-linked risk review", () => {
    expect(() =>
      FrozenDecisionBundleSchema.parse({
        ...bundle,
        recommendation: "PAPER_SIMULATE",
        blockers: []
      })
    ).toThrow(/hash-linked risk review/);
  });

  it("rejects complete lifecycle state without outcome and learning references", () => {
    expect(() =>
      ValidatedDecisionTraceSchema.parse({
        schemaVersion: 1,
        traceId: bundle.traceId,
        lifecycleStatus: "COMPLETE",
        completenessScore: 100,
        requirements: [
          {
            requirementId: "risk",
            label: "Risk calculation",
            status: "COMPLETE",
            weight: 12,
            evidenceIds: []
          }
        ],
        validityChecks: [
          {
            checkId: "risk-integrity",
            area: "risk_integrity",
            status: "PASS",
            ruleVersion: "1.0.0",
            message: "Risk calculation passed.",
            evidenceIds: [],
            checkedAt: "2026-01-15T12:00:00.000Z"
          }
        ],
        gates: [gate("COMPLETENESS"), gate("VALIDITY"), gate("REPRODUCIBILITY"), gate("WORKFLOW")],
        frozenDecisionBundle: bundle
      })
    ).toThrow(/outcome and learning event/);
  });
});

describe("Simulation policy contract", () => {
  const policy = {
    schemaVersion: 1,
    policyId: "eurusd-paper-policy",
    version: "1.0.0",
    instrument: "EURUSD",
    executionMode: "deterministic_paper_simulation",
    orderType: "LIMIT",
    triggerCondition: "Price touches the qualified retracement level after the decision timestamp.",
    fillAssumption: "TOUCH_WITH_SPREAD",
    spreadModel: { type: "FIXED_PIPS", valuePips: 0.8 },
    commissionModel: { type: "FIXED_ACCOUNT_CURRENCY", value: 4 },
    slippageModel: { type: "FIXED_PIPS", value: 0.2 },
    gapPolicy: "FILL_AT_FIRST_AVAILABLE_PRICE",
    stopExecutionPolicy: "TOUCH",
    targetExecutionPolicy: "TOUCH",
    sameCandleConflictPolicy: "LOWER_TIMEFRAME_REQUIRED",
    partialFillPolicy: "FULL_FILL_ONLY",
    sessionClosurePolicy: "EXPIRE_UNFILLED",
    maximumHoldingBars: 32,
    pricePrecision: 5,
    pipSize: 0.0001,
    createdAt: "2026-01-01T00:00:00.000Z"
  } as const;

  it("accepts an explicit deterministic EURUSD paper-simulation policy", () => {
    expect(SimulationPolicySchema.parse(policy).sameCandleConflictPolicy).toBe(
      "LOWER_TIMEFRAME_REQUIRED"
    );
  });

  it("rejects a fixed spread policy without a pip value", () => {
    expect(() =>
      SimulationPolicySchema.parse({
        ...policy,
        spreadModel: { type: "FIXED_PIPS" }
      })
    ).toThrow(/valuePips/);
  });
});
