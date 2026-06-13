import { describe, expect, it } from "vitest";
import {
  createLocalGate0ReviewStateAssembly,
  summarizeLocalGate0ReviewStateAssembly,
  type LocalGate0ReviewStateAssembly,
  type LocalGate0ReviewStateSnapshot,
  type LocalProtectedLoopEvidenceThresholdProfile
} from "../src/index.js";

const snapshotGeneratedAt = "2026-01-01T00:00:00.000Z";
const baselineSnapshotGeneratedAt = "2025-12-31T00:00:00.000Z";
const assemblyGeneratedAt = "2026-01-02T00:00:00.000Z";
const baselineAssemblyGeneratedAt = "2026-01-01T12:00:00.000Z";
const thresholdGeneratedAt = "2026-01-02T01:00:00.000Z";
const baselineThresholdGeneratedAt = "2026-01-01T01:00:00.000Z";
const issueRegisterGeneratedAt = "2026-01-02T02:00:00.000Z";
const baselineIssueRegisterGeneratedAt = "2026-01-01T02:00:00.000Z";
const comparisonGeneratedAt = "2026-01-02T03:00:00.000Z";
const summaryGeneratedAt = "2026-01-02T04:00:00.000Z";

type SnapshotStatus = LocalGate0ReviewStateSnapshot["snapshot_status"];
type ReviewRef = LocalGate0ReviewStateSnapshot["reviews"][number];

const defaultProfile: LocalProtectedLoopEvidenceThresholdProfile = {
  financial_gate: "G0_RESEARCH",
  scope: "research_only",
  minimum_review_record_count: 1,
  required_artifact_count_per_review: 8,
  maximum_incomplete_artifact_inventory_count: 0,
  maximum_checklist_blocked_count: 0,
  maximum_diagnostic_blocked_count: 0,
  maximum_outside_local_review_redaction_finding_count: 10
};

function createReviewRef(id: string): ReviewRef {
  return {
    strategy_review_bundle_id: `bundle-${id}`,
    trace_id: `trace-${id}`,
    strategy_id: `strategy-${id}`,
    strategy_version: "v0.1.0"
  };
}

function createSnapshot(options: {
  readonly generatedAt: string;
  readonly statuses: readonly SnapshotStatus[];
  readonly reviews: readonly ReviewRef[];
  readonly traceMatchedArtifactCount?: number;
  readonly incompleteArtifactInventoryCount?: number;
  readonly outsideLocalReviewRedactionFindingCount?: number;
}): LocalGate0ReviewStateSnapshot {
  const blockedCount = countStatuses(options.statuses, "blocked");
  const needsReviewCount = countStatuses(options.statuses, "needs_review");
  const completeCount = countStatuses(options.statuses, "complete");
  const itemCount = options.statuses.length * 7;
  const checklistNeedsReviewCount = needsReviewCount * 2;
  const checklistBlockedCount = blockedCount;
  const checklistCompleteCount = itemCount - checklistNeedsReviewCount - checklistBlockedCount;
  const traceMatchedArtifactCount = options.traceMatchedArtifactCount ?? options.reviews.length * 8;
  const incompleteArtifactInventoryCount = options.incompleteArtifactInventoryCount ?? 0;
  const outsideLocalReviewRedactionFindingCount =
    options.outsideLocalReviewRedactionFindingCount ?? options.reviews.length * 10;

  return {
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    snapshot_status: getSnapshotStatus(blockedCount, needsReviewCount),
    review_record_count: options.reviews.length,
    generated_at: options.generatedAt,
    diagnostic_aggregate: {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      aggregate_status: getSnapshotStatus(blockedCount, needsReviewCount),
      diagnostic_count: options.reviews.length,
      complete_count: completeCount,
      needs_review_count: needsReviewCount,
      blocked_count: blockedCount,
      artifact_count: options.reviews.length * 8,
      trace_matched_artifact_count: traceMatchedArtifactCount,
      checklist_item_count: itemCount,
      checklist_needs_review_count: checklistNeedsReviewCount,
      checklist_blocked_count: checklistBlockedCount,
      outside_local_review_redaction_finding_count: outsideLocalReviewRedactionFindingCount,
      generated_at: options.generatedAt,
      diagnostics: options.reviews.map((review, index) => {
        return {
          strategy_review_bundle_id: review.strategy_review_bundle_id,
          trace_id: review.trace_id,
          strategy_id: review.strategy_id,
          diagnostic_status: options.statuses[index] as SnapshotStatus
        };
      })
    },
    checklist_score: {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      status: getSnapshotStatus(blockedCount, needsReviewCount),
      checklist_count: options.reviews.length,
      item_count: itemCount,
      complete_count: checklistCompleteCount,
      needs_review_count: checklistNeedsReviewCount,
      blocked_count: checklistBlockedCount,
      scores: options.reviews.map((review, index) => {
        const status = options.statuses[index] as SnapshotStatus;
        const scoreNeedsReviewCount = status === "needs_review" ? 2 : 0;
        const scoreBlockedCount = status === "blocked" ? 1 : 0;

        return {
          strategy_id: review.strategy_id,
          strategy_version: review.strategy_version,
          financial_gate: "G0_RESEARCH",
          scope: "research_only",
          status,
          item_count: 7,
          complete_count: 7 - scoreNeedsReviewCount - scoreBlockedCount,
          needs_review_count: scoreNeedsReviewCount,
          blocked_count: scoreBlockedCount,
          source_recorded_at: options.generatedAt
        };
      })
    },
    artifact_inventory: {
      inventory_count: options.reviews.length,
      artifact_count: options.reviews.length * 8,
      present_artifact_count: options.reviews.length * 8,
      trace_matched_artifact_count: traceMatchedArtifactCount,
      complete_count: options.reviews.length - incompleteArtifactInventoryCount,
      incomplete_count: incompleteArtifactInventoryCount
    },
    reviews: [...options.reviews]
  };
}

function countStatuses(statuses: readonly SnapshotStatus[], status: SnapshotStatus): number {
  return statuses.filter((currentStatus) => currentStatus === status).length;
}

function getSnapshotStatus(blockedCount: number, needsReviewCount: number): SnapshotStatus {
  if (blockedCount > 0) {
    return "blocked";
  }

  if (needsReviewCount > 0) {
    return "needs_review";
  }

  return "complete";
}

function createBaselineAssembly(): LocalGate0ReviewStateAssembly {
  return createLocalGate0ReviewStateAssembly({
    snapshot: createSnapshot({
      generatedAt: baselineSnapshotGeneratedAt,
      statuses: ["complete"],
      reviews: [createReviewRef("alpha")]
    }),
    thresholdProfile: defaultProfile,
    generatedAt: baselineAssemblyGeneratedAt,
    thresholdGeneratedAt: baselineThresholdGeneratedAt,
    issueRegisterGeneratedAt: baselineIssueRegisterGeneratedAt
  });
}

describe("local Gate 0 review state assembly summary", () => {
  it("summarizes current-only assembly with counts and statuses", () => {
    const assembly = createLocalGate0ReviewStateAssembly({
      snapshot: createSnapshot({
        generatedAt: snapshotGeneratedAt,
        statuses: ["complete"],
        reviews: [createReviewRef("alpha")]
      }),
      thresholdProfile: defaultProfile,
      generatedAt: assemblyGeneratedAt,
      thresholdGeneratedAt,
      issueRegisterGeneratedAt
    });

    const summary = summarizeLocalGate0ReviewStateAssembly(assembly, summaryGeneratedAt);

    expect(summary).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      summary_status: "clear",
      generated_at: summaryGeneratedAt,
      assembly_generated_at: assemblyGeneratedAt,
      snapshot_generated_at: snapshotGeneratedAt,
      threshold_result_generated_at: thresholdGeneratedAt,
      issue_register_generated_at: issueRegisterGeneratedAt,
      has_comparisons: false,
      review_counts: {
        review_record_count: 1,
        diagnostic_count: 1,
        checklist_count: 1,
        artifact_inventory_count: 1
      },
      threshold_counts: {
        check_count: 6,
        met_count: 6,
        needs_review_count: 0,
        blocked_count: 0
      },
      issue_counts: {
        issue_count: 0,
        needs_review_count: 0,
        blocked_count: 0
      }
    });
    expect(summary.comparison_counts).toBeUndefined();
  });

  it("summarizes comparison counts without including raw comparison rows", () => {
    const assembly = createLocalGate0ReviewStateAssembly({
      snapshot: createSnapshot({
        generatedAt: snapshotGeneratedAt,
        statuses: ["blocked"],
        reviews: [createReviewRef("alpha")]
      }),
      thresholdProfile: defaultProfile,
      generatedAt: assemblyGeneratedAt,
      thresholdGeneratedAt,
      issueRegisterGeneratedAt,
      comparisonGeneratedAt,
      baselineAssembly: createBaselineAssembly()
    });

    const summary = summarizeLocalGate0ReviewStateAssembly(assembly, summaryGeneratedAt);

    expect(summary.has_comparisons).toBe(true);
    expect(summary.comparison_counts).toMatchObject({
      snapshot_status_changed: true,
      threshold_status_changed: true,
      issue_register_status_changed: true,
      added_review_count: 0,
      removed_review_count: 0,
      added_issue_count: 2,
      removed_issue_count: 0,
      retained_issue_count: 0,
      changed_issue_count: 0
    });
  });

  it("summarizes blocked assembly status and issue counts", () => {
    const assembly = createLocalGate0ReviewStateAssembly({
      snapshot: createSnapshot({
        generatedAt: snapshotGeneratedAt,
        statuses: ["blocked"],
        reviews: [createReviewRef("alpha")],
        traceMatchedArtifactCount: 7,
        incompleteArtifactInventoryCount: 1
      }),
      thresholdProfile: defaultProfile,
      generatedAt: assemblyGeneratedAt,
      thresholdGeneratedAt,
      issueRegisterGeneratedAt
    });

    const summary = summarizeLocalGate0ReviewStateAssembly(assembly, summaryGeneratedAt);

    expect(summary.summary_status).toBe("blocked");
    expect(summary.issue_counts).toMatchObject({
      issue_count: 4,
      needs_review_count: 0,
      blocked_count: 4
    });
  });

  it("omits local identifiers and issue ids from the summary shape", () => {
    const assembly = createLocalGate0ReviewStateAssembly({
      snapshot: createSnapshot({
        generatedAt: snapshotGeneratedAt,
        statuses: ["blocked"],
        reviews: [createReviewRef("alpha")]
      }),
      thresholdProfile: defaultProfile,
      generatedAt: assemblyGeneratedAt,
      thresholdGeneratedAt,
      issueRegisterGeneratedAt
    });

    const summaryText = JSON.stringify(
      summarizeLocalGate0ReviewStateAssembly(assembly, summaryGeneratedAt)
    );

    expect(summaryText).not.toContain("strategy-alpha");
    expect(summaryText).not.toContain("bundle-alpha");
    expect(summaryText).not.toContain("trace-alpha");
    expect(summaryText).not.toContain("issue_id");
    expect(summaryText).not.toContain("threshold-result:");
  });

  it("rejects invalid assemblies before summary generation", () => {
    const invalidAssembly = {
      ...createBaselineAssembly(),
      assembly_status: "blocked"
    };

    expect(() =>
      summarizeLocalGate0ReviewStateAssembly(
        invalidAssembly as LocalGate0ReviewStateAssembly,
        summaryGeneratedAt
      )
    ).toThrow("assembly_status must match issue register status");
  });
});
