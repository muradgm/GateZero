import { describe, expect, it } from "vitest";
import {
  Gate2NegativeBoundaryFixtureContractSchema,
  Gate2OperatorActionLogContractSchema,
  Gate2RiskReviewEventContractSchema,
  Gate2SimulatedFillAssumptionContractSchema,
  Gate2SimulatedOrderRecordContractSchema,
  Gate2SimulationStateContractSchema
} from "../../contracts/src/index.js";
import {
  gate2NegativeBoundaryFixtures,
  gate2OperatorActionLogFixture,
  gate2RiskReviewEventFixture,
  gate2SimulatedFillAssumptionFixture,
  gate2SimulatedOrderRecordFixture,
  gate2SimulationStateFixture
} from "../src/index.js";

describe("Gate 2 paper simulation fixtures", () => {
  it("keeps all Gate 2 fixtures parseable against contract schemas", () => {
    expect(Gate2SimulatedOrderRecordContractSchema.parse(gate2SimulatedOrderRecordFixture)).toEqual(
      gate2SimulatedOrderRecordFixture
    );
    expect(Gate2SimulationStateContractSchema.parse(gate2SimulationStateFixture)).toEqual(
      gate2SimulationStateFixture
    );
    expect(Gate2RiskReviewEventContractSchema.parse(gate2RiskReviewEventFixture)).toEqual(
      gate2RiskReviewEventFixture
    );
    expect(Gate2OperatorActionLogContractSchema.parse(gate2OperatorActionLogFixture)).toEqual(
      gate2OperatorActionLogFixture
    );
    expect(
      Gate2SimulatedFillAssumptionContractSchema.parse(gate2SimulatedFillAssumptionFixture)
    ).toEqual(gate2SimulatedFillAssumptionFixture);
  });

  it("keeps negative boundary fixtures synthetic and blocked", () => {
    expect(gate2NegativeBoundaryFixtures).toHaveLength(7);

    for (const fixture of gate2NegativeBoundaryFixtures) {
      expect(Gate2NegativeBoundaryFixtureContractSchema.parse(fixture)).toEqual(fixture);
      expect(fixture.expected_result).toBe("blocked");
      expect(fixture.synthetic_only).toBe(true);
      expect(fixture.contains_secret).toBe(false);
      expect(fixture.execution_path).toBe(false);
    }
  });

  it("covers each required Gate 2 blocked boundary fixture class", () => {
    const boundaryTypes = gate2NegativeBoundaryFixtures.map((fixture) => fixture.boundary_type);

    for (const boundaryType of [
      "external_account_route",
      "credential_payload",
      "autonomy_attempt",
      "live_action_claim",
      "performance_claim",
      "missing_risk_review",
      "missing_operator_action"
    ]) {
      expect(boundaryTypes).toContain(boundaryType);
    }
  });
});
