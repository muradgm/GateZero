import { describe, expect, it } from "vitest";
import {
  Gate2DeterministicFillModelContractSchema,
  Gate2PaperAccountContractSchema,
  Gate2PaperRiskLimitPolicyContractSchema,
  Gate2SimulatedOrderLifecycleEventContractSchema
} from "../../contracts/src/index.js";
import {
  gate2DeterministicFillModelFixture,
  gate2PaperAccountFixture,
  gate2PaperRiskLimitPolicyFixture,
  gate2SimulatedOrderLifecycleEventFixture
} from "../src/index.js";

describe("Gate 2 local paper simulator fixtures", () => {
  it("keeps account and lifecycle fixtures valid and local", () => {
    expect(Gate2PaperAccountContractSchema.parse(gate2PaperAccountFixture)).toEqual(
      gate2PaperAccountFixture
    );
    expect(
      Gate2SimulatedOrderLifecycleEventContractSchema.parse(
        gate2SimulatedOrderLifecycleEventFixture
      )
    ).toEqual(gate2SimulatedOrderLifecycleEventFixture);
    expect(gate2PaperAccountFixture).toMatchObject({
      local_only: true,
      no_external_account: true,
      credentials_required: false,
      live_route: false,
      execution_path: false
    });
  });

  it("uses locked conservative risk and explicit fill assumptions", () => {
    expect(Gate2PaperRiskLimitPolicyContractSchema.parse(gate2PaperRiskLimitPolicyFixture)).toEqual(
      gate2PaperRiskLimitPolicyFixture
    );
    expect(gate2PaperRiskLimitPolicyFixture).toMatchObject({
      max_position_fraction: 0.0025,
      max_daily_loss_fraction: 0.01,
      version_locked: true,
      automatic_limit_change: false
    });
    expect(
      Gate2DeterministicFillModelContractSchema.parse(gate2DeterministicFillModelFixture)
    ).toEqual(gate2DeterministicFillModelFixture);
    expect(gate2DeterministicFillModelFixture).toMatchObject({
      deterministic: true,
      same_candle_fill_allowed: false
    });
  });
});
