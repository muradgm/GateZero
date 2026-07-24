import { describe, expect, it } from "vitest";
import {
  persistGate2ManualReview,
  recoverGate2ManualReview,
  type Gate2ManualReviewStorage
} from "../src/index.js";
import { gate2ManualReviewAuthoringRecordFixture } from "../../fixtures/src/index.js";

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
});
