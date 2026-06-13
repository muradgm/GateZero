import { describe, expect, it } from "vitest";
import {
  compareLocalGate0ReviewStateAssemblySummaries,
  inspectLocalGate0ReviewStatePackageIntegrity,
  type LocalGate0ReviewStateAssemblySummary,
  type LocalGate0ReviewStatePackageIntegrityInput
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";
const integrityGeneratedAt = "2026-01-04T00:00:00.000Z";

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

describe("local Gate 0 review state package integrity", () => {
  it("treats a current-only package as structurally consistent", () => {
    const integrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: clearSummary(candidateGeneratedAt)
      },
      integrityGeneratedAt
    );

    expect(integrity).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      generated_at: integrityGeneratedAt,
      current_summary_generated_at: candidateGeneratedAt,
      baseline_summary_present: false,
      summary_comparison_present: false,
      integrity_status: "consistent",
      check_count: 7,
      passed_count: 7,
      needs_review_count: 0
    });
  });

  it("treats a coherent baseline and comparison package as structurally consistent", () => {
    const baseline = clearSummary(baselineGeneratedAt);
    const candidate = blockedSummary(candidateGeneratedAt);
    const comparison = compareLocalGate0ReviewStateAssemblySummaries(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    const integrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: candidate,
        baseline_summary: baseline,
        summary_comparison: comparison
      },
      integrityGeneratedAt
    );

    expect(integrity.integrity_status).toBe("consistent");
    expect(integrity.passed_count).toBe(7);
    expect(integrity.needs_review_count).toBe(0);
  });

  it("flags a baseline package that is missing its comparison", () => {
    const integrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: blockedSummary(candidateGeneratedAt),
        baseline_summary: clearSummary(baselineGeneratedAt)
      },
      integrityGeneratedAt
    );

    expect(integrity.integrity_status).toBe("needs_review");
    expect(integrity.needs_review_count).toBe(1);
    expect(integrity.checks).toContainEqual({
      check_key: "baseline_comparison_pairing",
      status: "needs_review"
    });
  });

  it("flags comparison timestamp and status mismatches without changing inputs", () => {
    const baseline = clearSummary(baselineGeneratedAt);
    const candidate = blockedSummary(candidateGeneratedAt);
    const comparison = compareLocalGate0ReviewStateAssemblySummaries(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    const integrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: candidate,
        baseline_summary: baseline,
        summary_comparison: {
          ...comparison,
          candidate_generated_at: baselineGeneratedAt,
          candidate_summary_status: "clear",
          status_changed: false
        }
      },
      integrityGeneratedAt
    );

    expect(integrity.integrity_status).toBe("needs_review");
    expect(integrity.checks).toContainEqual({
      check_key: "comparison_candidate_generated_at",
      status: "needs_review"
    });
    expect(integrity.checks).toContainEqual({
      check_key: "comparison_candidate_status",
      status: "needs_review"
    });
  });

  it("keeps integrity output redacted to check statuses and counts", () => {
    const integrityText = JSON.stringify(
      inspectLocalGate0ReviewStatePackageIntegrity(
        {
          financial_gate: "G0_RESEARCH",
          scope: "research_only",
          current_summary: blockedSummary(candidateGeneratedAt),
          baseline_summary: clearSummary(baselineGeneratedAt)
        },
        integrityGeneratedAt
      )
    );

    expect(integrityText).not.toContain("strategy");
    expect(integrityText).not.toContain("bundle");
    expect(integrityText).not.toContain("trace");
    expect(integrityText).not.toContain("issue_id");
    expect(integrityText).not.toContain("threshold-result:");
  });

  it("rejects invalid nested summaries before integrity inspection", () => {
    const invalidInput = {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: {
        ...clearSummary(candidateGeneratedAt),
        has_comparisons: true
      }
    };

    expect(() =>
      inspectLocalGate0ReviewStatePackageIntegrity(
        invalidInput as LocalGate0ReviewStatePackageIntegrityInput,
        integrityGeneratedAt
      )
    ).toThrow("has_comparisons must reflect comparison count presence");
  });
});
