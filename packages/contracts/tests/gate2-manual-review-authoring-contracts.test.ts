import { describe, expect, it } from "vitest";
import {
  Gate2ManualReviewAuthoringRecordSchema,
  Gate2ManualReviewHistorySchema
} from "../src/index.js";
import {
  gate2ManualReviewAuthoringRecordFixture,
  gate2ManualReviewAuthoringRecordRevision2Fixture,
  gate2ManualReviewHistoryFixture
} from "../../fixtures/src/index.js";

describe("Gate 2 manual review authoring contracts", () => {
  it("accepts one aligned local record", () => {
    expect(
      Gate2ManualReviewAuthoringRecordSchema.parse(gate2ManualReviewAuthoringRecordFixture)
    ).toEqual(gate2ManualReviewAuthoringRecordFixture);
  });

  it.each(["execution_authorized", "external_dispatch"] as const)("rejects enabled %s", (field) => {
    expect(() =>
      Gate2ManualReviewAuthoringRecordSchema.parse({
        ...gate2ManualReviewAuthoringRecordFixture,
        [field]: true
      })
    ).toThrow();
  });

  it("rejects mismatched brief provenance", () => {
    expect(() =>
      Gate2ManualReviewAuthoringRecordSchema.parse({
        ...gate2ManualReviewAuthoringRecordFixture,
        operator_decision: {
          ...gate2ManualReviewAuthoringRecordFixture.operator_decision,
          brief_id: "different-brief"
        }
      })
    ).toThrow(/one frozen brief/);
  });

  it("accepts read-only local review history", () => {
    expect(Gate2ManualReviewHistorySchema.parse(gate2ManualReviewHistoryFixture)).toEqual(
      gate2ManualReviewHistoryFixture
    );
  });

  it("rejects non-contiguous local review history", () => {
    expect(() =>
      Gate2ManualReviewHistorySchema.parse({
        ...gate2ManualReviewHistoryFixture,
        records: [gate2ManualReviewAuthoringRecordRevision2Fixture],
        latest_revision: 2,
        record_count: 1
      })
    ).toThrow(/contiguous/);
  });

  it("rejects history with execution authority", () => {
    expect(() =>
      Gate2ManualReviewHistorySchema.parse({
        ...gate2ManualReviewHistoryFixture,
        execution_authorized: true
      })
    ).toThrow();
  });
});
