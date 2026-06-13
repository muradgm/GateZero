import { describe, expect, it } from "vitest";
import {
  compareLocalGate0ReviewStateAssemblySummaries,
  type LocalGate0ReviewStateAssemblySummary
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";

function createSummary(options: {
  readonly generatedAt: string;
  readonly status: LocalGate0ReviewStateAssemblySummary["summary_status"];
  readonly reviewRecordCount: number;
  readonly thresholdCounts: LocalGate0ReviewStateAssemblySummary["threshold_counts"];
  readonly issueCounts: LocalGate0ReviewStateAssemblySummary["issue_counts"];
  readonly comparisonCounts?: LocalGate0ReviewStateAssemblySummary["comparison_counts"];
}): LocalGate0ReviewStateAssemblySummary {
  return {
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    summary_status: options.status,
    generated_at: options.generatedAt,
    assembly_generated_at: options.generatedAt,
    snapshot_generated_at: options.generatedAt,
    threshold_result_generated_at: options.generatedAt,
    issue_register_generated_at: options.generatedAt,
    has_comparisons: options.comparisonCounts !== undefined,
    review_counts: {
      review_record_count: options.reviewRecordCount,
      diagnostic_count: options.reviewRecordCount,
      checklist_count: options.reviewRecordCount,
      artifact_inventory_count: options.reviewRecordCount
    },
    threshold_counts: options.thresholdCounts,
    issue_counts: options.issueCounts,
    comparison_counts: options.comparisonCounts
  };
}

function clearSummary(generatedAt: string): LocalGate0ReviewStateAssemblySummary {
  return createSummary({
    generatedAt,
    status: "clear",
    reviewRecordCount: 1,
    thresholdCounts: {
      check_count: 6,
      met_count: 6,
      needs_review_count: 0,
      blocked_count: 0
    },
    issueCounts: {
      issue_count: 0,
      needs_review_count: 0,
      blocked_count: 0
    }
  });
}

function blockedSummary(generatedAt: string): LocalGate0ReviewStateAssemblySummary {
  return createSummary({
    generatedAt,
    status: "blocked",
    reviewRecordCount: 2,
    thresholdCounts: {
      check_count: 6,
      met_count: 2,
      needs_review_count: 1,
      blocked_count: 3
    },
    issueCounts: {
      issue_count: 4,
      needs_review_count: 1,
      blocked_count: 3
    }
  });
}

function withComparisonCounts(
  summary: LocalGate0ReviewStateAssemblySummary,
  comparisonCounts: NonNullable<LocalGate0ReviewStateAssemblySummary["comparison_counts"]>
): LocalGate0ReviewStateAssemblySummary {
  return {
    ...summary,
    has_comparisons: true,
    comparison_counts: comparisonCounts
  };
}

describe("local Gate 0 review state assembly summary comparison", () => {
  it("reports unchanged redacted summaries deterministically", () => {
    const comparison = compareLocalGate0ReviewStateAssemblySummaries(
      clearSummary(baselineGeneratedAt),
      clearSummary(candidateGeneratedAt),
      comparisonGeneratedAt
    );

    expect(comparison).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      generated_at: comparisonGeneratedAt,
      baseline_summary_status: "clear",
      candidate_summary_status: "clear",
      status_changed: false,
      has_comparisons: {
        baseline_value: false,
        candidate_value: false,
        changed: false
      },
      review_count_delta: {
        review_record_count: {
          delta: 0
        }
      },
      threshold_count_delta: {
        blocked_count: {
          delta: 0
        }
      },
      issue_count_delta: {
        issue_count: {
          delta: 0
        }
      },
      comparison_count_delta: {
        baseline_present: false,
        candidate_present: false
      }
    });
  });

  it("reports status and count deltas without interpreting them", () => {
    const comparison = compareLocalGate0ReviewStateAssemblySummaries(
      clearSummary(baselineGeneratedAt),
      blockedSummary(candidateGeneratedAt),
      comparisonGeneratedAt
    );

    expect(comparison.status_changed).toBe(true);
    expect(comparison.baseline_summary_status).toBe("clear");
    expect(comparison.candidate_summary_status).toBe("blocked");
    expect(comparison.review_count_delta.review_record_count.delta).toBe(1);
    expect(comparison.threshold_count_delta.met_count.delta).toBe(-4);
    expect(comparison.threshold_count_delta.needs_review_count.delta).toBe(1);
    expect(comparison.threshold_count_delta.blocked_count.delta).toBe(3);
    expect(comparison.issue_count_delta.issue_count.delta).toBe(4);
    expect(comparison.issue_count_delta.blocked_count.delta).toBe(3);
  });

  it("reports comparison-count presence transitions", () => {
    const candidate = withComparisonCounts(blockedSummary(candidateGeneratedAt), {
      snapshot_status_changed: true,
      threshold_status_changed: true,
      issue_register_status_changed: true,
      added_review_count: 1,
      removed_review_count: 0,
      added_issue_count: 2,
      removed_issue_count: 0,
      retained_issue_count: 0,
      changed_issue_count: 0
    });

    const comparison = compareLocalGate0ReviewStateAssemblySummaries(
      clearSummary(baselineGeneratedAt),
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.has_comparisons).toEqual({
      baseline_value: false,
      candidate_value: true,
      changed: true
    });
    expect(comparison.comparison_count_delta).toEqual({
      baseline_present: false,
      candidate_present: true
    });
  });

  it("reports comparison-count deltas when both summaries include them", () => {
    const baseline = withComparisonCounts(blockedSummary(baselineGeneratedAt), {
      snapshot_status_changed: true,
      threshold_status_changed: true,
      issue_register_status_changed: true,
      added_review_count: 1,
      removed_review_count: 0,
      added_issue_count: 2,
      removed_issue_count: 0,
      retained_issue_count: 0,
      changed_issue_count: 0
    });
    const candidate = withComparisonCounts(blockedSummary(candidateGeneratedAt), {
      snapshot_status_changed: false,
      threshold_status_changed: true,
      issue_register_status_changed: false,
      added_review_count: 3,
      removed_review_count: 1,
      added_issue_count: 5,
      removed_issue_count: 1,
      retained_issue_count: 2,
      changed_issue_count: 1
    });

    const comparison = compareLocalGate0ReviewStateAssemblySummaries(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.comparison_count_delta).toMatchObject({
      baseline_present: true,
      candidate_present: true,
      snapshot_status_changed: {
        baseline_value: true,
        candidate_value: false,
        changed: true
      },
      threshold_status_changed: {
        baseline_value: true,
        candidate_value: true,
        changed: false
      },
      added_review_count: {
        delta: 2
      },
      removed_issue_count: {
        delta: 1
      },
      changed_issue_count: {
        delta: 1
      }
    });
  });

  it("keeps comparison shape redacted to counts and statuses", () => {
    const comparisonText = JSON.stringify(
      compareLocalGate0ReviewStateAssemblySummaries(
        clearSummary(baselineGeneratedAt),
        blockedSummary(candidateGeneratedAt),
        comparisonGeneratedAt
      )
    );

    expect(comparisonText).not.toContain("strategy");
    expect(comparisonText).not.toContain("bundle");
    expect(comparisonText).not.toContain("trace");
    expect(comparisonText).not.toContain("issue_id");
    expect(comparisonText).not.toContain("threshold-result:");
  });

  it("rejects invalid summaries before comparison", () => {
    const invalidSummary = {
      ...clearSummary(baselineGeneratedAt),
      has_comparisons: true
    };

    expect(() =>
      compareLocalGate0ReviewStateAssemblySummaries(
        invalidSummary as LocalGate0ReviewStateAssemblySummary,
        clearSummary(candidateGeneratedAt),
        comparisonGeneratedAt
      )
    ).toThrow("has_comparisons must reflect comparison count presence");
  });
});
