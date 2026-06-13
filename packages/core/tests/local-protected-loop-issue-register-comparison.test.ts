import { describe, expect, it } from "vitest";
import {
  compareLocalProtectedLoopIssueRegisters,
  type LocalProtectedLoopIssue,
  type LocalProtectedLoopIssueRegister
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";
const baselineThresholdGeneratedAt = "2026-01-01T12:00:00.000Z";
const candidateThresholdGeneratedAt = "2026-01-02T12:00:00.000Z";

function createIssue(options: {
  readonly thresholdGeneratedAt: string;
  readonly checkId: LocalProtectedLoopIssue["check_id"];
  readonly status: LocalProtectedLoopIssue["status"];
  readonly observedCount: number;
  readonly thresholdCount: number;
  readonly comparison?: LocalProtectedLoopIssue["comparison"];
}): LocalProtectedLoopIssue {
  return {
    issue_id: `threshold-result:${options.thresholdGeneratedAt}:${options.checkId}`,
    check_id: options.checkId,
    status: options.status,
    comparison: options.comparison ?? "maximum",
    observed_count: options.observedCount,
    threshold_count: options.thresholdCount,
    threshold_result_generated_at: options.thresholdGeneratedAt
  };
}

function createRegister(options: {
  readonly generatedAt: string;
  readonly thresholdGeneratedAt: string;
  readonly issues: readonly LocalProtectedLoopIssue[];
}): LocalProtectedLoopIssueRegister {
  const needsReviewCount = countIssues(options.issues, "needs_review");
  const blockedCount = countIssues(options.issues, "blocked");

  return {
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    register_status: getStatus(blockedCount, needsReviewCount),
    generated_at: options.generatedAt,
    threshold_result_generated_at: options.thresholdGeneratedAt,
    issue_count: options.issues.length,
    needs_review_count: needsReviewCount,
    blocked_count: blockedCount,
    issues: [...options.issues]
  };
}

function countIssues(
  issues: readonly LocalProtectedLoopIssue[],
  status: LocalProtectedLoopIssue["status"]
): number {
  return issues.filter((issue) => issue.status === status).length;
}

function getStatus(
  blockedCount: number,
  needsReviewCount: number
): LocalProtectedLoopIssueRegister["register_status"] {
  if (blockedCount > 0) {
    return "blocked";
  }

  if (needsReviewCount > 0) {
    return "needs_review";
  }

  return "clear";
}

describe("local protected-loop issue register comparison", () => {
  it("reports unchanged issue registers by check id", () => {
    const baseline = createRegister({
      generatedAt: baselineGeneratedAt,
      thresholdGeneratedAt: baselineThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: baselineThresholdGeneratedAt,
          checkId: "redaction_finding_maximum",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 10
        })
      ]
    });
    const candidate = createRegister({
      generatedAt: candidateGeneratedAt,
      thresholdGeneratedAt: candidateThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: candidateThresholdGeneratedAt,
          checkId: "redaction_finding_maximum",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 10
        })
      ]
    });

    const comparison = compareLocalProtectedLoopIssueRegisters(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      baseline_register_status: "needs_review",
      candidate_register_status: "needs_review",
      status_changed: false,
      retained_issue_count: 1,
      changed_issue_count: 0,
      added_issue_count: 0,
      removed_issue_count: 0
    });
    expect(comparison.issue_changes[0]).toMatchObject({
      check_id: "redaction_finding_maximum",
      baseline_present: true,
      candidate_present: true,
      baseline_issue_id: "threshold-result:2026-01-01T12:00:00.000Z:redaction_finding_maximum",
      candidate_issue_id: "threshold-result:2026-01-02T12:00:00.000Z:redaction_finding_maximum"
    });
  });

  it("reports status and count changes for retained issues", () => {
    const baseline = createRegister({
      generatedAt: baselineGeneratedAt,
      thresholdGeneratedAt: baselineThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: baselineThresholdGeneratedAt,
          checkId: "diagnostic_blocked_maximum",
          status: "needs_review",
          observedCount: 1,
          thresholdCount: 2
        })
      ]
    });
    const candidate = createRegister({
      generatedAt: candidateGeneratedAt,
      thresholdGeneratedAt: candidateThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: candidateThresholdGeneratedAt,
          checkId: "diagnostic_blocked_maximum",
          status: "blocked",
          observedCount: 3,
          thresholdCount: 0
        })
      ]
    });

    const comparison = compareLocalProtectedLoopIssueRegisters(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.status_changed).toBe(true);
    expect(comparison.needs_review_count.delta).toBe(-1);
    expect(comparison.blocked_count.delta).toBe(1);
    expect(comparison.changed_issue_count).toBe(1);
    expect(comparison.issue_changes).toEqual([
      expect.objectContaining({
        check_id: "diagnostic_blocked_maximum",
        status_changed: true,
        observed_count_delta: 2,
        threshold_count_delta: -2
      })
    ]);
  });

  it("reports added, removed, and retained issues", () => {
    const baseline = createRegister({
      generatedAt: baselineGeneratedAt,
      thresholdGeneratedAt: baselineThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: baselineThresholdGeneratedAt,
          checkId: "review_record_minimum",
          status: "needs_review",
          observedCount: 1,
          thresholdCount: 2,
          comparison: "minimum"
        }),
        createIssue({
          thresholdGeneratedAt: baselineThresholdGeneratedAt,
          checkId: "redaction_finding_maximum",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 10
        })
      ]
    });
    const candidate = createRegister({
      generatedAt: candidateGeneratedAt,
      thresholdGeneratedAt: candidateThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: candidateThresholdGeneratedAt,
          checkId: "redaction_finding_maximum",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 10
        }),
        createIssue({
          thresholdGeneratedAt: candidateThresholdGeneratedAt,
          checkId: "trace_artifact_coverage",
          status: "blocked",
          observedCount: 7,
          thresholdCount: 8,
          comparison: "minimum"
        })
      ]
    });

    const comparison = compareLocalProtectedLoopIssueRegisters(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.added_issue_count).toBe(1);
    expect(comparison.removed_issue_count).toBe(1);
    expect(comparison.retained_issue_count).toBe(1);
    expect(comparison.changed_issue_count).toBe(0);
    expect(comparison.issue_changes.map((change) => change.check_id)).toEqual([
      "redaction_finding_maximum",
      "review_record_minimum",
      "trace_artifact_coverage"
    ]);
  });

  it("reports clear register transitions descriptively", () => {
    const baseline = createRegister({
      generatedAt: baselineGeneratedAt,
      thresholdGeneratedAt: baselineThresholdGeneratedAt,
      issues: [
        createIssue({
          thresholdGeneratedAt: baselineThresholdGeneratedAt,
          checkId: "redaction_finding_maximum",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 10
        })
      ]
    });
    const candidate = createRegister({
      generatedAt: candidateGeneratedAt,
      thresholdGeneratedAt: candidateThresholdGeneratedAt,
      issues: []
    });

    const comparison = compareLocalProtectedLoopIssueRegisters(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.status_changed).toBe(true);
    expect(comparison.baseline_register_status).toBe("needs_review");
    expect(comparison.candidate_register_status).toBe("clear");
    expect(comparison.issue_count.delta).toBe(-1);
    expect(comparison.removed_issue_count).toBe(1);
  });

  it("rejects invalid issue registers before comparison", () => {
    const validRegister = createRegister({
      generatedAt: baselineGeneratedAt,
      thresholdGeneratedAt: baselineThresholdGeneratedAt,
      issues: []
    });
    const invalidRegister = {
      ...validRegister,
      issue_count: 99
    };

    expect(() =>
      compareLocalProtectedLoopIssueRegisters(
        invalidRegister as LocalProtectedLoopIssueRegister,
        validRegister,
        comparisonGeneratedAt
      )
    ).toThrow("issue_count must match issues length");
  });
});
