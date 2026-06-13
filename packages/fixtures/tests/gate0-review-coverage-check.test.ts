import { describe, expect, it } from "vitest";
import {
  checkGate0ReviewCoverage,
  renderGate0ReviewCoverageResult
} from "../../../scripts/check-gate0-review-coverage.js";

describe("Gate 0 review coverage check", () => {
  it("passes when every assignment has all required review records", () => {
    const result = checkGate0ReviewCoverage({
      assignmentIds: ["TRD-001", "TRD-002"],
      qaReviewIds: ["TRD-001", "TRD-002"],
      riskReviewIds: ["TRD-001", "TRD-002"],
      acceptanceIds: ["TRD-001", "TRD-002"]
    });

    expect(result).toEqual({
      ok: true,
      findings: [],
      assignmentCount: 2,
      qaReviewCount: 2,
      riskReviewCount: 2,
      acceptanceCount: 2
    });
    expect(renderGate0ReviewCoverageResult(result)).toContain(
      "Gate 0 review coverage check passed."
    );
  });

  it("fails when a review record is missing", () => {
    const result = checkGate0ReviewCoverage({
      assignmentIds: ["TRD-001", "TRD-002"],
      qaReviewIds: ["TRD-001", "TRD-002"],
      riskReviewIds: ["TRD-001"],
      acceptanceIds: ["TRD-001", "TRD-002"]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Missing RISK review: TRD-002");
  });

  it("fails when a review record has no assignment", () => {
    const result = checkGate0ReviewCoverage({
      assignmentIds: ["TRD-001"],
      qaReviewIds: ["TRD-001", "TRD-002"],
      riskReviewIds: ["TRD-001"],
      acceptanceIds: ["TRD-001"]
    });

    expect(result.ok).toBe(false);
    expect(result.findings).toContain("Unexpected QA_SECURITY review: TRD-002");
  });
});
