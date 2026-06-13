import { describe, expect, it } from "vitest";
import {
  compareLocalProtectedLoopEvidenceThresholdResults,
  type LocalProtectedLoopEvidenceThresholdCheck,
  type LocalProtectedLoopEvidenceThresholdResult
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";
const snapshotGeneratedAt = "2026-01-01T12:00:00.000Z";

const defaultProfile = {
  financial_gate: "G0_RESEARCH",
  scope: "research_only",
  minimum_review_record_count: 1,
  required_artifact_count_per_review: 8,
  maximum_incomplete_artifact_inventory_count: 0,
  maximum_checklist_blocked_count: 0,
  maximum_diagnostic_blocked_count: 0,
  maximum_outside_local_review_redaction_finding_count: 10
} as const;

function createCheck(options: {
  readonly checkId: LocalProtectedLoopEvidenceThresholdCheck["check_id"];
  readonly status: LocalProtectedLoopEvidenceThresholdCheck["status"];
  readonly observedCount: number;
  readonly thresholdCount: number;
  readonly comparison?: LocalProtectedLoopEvidenceThresholdCheck["comparison"];
  readonly unmetStatus?: "needs_review" | "blocked";
}): LocalProtectedLoopEvidenceThresholdCheck {
  const comparison = options.comparison ?? "maximum";
  const unmetStatus = options.unmetStatus ?? "blocked";

  return {
    check_id: options.checkId,
    comparison,
    unmet_status: unmetStatus,
    status: options.status,
    passed: options.status === "met",
    observed_count: options.observedCount,
    threshold_count: options.thresholdCount
  };
}

function createResult(options: {
  readonly generatedAt: string;
  readonly reviewRecordCount: number;
  readonly checks: readonly LocalProtectedLoopEvidenceThresholdCheck[];
}): LocalProtectedLoopEvidenceThresholdResult {
  const metCount = countChecks(options.checks, "met");
  const needsReviewCount = countChecks(options.checks, "needs_review");
  const blockedCount = countChecks(options.checks, "blocked");

  return {
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    threshold_status: getStatus(blockedCount, needsReviewCount),
    generated_at: options.generatedAt,
    snapshot_generated_at: snapshotGeneratedAt,
    review_record_count: options.reviewRecordCount,
    check_count: options.checks.length,
    met_count: metCount,
    needs_review_count: needsReviewCount,
    blocked_count: blockedCount,
    profile: defaultProfile,
    checks: [...options.checks]
  };
}

function countChecks(
  checks: readonly LocalProtectedLoopEvidenceThresholdCheck[],
  status: LocalProtectedLoopEvidenceThresholdCheck["status"]
): number {
  return checks.filter((check) => check.status === status).length;
}

function getStatus(
  blockedCount: number,
  needsReviewCount: number
): LocalProtectedLoopEvidenceThresholdResult["threshold_status"] {
  if (blockedCount > 0) {
    return "blocked";
  }

  if (needsReviewCount > 0) {
    return "needs_review";
  }

  return "met";
}

describe("local protected-loop evidence threshold comparison", () => {
  it("reports unchanged threshold results deterministically", () => {
    const checks = [
      createCheck({
        checkId: "review_record_minimum",
        comparison: "minimum",
        unmetStatus: "needs_review",
        status: "met",
        observedCount: 2,
        thresholdCount: 1
      }),
      createCheck({
        checkId: "diagnostic_blocked_maximum",
        status: "met",
        observedCount: 0,
        thresholdCount: 0
      })
    ];
    const baseline = createResult({
      generatedAt: baselineGeneratedAt,
      reviewRecordCount: 2,
      checks
    });
    const candidate = createResult({
      generatedAt: candidateGeneratedAt,
      reviewRecordCount: 2,
      checks
    });

    const comparison = compareLocalProtectedLoopEvidenceThresholdResults(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      generated_at: comparisonGeneratedAt,
      baseline_threshold_status: "met",
      candidate_threshold_status: "met",
      status_changed: false,
      review_record_count: {
        baseline_count: 2,
        candidate_count: 2,
        delta: 0
      },
      check_count: {
        delta: 0
      },
      changed_check_count: 0,
      added_check_count: 0,
      removed_check_count: 0
    });
  });

  it("reports threshold status changes and count deltas", () => {
    const baseline = createResult({
      generatedAt: baselineGeneratedAt,
      reviewRecordCount: 2,
      checks: [
        createCheck({
          checkId: "review_record_minimum",
          comparison: "minimum",
          unmetStatus: "needs_review",
          status: "met",
          observedCount: 2,
          thresholdCount: 1
        }),
        createCheck({
          checkId: "diagnostic_blocked_maximum",
          status: "met",
          observedCount: 0,
          thresholdCount: 0
        })
      ]
    });
    const candidate = createResult({
      generatedAt: candidateGeneratedAt,
      reviewRecordCount: 1,
      checks: [
        createCheck({
          checkId: "review_record_minimum",
          comparison: "minimum",
          unmetStatus: "needs_review",
          status: "needs_review",
          observedCount: 1,
          thresholdCount: 2
        }),
        createCheck({
          checkId: "diagnostic_blocked_maximum",
          status: "blocked",
          observedCount: 1,
          thresholdCount: 0
        })
      ]
    });

    const comparison = compareLocalProtectedLoopEvidenceThresholdResults(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.status_changed).toBe(true);
    expect(comparison.baseline_threshold_status).toBe("met");
    expect(comparison.candidate_threshold_status).toBe("blocked");
    expect(comparison.review_record_count.delta).toBe(-1);
    expect(comparison.met_count.delta).toBe(-2);
    expect(comparison.needs_review_count.delta).toBe(1);
    expect(comparison.blocked_count.delta).toBe(1);
    expect(comparison.changed_check_count).toBe(2);
  });

  it("reports per-check observed and threshold deltas", () => {
    const baseline = createResult({
      generatedAt: baselineGeneratedAt,
      reviewRecordCount: 1,
      checks: [
        createCheck({
          checkId: "redaction_finding_maximum",
          unmetStatus: "needs_review",
          status: "met",
          observedCount: 5,
          thresholdCount: 10
        })
      ]
    });
    const candidate = createResult({
      generatedAt: candidateGeneratedAt,
      reviewRecordCount: 1,
      checks: [
        createCheck({
          checkId: "redaction_finding_maximum",
          unmetStatus: "needs_review",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 8
        })
      ]
    });

    const comparison = compareLocalProtectedLoopEvidenceThresholdResults(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.check_changes).toEqual([
      expect.objectContaining({
        check_id: "redaction_finding_maximum",
        baseline_present: true,
        candidate_present: true,
        baseline_status: "met",
        candidate_status: "needs_review",
        status_changed: true,
        passed_changed: true,
        observed_count_delta: 7,
        threshold_count_delta: -2
      })
    ]);
  });

  it("reports added and removed checks without interpreting them", () => {
    const baseline = createResult({
      generatedAt: baselineGeneratedAt,
      reviewRecordCount: 1,
      checks: [
        createCheck({
          checkId: "review_record_minimum",
          comparison: "minimum",
          unmetStatus: "needs_review",
          status: "met",
          observedCount: 1,
          thresholdCount: 1
        })
      ]
    });
    const candidate = createResult({
      generatedAt: candidateGeneratedAt,
      reviewRecordCount: 1,
      checks: [
        createCheck({
          checkId: "trace_artifact_coverage",
          comparison: "minimum",
          status: "met",
          observedCount: 8,
          thresholdCount: 8
        })
      ]
    });

    const comparison = compareLocalProtectedLoopEvidenceThresholdResults(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.added_check_count).toBe(1);
    expect(comparison.removed_check_count).toBe(1);
    expect(comparison.check_changes).toEqual([
      expect.objectContaining({
        check_id: "review_record_minimum",
        baseline_present: true,
        candidate_present: false
      }),
      expect.objectContaining({
        check_id: "trace_artifact_coverage",
        baseline_present: false,
        candidate_present: true
      })
    ]);
  });

  it("rejects invalid threshold results before comparison", () => {
    const validResult = createResult({
      generatedAt: baselineGeneratedAt,
      reviewRecordCount: 1,
      checks: [
        createCheck({
          checkId: "review_record_minimum",
          comparison: "minimum",
          unmetStatus: "needs_review",
          status: "met",
          observedCount: 1,
          thresholdCount: 1
        })
      ]
    });
    const invalidResult = {
      ...validResult,
      check_count: 99
    };

    expect(() =>
      compareLocalProtectedLoopEvidenceThresholdResults(
        invalidResult as LocalProtectedLoopEvidenceThresholdResult,
        validResult,
        comparisonGeneratedAt
      )
    ).toThrow("check_count must match checks length");
  });
});
