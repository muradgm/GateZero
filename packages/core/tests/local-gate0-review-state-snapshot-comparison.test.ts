import { describe, expect, it } from "vitest";
import {
  compareLocalGate0ReviewStateSnapshots,
  type LocalGate0ReviewStateSnapshot
} from "../src/index.js";

const baselineGeneratedAt = "2026-01-01T00:00:00.000Z";
const candidateGeneratedAt = "2026-01-02T00:00:00.000Z";
const comparisonGeneratedAt = "2026-01-03T00:00:00.000Z";

type SnapshotStatus = LocalGate0ReviewStateSnapshot["snapshot_status"];
type ReviewRef = LocalGate0ReviewStateSnapshot["reviews"][number];

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
}): LocalGate0ReviewStateSnapshot {
  const blockedCount = countStatuses(options.statuses, "blocked");
  const needsReviewCount = countStatuses(options.statuses, "needs_review");
  const completeCount = countStatuses(options.statuses, "complete");
  const itemCount = options.statuses.length * 7;
  const checklistNeedsReviewCount = needsReviewCount * 2;
  const checklistBlockedCount = blockedCount;
  const checklistCompleteCount = itemCount - checklistNeedsReviewCount - checklistBlockedCount;

  return {
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    snapshot_status: getStatus(blockedCount, needsReviewCount),
    review_record_count: options.reviews.length,
    generated_at: options.generatedAt,
    diagnostic_aggregate: {
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      aggregate_status: getStatus(blockedCount, needsReviewCount),
      diagnostic_count: options.reviews.length,
      complete_count: completeCount,
      needs_review_count: needsReviewCount,
      blocked_count: blockedCount,
      artifact_count: options.reviews.length * 8,
      trace_matched_artifact_count: options.reviews.length * 8,
      checklist_item_count: itemCount,
      checklist_needs_review_count: checklistNeedsReviewCount,
      checklist_blocked_count: checklistBlockedCount,
      outside_local_review_redaction_finding_count: options.reviews.length * 10,
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
          source_recorded_at: options.generatedAt
        };
      })
    },
    artifact_inventory: {
      inventory_count: options.reviews.length,
      artifact_count: options.reviews.length * 8,
      present_artifact_count: options.reviews.length * 8,
      trace_matched_artifact_count: options.reviews.length * 8,
      complete_count: options.reviews.length,
      incomplete_count: 0
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

describe("local Gate 0 review state snapshot comparison", () => {
  it("reports unchanged snapshots deterministically", () => {
    const reviews = [createReviewRef("alpha"), createReviewRef("beta")];
    const baseline = createSnapshot({
      generatedAt: baselineGeneratedAt,
      statuses: ["needs_review", "complete"],
      reviews
    });
    const candidate = createSnapshot({
      generatedAt: candidateGeneratedAt,
      statuses: ["needs_review", "complete"],
      reviews
    });

    const comparison = compareLocalGate0ReviewStateSnapshots(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison).toMatchObject({
      financial_gate: "G0_RESEARCH",
      scope: "research_only",
      generated_at: comparisonGeneratedAt,
      baseline_snapshot_status: "needs_review",
      candidate_snapshot_status: "needs_review",
      status_changed: false,
      review_record_count: {
        baseline_count: 2,
        candidate_count: 2,
        delta: 0
      },
      diagnostic_delta: {
        diagnostic_count_delta: 0,
        blocked_count_delta: 0
      },
      review_reference_changes: {
        added_count: 0,
        removed_count: 0,
        retained_count: 2
      }
    });
  });

  it("reports changed status and local review reference changes", () => {
    const retained = createReviewRef("beta");
    const baseline = createSnapshot({
      generatedAt: baselineGeneratedAt,
      statuses: ["needs_review", "complete"],
      reviews: [createReviewRef("alpha"), retained]
    });
    const candidate = createSnapshot({
      generatedAt: candidateGeneratedAt,
      statuses: ["blocked", "complete"],
      reviews: [retained, createReviewRef("gamma")]
    });

    const comparison = compareLocalGate0ReviewStateSnapshots(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.status_changed).toBe(true);
    expect(comparison.baseline_snapshot_status).toBe("needs_review");
    expect(comparison.candidate_snapshot_status).toBe("blocked");
    expect(comparison.review_reference_changes.added.map((review) => review.strategy_id)).toEqual([
      "strategy-gamma"
    ]);
    expect(comparison.review_reference_changes.removed.map((review) => review.strategy_id)).toEqual(
      ["strategy-alpha"]
    );
    expect(
      comparison.review_reference_changes.retained.map((review) => review.strategy_id)
    ).toEqual(["strategy-beta"]);
  });

  it("reports count deltas without interpreting them", () => {
    const baseline = createSnapshot({
      generatedAt: baselineGeneratedAt,
      statuses: ["complete"],
      reviews: [createReviewRef("alpha")]
    });
    const candidate = createSnapshot({
      generatedAt: candidateGeneratedAt,
      statuses: ["complete", "blocked"],
      reviews: [createReviewRef("alpha"), createReviewRef("beta")]
    });

    const comparison = compareLocalGate0ReviewStateSnapshots(
      baseline,
      candidate,
      comparisonGeneratedAt
    );

    expect(comparison.review_record_count.delta).toBe(1);
    expect(comparison.diagnostic_delta).toMatchObject({
      diagnostic_count_delta: 1,
      complete_count_delta: 0,
      blocked_count_delta: 1,
      artifact_count_delta: 8,
      trace_matched_artifact_count_delta: 8,
      checklist_item_count_delta: 7,
      checklist_blocked_count_delta: 1,
      outside_local_review_redaction_finding_count_delta: 10
    });
    expect(comparison.checklist_score_delta).toMatchObject({
      checklist_count_delta: 1,
      item_count_delta: 7,
      blocked_count_delta: 1
    });
    expect(comparison.artifact_inventory_delta).toMatchObject({
      inventory_count_delta: 1,
      artifact_count_delta: 8,
      complete_count_delta: 1
    });
  });

  it("rejects invalid snapshots before comparison", () => {
    const validSnapshot = createSnapshot({
      generatedAt: baselineGeneratedAt,
      statuses: ["complete"],
      reviews: [createReviewRef("alpha")]
    });
    const invalidSnapshot = {
      ...validSnapshot,
      review_record_count: 99
    };

    expect(() =>
      compareLocalGate0ReviewStateSnapshots(
        invalidSnapshot as LocalGate0ReviewStateSnapshot,
        validSnapshot,
        comparisonGeneratedAt
      )
    ).toThrow("review_record_count must match reviews length");
  });
});
