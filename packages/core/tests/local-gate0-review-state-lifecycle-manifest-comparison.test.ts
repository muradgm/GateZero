import { describe, expect, it } from "vitest";
import {
  assembleLocalGate0ReviewStateLifecycleManifest,
  compareLocalGate0ReviewStateLifecycleManifests,
  compareLocalGate0ReviewStateAssemblySummaries,
  inspectLocalGate0ReviewStatePackageIntegrity,
  type LocalGate0ReviewStateAssemblySummary,
  type LocalGate0ReviewStateLifecycleManifest
} from "../src/index.js";

const baselineSummaryGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateSummaryGeneratedAt = "2026-01-02T00:00:00.000Z";
const summaryComparisonGeneratedAt = "2026-01-03T00:00:00.000Z";
const baselineIntegrityGeneratedAt = "2026-01-04T00:00:00.000Z";
const candidateIntegrityGeneratedAt = "2026-01-05T00:00:00.000Z";
const baselineManifestGeneratedAt = "2026-01-06T00:00:00.000Z";
const candidateManifestGeneratedAt = "2026-01-07T00:00:00.000Z";
const manifestComparisonGeneratedAt = "2026-01-08T00:00:00.000Z";

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

function createSummaryOnlyManifest(
  currentSummary: LocalGate0ReviewStateAssemblySummary,
  integrityGeneratedAt: string,
  manifestGeneratedAt: string
): LocalGate0ReviewStateLifecycleManifest {
  const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: currentSummary
    },
    integrityGeneratedAt
  );

  return assembleLocalGate0ReviewStateLifecycleManifest(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: currentSummary,
      package_integrity: packageIntegrity
    },
    manifestGeneratedAt
  );
}

function createComparisonManifest(): LocalGate0ReviewStateLifecycleManifest {
  const baselineSummary = clearSummary(baselineSummaryGeneratedAt);
  const candidateSummary = blockedSummary(candidateSummaryGeneratedAt);
  const summaryComparison = compareLocalGate0ReviewStateAssemblySummaries(
    baselineSummary,
    candidateSummary,
    summaryComparisonGeneratedAt
  );
  const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: candidateSummary,
      baseline_summary: baselineSummary,
      summary_comparison: summaryComparison
    },
    candidateIntegrityGeneratedAt
  );

  return assembleLocalGate0ReviewStateLifecycleManifest(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: candidateSummary,
      summary_comparison: summaryComparison,
      package_integrity: packageIntegrity
    },
    candidateManifestGeneratedAt
  );
}

function createNeedsReviewComparisonManifest(): LocalGate0ReviewStateLifecycleManifest {
  const baselineSummary = clearSummary(baselineSummaryGeneratedAt);
  const candidateSummary = blockedSummary(candidateSummaryGeneratedAt);
  const summaryComparison = compareLocalGate0ReviewStateAssemblySummaries(
    baselineSummary,
    candidateSummary,
    summaryComparisonGeneratedAt
  );
  const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: candidateSummary
    },
    candidateIntegrityGeneratedAt
  );

  return assembleLocalGate0ReviewStateLifecycleManifest(
    {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: candidateSummary,
      summary_comparison: summaryComparison,
      package_integrity: packageIntegrity
    },
    candidateManifestGeneratedAt
  );
}

describe("local Gate 0 review state lifecycle manifest comparison", () => {
  it("reports unchanged redacted manifests deterministically", () => {
    const comparison = compareLocalGate0ReviewStateLifecycleManifests(
      createSummaryOnlyManifest(
        clearSummary(candidateSummaryGeneratedAt),
        baselineIntegrityGeneratedAt,
        baselineManifestGeneratedAt
      ),
      createSummaryOnlyManifest(
        clearSummary(candidateSummaryGeneratedAt),
        candidateIntegrityGeneratedAt,
        candidateManifestGeneratedAt
      ),
      manifestComparisonGeneratedAt
    );

    expect(comparison).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      generated_at: manifestComparisonGeneratedAt,
      baseline_manifest_status: "consistent",
      candidate_manifest_status: "consistent",
      manifest_status_changed: false,
      summary_status_changed: false,
      summary_comparison_present: {
        baseline_value: false,
        candidate_value: false,
        changed: false
      },
      component_count_delta: {
        summary_count: {
          delta: 0
        }
      },
      summary_count_delta: {
        issue_count: {
          delta: 0
        }
      }
    });
  });

  it("reports changed manifest statuses and counts without interpreting them", () => {
    const comparison = compareLocalGate0ReviewStateLifecycleManifests(
      createSummaryOnlyManifest(
        clearSummary(candidateSummaryGeneratedAt),
        baselineIntegrityGeneratedAt,
        baselineManifestGeneratedAt
      ),
      createNeedsReviewComparisonManifest(),
      manifestComparisonGeneratedAt
    );

    expect(comparison.manifest_status_changed).toBe(true);
    expect(comparison.summary_status_changed).toBe(true);
    expect(comparison.baseline_summary_status).toBe("clear");
    expect(comparison.candidate_summary_status).toBe("blocked");
    expect(comparison.summary_count_delta.review_record_count.delta).toBe(1);
    expect(comparison.summary_count_delta.issue_count.delta).toBe(4);
    expect(comparison.component_count_delta.summary_comparison_count.delta).toBe(1);
  });

  it("reports component presence transitions", () => {
    const comparison = compareLocalGate0ReviewStateLifecycleManifests(
      createSummaryOnlyManifest(
        clearSummary(candidateSummaryGeneratedAt),
        baselineIntegrityGeneratedAt,
        baselineManifestGeneratedAt
      ),
      createComparisonManifest(),
      manifestComparisonGeneratedAt
    );

    expect(comparison.summary_comparison_present).toEqual({
      baseline_value: false,
      candidate_value: true,
      changed: true
    });
    expect(comparison.integrity_aggregate_present).toEqual({
      baseline_value: false,
      candidate_value: false,
      changed: false
    });
  });

  it("keeps comparison output redacted to statuses and counts", () => {
    const comparisonText = JSON.stringify(
      compareLocalGate0ReviewStateLifecycleManifests(
        createSummaryOnlyManifest(
          clearSummary(candidateSummaryGeneratedAt),
          baselineIntegrityGeneratedAt,
          baselineManifestGeneratedAt
        ),
        createComparisonManifest(),
        manifestComparisonGeneratedAt
      )
    );

    expect(comparisonText).not.toContain("strategy");
    expect(comparisonText).not.toContain("bundle");
    expect(comparisonText).not.toContain("trace");
    expect(comparisonText).not.toContain("issue_id");
    expect(comparisonText).not.toContain("threshold-result:");
  });

  it("rejects invalid manifests before comparison", () => {
    const invalidManifest = {
      ...createSummaryOnlyManifest(
        clearSummary(candidateSummaryGeneratedAt),
        baselineIntegrityGeneratedAt,
        baselineManifestGeneratedAt
      ),
      manifest_check_count: 99
    };

    expect(() =>
      compareLocalGate0ReviewStateLifecycleManifests(
        invalidManifest as LocalGate0ReviewStateLifecycleManifest,
        createComparisonManifest(),
        manifestComparisonGeneratedAt
      )
    ).toThrow("manifest_check_count must match checks length");
  });
});
