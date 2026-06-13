import { describe, expect, it } from "vitest";
import {
  aggregateLocalGate0ReviewStatePackageIntegrities,
  compareLocalGate0ReviewStateAssemblySummaries,
  inspectLocalGate0ReviewStatePackageIntegrity,
  type LocalGate0ReviewStateAssemblySummary,
  type LocalGate0ReviewStatePackageIntegrity
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";
const firstIntegrityGeneratedAt = "2026-01-04T00:00:00.000Z";
const secondIntegrityGeneratedAt = "2026-01-05T00:00:00.000Z";
const aggregateGeneratedAt = "2026-01-06T00:00:00.000Z";

function createSummary(options: {
  readonly generatedAt: string;
  readonly status: LocalGate0ReviewStateAssemblySummary["summary_status"];
  readonly reviewRecordCount: number;
  readonly thresholdCounts: LocalGate0ReviewStateAssemblySummary["threshold_counts"];
  readonly issueCounts: LocalGate0ReviewStateAssemblySummary["issue_counts"];
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
    has_comparisons: false,
    review_counts: {
      review_record_count: options.reviewRecordCount,
      diagnostic_count: options.reviewRecordCount,
      checklist_count: options.reviewRecordCount,
      artifact_inventory_count: options.reviewRecordCount
    },
    threshold_counts: options.thresholdCounts,
    issue_counts: options.issueCounts
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

function createCurrentOnlyIntegrity(generatedAt: string): LocalGate0ReviewStatePackageIntegrity {
  return inspectLocalGate0ReviewStatePackageIntegrity(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: clearSummary(candidateGeneratedAt)
    },
    generatedAt
  );
}

function createPairedIntegrity(generatedAt: string): LocalGate0ReviewStatePackageIntegrity {
  const baseline = clearSummary(baselineGeneratedAt);
  const candidate = blockedSummary(candidateGeneratedAt);

  return inspectLocalGate0ReviewStatePackageIntegrity(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: candidate,
      baseline_summary: baseline,
      summary_comparison: compareLocalGate0ReviewStateAssemblySummaries(
        baseline,
        candidate,
        comparisonGeneratedAt
      )
    },
    generatedAt
  );
}

function createNeedsReviewIntegrity(generatedAt: string): LocalGate0ReviewStatePackageIntegrity {
  return inspectLocalGate0ReviewStatePackageIntegrity(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: blockedSummary(candidateGeneratedAt),
      baseline_summary: clearSummary(baselineGeneratedAt)
    },
    generatedAt
  );
}

describe("local Gate 0 review state package integrity aggregate", () => {
  it("handles empty integrity aggregation", () => {
    const aggregate = aggregateLocalGate0ReviewStatePackageIntegrities([], aggregateGeneratedAt);

    expect(aggregate).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      aggregate_status: "consistent",
      generated_at: aggregateGeneratedAt,
      integrity_result_count: 0,
      consistent_count: 0,
      needs_review_count: 0,
      total_check_count: 0
    });
    expect(aggregate.latest_integrity_generated_at).toBeUndefined();
  });

  it("aggregates consistent integrity results deterministically", () => {
    const aggregate = aggregateLocalGate0ReviewStatePackageIntegrities(
      [
        createCurrentOnlyIntegrity(firstIntegrityGeneratedAt),
        createPairedIntegrity(secondIntegrityGeneratedAt)
      ],
      aggregateGeneratedAt
    );

    expect(aggregate).toMatchObject({
      aggregate_status: "consistent",
      latest_integrity_generated_at: secondIntegrityGeneratedAt,
      integrity_result_count: 2,
      consistent_count: 2,
      needs_review_count: 0,
      total_check_count: 14,
      total_passed_count: 14,
      total_needs_review_check_count: 0,
      baseline_summary_present_count: 1,
      summary_comparison_present_count: 1
    });
  });

  it("aggregates mixed integrity statuses without interpreting them", () => {
    const aggregate = aggregateLocalGate0ReviewStatePackageIntegrities(
      [
        createCurrentOnlyIntegrity(firstIntegrityGeneratedAt),
        createNeedsReviewIntegrity(secondIntegrityGeneratedAt)
      ],
      aggregateGeneratedAt
    );

    expect(aggregate.aggregate_status).toBe("needs_review");
    expect(aggregate.integrity_result_count).toBe(2);
    expect(aggregate.consistent_count).toBe(1);
    expect(aggregate.needs_review_count).toBe(1);
    expect(aggregate.total_needs_review_check_count).toBe(1);
    expect(aggregate.integrity_results).toEqual([
      {
        generated_at: firstIntegrityGeneratedAt,
        integrity_status: "consistent",
        check_count: 7,
        needs_review_count: 0
      },
      {
        generated_at: secondIntegrityGeneratedAt,
        integrity_status: "needs_review",
        check_count: 7,
        needs_review_count: 1
      }
    ]);
  });

  it("keeps aggregate output redacted to timestamps, statuses, and counts", () => {
    const aggregateText = JSON.stringify(
      aggregateLocalGate0ReviewStatePackageIntegrities(
        [createNeedsReviewIntegrity(firstIntegrityGeneratedAt)],
        aggregateGeneratedAt
      )
    );

    expect(aggregateText).not.toContain("strategy");
    expect(aggregateText).not.toContain("bundle");
    expect(aggregateText).not.toContain("trace");
    expect(aggregateText).not.toContain("issue_id");
    expect(aggregateText).not.toContain("threshold-result:");
  });

  it("rejects invalid integrity results before aggregation", () => {
    const invalidIntegrity = {
      ...createCurrentOnlyIntegrity(firstIntegrityGeneratedAt),
      check_count: 99
    };

    expect(() =>
      aggregateLocalGate0ReviewStatePackageIntegrities(
        [invalidIntegrity as LocalGate0ReviewStatePackageIntegrity],
        aggregateGeneratedAt
      )
    ).toThrow("check_count must match checks length");
  });
});
