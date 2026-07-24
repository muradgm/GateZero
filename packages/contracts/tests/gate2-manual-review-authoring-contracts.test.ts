import { describe, expect, it } from "vitest";
import { Gate2ManualReviewAuthoringRecordSchema } from "../src/index.js";
import { gate2ManualReviewAuthoringRecordFixture } from "../../fixtures/src/index.js";

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
});
