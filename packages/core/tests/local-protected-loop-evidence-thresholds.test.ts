import { describe, expect, it } from "vitest";
import {
  evaluateLocalProtectedLoopEvidenceThresholds,
  type LocalGate0ReviewStateSnapshot,
  type LocalProtectedLoopEvidenceThresholdProfile
} from "../src/index.js";

const snapshotGeneratedAt = "2026-01-01T00:00:00.000Z";
const thresholdGeneratedAt = "2026-01-02T00:00:00.000Z";

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
    snapshot_status: getStatus(blockedCount, needsReviewCount),
    review_record_count: options.reviews.length,
    generated_at: snapshotGeneratedAt,
    diagnostic_aggregate: {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      aggregate_status: getStatus(blockedCount, needsReviewCount),
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
      generated_at: snapshotGeneratedAt,
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
      status: getStatus(blockedCount, needsReviewCount),
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
          source_recorded_at: snapshotGeneratedAt
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

function getStatus(blockedCount: number, needsReviewCount: number): SnapshotStatus {
  if (blockedCount > 0) {
    return "blocked";
  }

  if (needsReviewCount > 0) {
    return "needs_review";
  }

  return "complete";
}

describe("local protected-loop evidence thresholds", () => {
  it("returns met when every local threshold passes", () => {
    const result = evaluateLocalProtectedLoopEvidenceThresholds(
      createSnapshot({
        statuses: ["complete"],
        reviews: [createReviewRef("alpha")]
      }),
      defaultProfile,
      thresholdGeneratedAt
    );

    expect(result).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      threshold_status: "met",
      generated_at: thresholdGeneratedAt,
      snapshot_generated_at: snapshotGeneratedAt,
      review_record_count: 1,
      check_count: 6,
      met_count: 6,
      needs_review_count: 0,
      blocked_count: 0
    });
  });

  it("returns needs_review for descriptive review and redaction threshold misses", () => {
    const result = evaluateLocalProtectedLoopEvidenceThresholds(
      createSnapshot({
        statuses: ["complete"],
        reviews: [createReviewRef("alpha")],
        outsideLocalReviewRedactionFindingCount: 10
      }),
      {
        ...defaultProfile,
        minimum_review_record_count: 2,
        maximum_outside_local_review_redaction_finding_count: 0
      },
      thresholdGeneratedAt
    );

    expect(result.threshold_status).toBe("needs_review");
    expect(result.needs_review_count).toBe(2);
    expect(result.blocked_count).toBe(0);
    expect(result.checks.map((check) => [check.check_id, check.status])).toContainEqual([
      "review_record_minimum",
      "needs_review"
    ]);
    expect(result.checks.map((check) => [check.check_id, check.status])).toContainEqual([
      "redaction_finding_maximum",
      "needs_review"
    ]);
  });

  it("returns blocked for artifact and blocked-count threshold misses", () => {
    const result = evaluateLocalProtectedLoopEvidenceThresholds(
      createSnapshot({
        statuses: ["blocked"],
        reviews: [createReviewRef("alpha")],
        traceMatchedArtifactCount: 7,
        incompleteArtifactInventoryCount: 1
      }),
      defaultProfile,
      thresholdGeneratedAt
    );

    expect(result.threshold_status).toBe("blocked");
    expect(result.blocked_count).toBe(4);
    expect(result.checks.map((check) => [check.check_id, check.status])).toContainEqual([
      "trace_artifact_coverage",
      "blocked"
    ]);
    expect(result.checks.map((check) => [check.check_id, check.status])).toContainEqual([
      "artifact_inventory_completion",
      "blocked"
    ]);
    expect(result.checks.map((check) => [check.check_id, check.status])).toContainEqual([
      "checklist_blocked_maximum",
      "blocked"
    ]);
    expect(result.checks.map((check) => [check.check_id, check.status])).toContainEqual([
      "diagnostic_blocked_maximum",
      "blocked"
    ]);
  });

  it("rejects invalid threshold profiles before evaluation", () => {
    const invalidProfile = {
      ...defaultProfile,
      minimum_review_record_count: -1
    };

    expect(() =>
      evaluateLocalProtectedLoopEvidenceThresholds(
        createSnapshot({
          statuses: ["complete"],
          reviews: [createReviewRef("alpha")]
        }),
        invalidProfile as LocalProtectedLoopEvidenceThresholdProfile,
        thresholdGeneratedAt
      )
    ).toThrow();
  });

  it("rejects invalid snapshots before evaluation", () => {
    const invalidSnapshot = {
      ...createSnapshot({
        statuses: ["complete"],
        reviews: [createReviewRef("alpha")]
      }),
      review_record_count: 99
    };

    expect(() =>
      evaluateLocalProtectedLoopEvidenceThresholds(
        invalidSnapshot as LocalGate0ReviewStateSnapshot,
        defaultProfile,
        thresholdGeneratedAt
      )
    ).toThrow("review_record_count must match reviews length");
  });
});
