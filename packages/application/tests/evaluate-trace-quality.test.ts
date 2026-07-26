import { describe, expect, it } from "vitest";
import { evaluateTraceQuality } from "../src/evaluate-trace-quality.js";

const checkedAt = "2026-07-25T18:30:00.000Z";

const completeRequirements = [
  requirement("market_data_provenance", "Market-data provenance", 10),
  requirement("invalidation", "Invalidation", 10),
  requirement("risk_calculation", "Risk calculation", 12),
  requirement("contradiction_review", "Contradiction review", 10),
  requirement("operator_rationale", "Operator rationale", 8),
  requirement("outcome", "Outcome", 10),
  requirement("learning_event", "Learning event", 12)
];

const passingChecks = [
  validity("data", "data_integrity", "PASS", "Validated candle sequence."),
  validity("time", "timestamp_integrity", "PASS", "No future data consumed."),
  validity("risk", "risk_integrity", "PASS", "Instrument-aware risk passed."),
  validity("simulation", "simulation_integrity", "PASS", "Simulation policy passed.")
];

describe("evaluateTraceQuality", () => {
  it("passes all release gates for a complete and valid trace", () => {
    const result = evaluateTraceQuality({
      requirements: completeRequirements,
      validityChecks: passingChecks,
      reproducibilityStatus: "PASS",
      workflowStatus: "PASS",
      checkedAt
    });

    expect(result.completenessScore).toBe(100);
    expect(result.lifecycleStatus).toBe("COMPLETE");
    expect(result.gates.every((gate) => gate.status === "PASS")).toBe(true);
    expect(result.appliedCaps).toEqual([]);
  });

  it("applies the strictest hard cap for missing critical requirements", () => {
    const result = evaluateTraceQuality({
      requirements: completeRequirements.map((item) =>
        item.requirementId === "market_data_provenance" || item.requirementId === "risk_calculation"
          ? { ...item, status: "MISSING" as const, failureReason: "Required record is absent." }
          : item
      ),
      validityChecks: passingChecks,
      reproducibilityStatus: "NOT_RUN",
      workflowStatus: "NOT_RUN",
      checkedAt
    });

    expect(result.completenessScore).toBe(40);
    expect(result.appliedCaps.map((cap) => cap.maximumScore)).toEqual([40, 55]);
    expect(result.gates.find((gate) => gate.gate === "COMPLETENESS")?.status).toBe("FAIL");
    expect(result.lifecycleStatus).toBe("OPEN");
  });

  it("reports failed validity areas independently from completeness", () => {
    const result = evaluateTraceQuality({
      requirements: completeRequirements,
      validityChecks: [
        ...passingChecks,
        validity("lookahead", "evidence_integrity", "FAIL", "Future-confirmed swing was consumed.")
      ],
      reproducibilityStatus: "PASS",
      workflowStatus: "PASS",
      checkedAt
    });

    expect(result.completenessScore).toBe(100);
    expect(result.gates.find((gate) => gate.gate === "VALIDITY")?.status).toBe("FAIL");
    expect(result.failedValidityAreas).toEqual(["evidence_integrity"]);
    expect(result.lifecycleStatus).toBe("INCOMPLETE");
  });

  it("treats partial requirements as half-complete before caps", () => {
    const result = evaluateTraceQuality({
      requirements: [
        requirement("optional_context", "Context", 10),
        {
          ...requirement("supporting_evidence", "Supporting evidence", 10),
          status: "PARTIAL",
          failureReason: "One required evidence source is missing."
        }
      ],
      validityChecks: passingChecks,
      reproducibilityStatus: "BLOCKED",
      reproducibilityReasons: ["Frozen input bundle is not available."],
      workflowStatus: "NOT_RUN",
      checkedAt
    });

    expect(result.completenessScore).toBe(75);
    expect(result.lifecycleStatus).toBe("OPEN");
  });
});

function requirement(requirementId: string, label: string, weight: number) {
  return {
    requirementId,
    label,
    status: "COMPLETE" as const,
    weight,
    evidenceIds: [`evidence-${requirementId}`]
  };
}

function validity(
  checkId: string,
  area:
    | "data_integrity"
    | "timestamp_integrity"
    | "evidence_integrity"
    | "risk_integrity"
    | "simulation_integrity",
  status: "PASS" | "FAIL" | "BLOCKED" | "NOT_RUN",
  message: string
) {
  return {
    checkId,
    area,
    status,
    ruleVersion: "1.0.0",
    message,
    evidenceIds: [],
    checkedAt
  };
}
