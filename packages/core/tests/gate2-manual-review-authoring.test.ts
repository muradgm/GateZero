import { describe, expect, it } from "vitest";
import {
  persistGate2ManualReview,
  inspectGate2ManualReviewHistory,
  recoverGate2ManualReview,
  type Gate2ManualReviewStorage
} from "../src/index.js";
import {
  gate2ManualReviewAuthoringRecordFixture,
  gate2ManualReviewAuthoringRecordRevision2Fixture
} from "../../fixtures/src/index.js";

function memoryStorage(initial?: string): Gate2ManualReviewStorage {
  let value = initial ?? null;
  return {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next;
    }
  };
}

const expected = {
  expectedBriefId: gate2ManualReviewAuthoringRecordFixture.brief_id,
  expectedBriefHash: gate2ManualReviewAuthoringRecordFixture.brief_content_sha256
};

describe("Gate 2 manual review authoring", () => {
  it("persists and recovers a validated local record", () => {
    const storage = memoryStorage();
    persistGate2ManualReview(storage, "review", gate2ManualReviewAuthoringRecordFixture);
    expect(recoverGate2ManualReview({ storage, key: "review", ...expected }).status).toBe(
      "recovered"
    );
  });

  it("returns empty without inventing a record", () => {
    expect(
      recoverGate2ManualReview({ storage: memoryStorage(), key: "review", ...expected }).status
    ).toBe("empty");
  });

  it.each([
    ["{", "invalid_json"],
    [JSON.stringify({ hello: "world" }), "invalid_contract"],
    [
      JSON.stringify({
        ...gate2ManualReviewAuthoringRecordFixture,
        brief_content_sha256: "a".repeat(64)
      }),
      "invalid_contract"
    ]
  ])("blocks malformed storage", (raw, reason) => {
    const result = recoverGate2ManualReview({
      storage: memoryStorage(raw),
      key: "review",
      ...expected
    });
    expect(result).toMatchObject({ status: "blocked", reason });
  });

  it("blocks an older local revision", () => {
    const result = recoverGate2ManualReview({
      storage: memoryStorage(JSON.stringify(gate2ManualReviewAuthoringRecordFixture)),
      key: "review",
      minimumRevision: 2,
      ...expected
    });
    expect(result).toMatchObject({ status: "blocked", reason: "revision_conflict" });
  });

  it("inspects sorted read-only local history", () => {
    const history = inspectGate2ManualReviewHistory({
      historyId: "manual-review-history-001",
      linkedResearchCaseId: gate2ManualReviewAuthoringRecordFixture.linked_research_case_id,
      briefId: gate2ManualReviewAuthoringRecordFixture.brief_id,
      briefContentSha256: gate2ManualReviewAuthoringRecordFixture.brief_content_sha256,
      records: [
        gate2ManualReviewAuthoringRecordRevision2Fixture,
        gate2ManualReviewAuthoringRecordFixture
      ],
      inspectedAt: "2026-07-24T01:05:00.000Z"
    });

    expect(history.records.map((record) => record.revision)).toEqual([1, 2]);
    expect(history.latest_revision).toBe(2);
    expect(history.execution_authorized).toBe(false);
    expect(history.external_dispatch).toBe(false);
  });

  it("blocks history records from another frozen brief", () => {
    expect(() =>
      inspectGate2ManualReviewHistory({
        historyId: "manual-review-history-001",
        linkedResearchCaseId: gate2ManualReviewAuthoringRecordFixture.linked_research_case_id,
        briefId: gate2ManualReviewAuthoringRecordFixture.brief_id,
        briefContentSha256: gate2ManualReviewAuthoringRecordFixture.brief_content_sha256,
        records: [
          {
            ...gate2ManualReviewAuthoringRecordFixture,
            linked_research_case_id: "different-case"
          }
        ],
        inspectedAt: "2026-07-24T01:05:00.000Z"
      })
    ).toThrow(/aligned/);
  });
});
