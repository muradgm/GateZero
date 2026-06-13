import { describe, expect, it } from "vitest";
import {
  createLocalGate0ReviewStateAssembly,
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

describe("local Gate 0 review state assembly", () => {
  it("assembles current local review state without comparisons", () => {
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

    expect(assembly).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      assembly_status: "clear",
      generated_at: assemblyGeneratedAt,
      threshold_result: {
        threshold_status: "met",
        generated_at: thresholdGeneratedAt,
        snapshot_generated_at: snapshotGeneratedAt
      },
      issue_register: {
        register_status: "clear",
        generated_at: issueRegisterGeneratedAt,
        threshold_result_generated_at: thresholdGeneratedAt,
        issue_count: 0
      }
    });
    expect(assembly.comparisons).toBeUndefined();
  });

  it("assembles current local review state with baseline comparisons", () => {
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

    expect(assembly.assembly_status).toBe("blocked");
    expect(assembly.comparisons).toMatchObject({
      snapshot_comparison: {
        generated_at: comparisonGeneratedAt,
        baseline_snapshot_status: "complete",
        candidate_snapshot_status: "blocked",
        status_changed: true
      },
      threshold_result_comparison: {
        generated_at: comparisonGeneratedAt,
        baseline_threshold_status: "met",
        candidate_threshold_status: "blocked",
        status_changed: true
      },
      issue_register_comparison: {
        generated_at: comparisonGeneratedAt,
        baseline_register_status: "clear",
        candidate_register_status: "blocked",
        status_changed: true
      }
    });
  });

  it("returns blocked assembly status from blocked issue register", () => {
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

    expect(assembly.assembly_status).toBe("blocked");
    expect(assembly.issue_register.blocked_count).toBe(4);
  });

  it("rejects invalid current snapshots before assembly", () => {
    const invalidSnapshot = {
      ...createSnapshot({
        generatedAt: snapshotGeneratedAt,
        statuses: ["complete"],
        reviews: [createReviewRef("alpha")]
      }),
      review_record_count: 99
    };

    expect(() =>
      createLocalGate0ReviewStateAssembly({
        snapshot: invalidSnapshot as LocalGate0ReviewStateSnapshot,
        thresholdProfile: defaultProfile,
        generatedAt: assemblyGeneratedAt,
        thresholdGeneratedAt,
        issueRegisterGeneratedAt
      })
    ).toThrow("review_record_count must match reviews length");
  });

  it("rejects invalid baseline assemblies before comparison", () => {
    const invalidBaseline = {
      ...createBaselineAssembly(),
      assembly_status: "blocked"
    };

    expect(() =>
      createLocalGate0ReviewStateAssembly({
        snapshot: createSnapshot({
          generatedAt: snapshotGeneratedAt,
          statuses: ["complete"],
          reviews: [createReviewRef("alpha")]
        }),
        thresholdProfile: defaultProfile,
        generatedAt: assemblyGeneratedAt,
        thresholdGeneratedAt,
        issueRegisterGeneratedAt,
        baselineAssembly: invalidBaseline as LocalGate0ReviewStateAssembly
      })
    ).toThrow("assembly_status must match issue register status");
  });
});
