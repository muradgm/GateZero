import { describe, expect, it } from "vitest";
import { Gate2ManualReviewAuthoringRecordSchema } from "../../contracts/src/index.js";
import { gate2ManualReviewAuthoringRecordFixture } from "../src/index.js";

describe("Gate 2 manual review authoring fixture", () => {
  it("is local, manual, and non-executable", () => {
    const record = Gate2ManualReviewAuthoringRecordSchema.parse(
      gate2ManualReviewAuthoringRecordFixture
    );
    expect(record).toMatchObject({
      authoring_mode: "manual_local",
      execution_authorized: false,
      external_dispatch: false
    });
    expect(record.operator_decision.simulation_authorized).toBe(false);
    expect(record.risk_review.approval_granted).toBe(false);
  });
});
