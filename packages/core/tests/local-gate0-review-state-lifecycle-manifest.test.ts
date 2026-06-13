import { describe, expect, it } from "vitest";
import {
  aggregateLocalGate0ReviewStatePackageIntegrities,
  assembleLocalGate0ReviewStateLifecycleManifest,
  compareLocalGate0ReviewStateAssemblySummaries,
  inspectLocalGate0ReviewStatePackageIntegrity,
  type LocalGate0ReviewStateAssemblySummary,
  type LocalGate0ReviewStateLifecycleManifestInput
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";
const integrityGeneratedAt = "2026-01-04T00:00:00.000Z";
const aggregateGeneratedAt = "2026-01-05T00:00:00.000Z";
const manifestGeneratedAt = "2026-01-06T00:00:00.000Z";

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

describe("local Gate 0 review state lifecycle manifest", () => {
  it("assembles a summary-only manifest from valid local components", () => {
    const currentSummary = clearSummary(candidateGeneratedAt);
    const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: currentSummary
      },
      integrityGeneratedAt
    );

    const manifest = assembleLocalGate0ReviewStateLifecycleManifest(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: currentSummary,
        package_integrity: packageIntegrity
      },
      manifestGeneratedAt
    );

    expect(manifest).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      manifest_status: "consistent",
      current_summary_generated_at: candidateGeneratedAt,
      current_summary_status: "clear",
      summary_comparison_present: false,
      package_integrity_generated_at: integrityGeneratedAt,
      package_integrity_status: "consistent",
      integrity_aggregate_present: false,
      component_counts: {
        summary_count: 1,
        summary_comparison_count: 0,
        package_integrity_count: 1,
        integrity_aggregate_count: 0
      },
      manifest_check_count: 5,
      manifest_passed_count: 5,
      manifest_needs_review_count: 0
    });
  });

  it("assembles a linked comparison and integrity manifest", () => {
    const baseline = clearSummary(baselineGeneratedAt);
    const candidate = blockedSummary(candidateGeneratedAt);
    const summaryComparison = compareLocalGate0ReviewStateAssemblySummaries(
      baseline,
      candidate,
      comparisonGeneratedAt
    );
    const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: candidate,
        baseline_summary: baseline,
        summary_comparison: summaryComparison
      },
      integrityGeneratedAt
    );

    const manifest = assembleLocalGate0ReviewStateLifecycleManifest(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: candidate,
        summary_comparison: summaryComparison,
        package_integrity: packageIntegrity
      },
      manifestGeneratedAt
    );

    expect(manifest.manifest_status).toBe("consistent");
    expect(manifest.summary_comparison_present).toBe(true);
    expect(manifest.component_counts.summary_comparison_count).toBe(1);
    expect(manifest.review_record_count).toBe(2);
    expect(manifest.issue_count).toBe(4);
  });

  it("assembles an aggregate-linked manifest when the aggregate includes the integrity result", () => {
    const currentSummary = clearSummary(candidateGeneratedAt);
    const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: currentSummary
      },
      integrityGeneratedAt
    );
    const integrityAggregate = aggregateLocalGate0ReviewStatePackageIntegrities(
      [packageIntegrity],
      aggregateGeneratedAt
    );

    const manifest = assembleLocalGate0ReviewStateLifecycleManifest(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: currentSummary,
        package_integrity: packageIntegrity,
        integrity_aggregate: integrityAggregate
      },
      manifestGeneratedAt
    );

    expect(manifest.manifest_status).toBe("consistent");
    expect(manifest.integrity_aggregate_present).toBe(true);
    expect(manifest.integrity_aggregate_generated_at).toBe(aggregateGeneratedAt);
    expect(manifest.integrity_aggregate_status).toBe("consistent");
  });

  it("flags mismatched component presence without exposing raw component data", () => {
    const baseline = clearSummary(baselineGeneratedAt);
    const candidate = blockedSummary(candidateGeneratedAt);
    const summaryComparison = compareLocalGate0ReviewStateAssemblySummaries(
      baseline,
      candidate,
      comparisonGeneratedAt
    );
    const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: candidate
      },
      integrityGeneratedAt
    );

    const manifest = assembleLocalGate0ReviewStateLifecycleManifest(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: candidate,
        summary_comparison: summaryComparison,
        package_integrity: packageIntegrity
      },
      manifestGeneratedAt
    );

    expect(manifest.manifest_status).toBe("needs_review");
    expect(manifest.checks).toContainEqual({
      check_key: "summary_comparison_integrity_presence",
      status: "needs_review"
    });
  });

  it("keeps manifest output redacted to component statuses and counts", () => {
    const currentSummary = clearSummary(candidateGeneratedAt);
    const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: currentSummary
      },
      integrityGeneratedAt
    );
    const manifestText = JSON.stringify(
      assembleLocalGate0ReviewStateLifecycleManifest(
        {
          financial_gate: "G0_RESEARCH",
          scope: "research_only",
          current_summary: currentSummary,
          package_integrity: packageIntegrity
        },
        manifestGeneratedAt
      )
    );

    expect(manifestText).not.toContain("strategy");
    expect(manifestText).not.toContain("bundle");
    expect(manifestText).not.toContain("trace");
    expect(manifestText).not.toContain("issue_id");
    expect(manifestText).not.toContain("threshold-result:");
  });

  it("rejects invalid nested summaries before manifest assembly", () => {
    const currentSummary = clearSummary(candidateGeneratedAt);
    const packageIntegrity = inspectLocalGate0ReviewStatePackageIntegrity(
      {
        financial_gate: "G0_RESEARCH",
        scope: "research_only",
        current_summary: currentSummary
      },
      integrityGeneratedAt
    );
    const invalidInput = {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      current_summary: {
        ...currentSummary,
        has_comparisons: true
      },
      package_integrity: packageIntegrity
    };

    expect(() =>
      assembleLocalGate0ReviewStateLifecycleManifest(
        invalidInput as LocalGate0ReviewStateLifecycleManifestInput,
        manifestGeneratedAt
      )
    ).toThrow("has_comparisons must reflect comparison count presence");
  });
});
