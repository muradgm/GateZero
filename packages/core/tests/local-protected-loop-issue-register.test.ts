import { describe, expect, it } from "vitest";
import {
  createLocalProtectedLoopIssueRegister,
  type LocalProtectedLoopEvidenceThresholdCheck,
  type LocalProtectedLoopEvidenceThresholdResult
} from "../src/index.js";

const thresholdGeneratedAt = "2026-01-01T00:00:00.000Z";
const registerGeneratedAt = "2026-01-02T00:00:00.000Z";
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

function createResult(
  checks: readonly LocalProtectedLoopEvidenceThresholdCheck[]
): LocalProtectedLoopEvidenceThresholdResult {
  const metCount = countChecks(checks, "met");
  const needsReviewCount = countChecks(checks, "needs_review");
  const blockedCount = countChecks(checks, "blocked");

  return {
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    threshold_status: getStatus(blockedCount, needsReviewCount),
    generated_at: thresholdGeneratedAt,
    snapshot_generated_at: snapshotGeneratedAt,
    review_record_count: 1,
    check_count: checks.length,
    met_count: metCount,
    needs_review_count: needsReviewCount,
    blocked_count: blockedCount,
    profile: defaultProfile,
    checks: [...checks]
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

describe("local protected-loop issue register", () => {
  it("creates an empty register when every threshold check is met", () => {
    const register = createLocalProtectedLoopIssueRegister(
      createResult([
        createCheck({
          checkId: "review_record_minimum",
          comparison: "minimum",
          unmetStatus: "needs_review",
          status: "met",
          observedCount: 1,
          thresholdCount: 1
        }),
        createCheck({
          checkId: "diagnostic_blocked_maximum",
          status: "met",
          observedCount: 0,
          thresholdCount: 0
        })
      ]),
      registerGeneratedAt
    );

    expect(register).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      register_status: "clear",
      generated_at: registerGeneratedAt,
      threshold_result_generated_at: thresholdGeneratedAt,
      issue_count: 0,
      needs_review_count: 0,
      blocked_count: 0,
      issues: []
    });
  });

  it("creates needs-review issues from unmet descriptive checks", () => {
    const register = createLocalProtectedLoopIssueRegister(
      createResult([
        createCheck({
          checkId: "review_record_minimum",
          comparison: "minimum",
          unmetStatus: "needs_review",
          status: "needs_review",
          observedCount: 1,
          thresholdCount: 2
        }),
        createCheck({
          checkId: "redaction_finding_maximum",
          unmetStatus: "needs_review",
          status: "needs_review",
          observedCount: 12,
          thresholdCount: 10
        })
      ]),
      registerGeneratedAt
    );

    expect(register.register_status).toBe("needs_review");
    expect(register.issue_count).toBe(2);
    expect(register.needs_review_count).toBe(2);
    expect(register.blocked_count).toBe(0);
    expect(register.issues.map((issue) => issue.check_id)).toEqual([
      "review_record_minimum",
      "redaction_finding_maximum"
    ]);
  });

  it("creates blocked issues while preserving source check order", () => {
    const register = createLocalProtectedLoopIssueRegister(
      createResult([
        createCheck({
          checkId: "trace_artifact_coverage",
          comparison: "minimum",
          status: "blocked",
          observedCount: 7,
          thresholdCount: 8
        }),
        createCheck({
          checkId: "checklist_blocked_maximum",
          status: "blocked",
          observedCount: 1,
          thresholdCount: 0
        })
      ]),
      registerGeneratedAt
    );

    expect(register.register_status).toBe("blocked");
    expect(register.issue_count).toBe(2);
    expect(register.blocked_count).toBe(2);
    expect(register.issues.map((issue) => issue.check_id)).toEqual([
      "trace_artifact_coverage",
      "checklist_blocked_maximum"
    ]);
    expect(register.issues[0]).toMatchObject({
      status: "blocked",
      comparison: "minimum",
      observed_count: 7,
      threshold_count: 8
    });
  });

  it("creates deterministic local issue IDs", () => {
    const register = createLocalProtectedLoopIssueRegister(
      createResult([
        createCheck({
          checkId: "diagnostic_blocked_maximum",
          status: "blocked",
          observedCount: 1,
          thresholdCount: 0
        })
      ]),
      registerGeneratedAt
    );

    expect(register.issues[0]?.issue_id).toBe(
      "threshold-result:2026-01-01T00:00:00.000Z:diagnostic_blocked_maximum"
    );
  });

  it("rejects invalid threshold results before register generation", () => {
    const invalidResult = {
      ...createResult([
        createCheck({
          checkId: "diagnostic_blocked_maximum",
          status: "blocked",
          observedCount: 1,
          thresholdCount: 0
        })
      ]),
      check_count: 99
    };

    expect(() =>
      createLocalProtectedLoopIssueRegister(
        invalidResult as LocalProtectedLoopEvidenceThresholdResult,
        registerGeneratedAt
      )
    ).toThrow("check_count must match checks length");
  });
});
