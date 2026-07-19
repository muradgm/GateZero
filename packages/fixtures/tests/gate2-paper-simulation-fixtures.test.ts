import { describe, expect, it } from "vitest";
import {
  Gate2NegativeBoundaryFixtureContractSchema,
  Gate2LocalArtifactInventoryContractSchema,
  Gate2MarketIntelligenceInputContractSchema,
  Gate2NewsEventScannerContractSchema,
  Gate2OperatorActionLogContractSchema,
  Gate2OperatorNoteModelContractSchema,
  Gate2RiskReviewEventContractSchema,
  Gate2SignalCandidateContractSchema,
  Gate2SimulationEvidenceDetailContractSchema,
  Gate2SimulatedFillAssumptionContractSchema,
  Gate2SimulatedOrderRecordContractSchema,
  Gate2SimulationStateContractSchema,
  Gate2StrategyReviewWorkspaceCaseContractSchema
} from "../../contracts/src/index.js";
import {
  gate2LocalArtifactInventoryFixtures,
  gate2MarketIntelligenceInputFixture,
  gate2NewsEventScannerFixture,
  gate2NegativeBoundaryFixtures,
  gate2OperatorActionLogFixture,
  gate2OperatorNoteModelFixture,
  gate2RiskReviewEventFixture,
  gate2SignalCandidateFixture,
  gate2SimulationEvidenceDetailFixture,
  gate2SimulatedFillAssumptionFixture,
  gate2SimulatedOrderRecordFixture,
  gate2SimulationStateFixture,
  gate2StrategyReviewWorkspaceCaseFixture
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
    expect(
      Gate2SimulationEvidenceDetailContractSchema.parse(gate2SimulationEvidenceDetailFixture)
    ).toEqual(gate2SimulationEvidenceDetailFixture);
    for (const artifact of gate2LocalArtifactInventoryFixtures) {
      expect(Gate2LocalArtifactInventoryContractSchema.parse(artifact)).toEqual(artifact);
    }
    expect(Gate2OperatorNoteModelContractSchema.parse(gate2OperatorNoteModelFixture)).toEqual(
      gate2OperatorNoteModelFixture
    );
    expect(
      Gate2StrategyReviewWorkspaceCaseContractSchema.parse(gate2StrategyReviewWorkspaceCaseFixture)
    ).toEqual(gate2StrategyReviewWorkspaceCaseFixture);
    expect(
      Gate2MarketIntelligenceInputContractSchema.parse(gate2MarketIntelligenceInputFixture)
    ).toEqual(gate2MarketIntelligenceInputFixture);
    expect(Gate2NewsEventScannerContractSchema.parse(gate2NewsEventScannerFixture)).toEqual(
      gate2NewsEventScannerFixture
    );
    expect(Gate2SignalCandidateContractSchema.parse(gate2SignalCandidateFixture)).toEqual(
      gate2SignalCandidateFixture
    );
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

  it("keeps workspace and market-intelligence fixtures local and evidence-only", () => {
    expect(gate2StrategyReviewWorkspaceCaseFixture.read_only_workspace).toBe(true);
    expect(gate2OperatorNoteModelFixture.manual_entry).toBe(true);
    expect(gate2MarketIntelligenceInputFixture.recommendation_final).toBe(false);
    expect(gate2NewsEventScannerFixture.action_route_created).toBe(false);
    expect(gate2SignalCandidateFixture.action_route_created).toBe(false);
    expect(gate2SignalCandidateFixture.recommendation_final).toBe(false);
    expect(gate2LocalArtifactInventoryFixtures).toHaveLength(2);
  });
});
