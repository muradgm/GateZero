import { describe, expect, it } from "vitest";
import {
  Gate2DeterministicFillModelContractSchema,
  Gate2PaperAccountContractSchema,
  Gate2PaperAccountReconciliationContractSchema,
  Gate2PaperRiskLimitPolicyContractSchema,
  Gate2SimulatedOrderLifecycleEventContractSchema
} from "../src/index.js";
import {
  gate2DeterministicFillModelFixture,
  gate2PaperAccountFixture,
  gate2PaperRiskLimitPolicyFixture,
  gate2SimulatedOrderLifecycleEventFixture
} from "../../fixtures/src/index.js";

describe("Gate 2 local paper simulator contracts", () => {
  it("accepts bounded local account, lifecycle, risk, and fill records", () => {
    expect(Gate2PaperAccountContractSchema.parse(gate2PaperAccountFixture)).toEqual(
      gate2PaperAccountFixture
    );
    expect(
      Gate2SimulatedOrderLifecycleEventContractSchema.parse(
        gate2SimulatedOrderLifecycleEventFixture
      )
    ).toEqual(gate2SimulatedOrderLifecycleEventFixture);
    expect(Gate2PaperRiskLimitPolicyContractSchema.parse(gate2PaperRiskLimitPolicyFixture)).toEqual(
      gate2PaperRiskLimitPolicyFixture
    );
    expect(
      Gate2DeterministicFillModelContractSchema.parse(gate2DeterministicFillModelFixture)
    ).toEqual(gate2DeterministicFillModelFixture);
  });

  it("rejects account accounting drift and duplicate positions", () => {
    expect(() =>
      Gate2PaperAccountContractSchema.parse({ ...gate2PaperAccountFixture, equity: 99_000 })
    ).toThrow();
    expect(() =>
      Gate2PaperAccountContractSchema.parse({
        ...gate2PaperAccountFixture,
        positions: [...gate2PaperAccountFixture.positions, gate2PaperAccountFixture.positions[0]],
        open_position_count: 2,
        equity: 110_000
      })
    ).toThrow();
  });

  it("rejects disallowed lifecycle transitions and mutable limits", () => {
    expect(() =>
      Gate2SimulatedOrderLifecycleEventContractSchema.parse({
        ...gate2SimulatedOrderLifecycleEventFixture,
        from_state: "simulation_recorded",
        to_state: "planned"
      })
    ).toThrow();
    expect(() =>
      Gate2PaperRiskLimitPolicyContractSchema.parse({
        ...gate2PaperRiskLimitPolicyFixture,
        automatic_limit_change: true
      })
    ).toThrow();
  });

  it("rejects optimistic fill assumptions and unsafe boundary mutations", () => {
    expect(() =>
      Gate2DeterministicFillModelContractSchema.parse({
        ...gate2DeterministicFillModelFixture,
        same_candle_fill_allowed: true
      })
    ).toThrow();

    for (const unsafe of [
      { no_external_account: false },
      { credentials_required: true },
      { live_route: true },
      { automated_action: true },
      { execution_path: true },
      { approval_claim: true },
      { performance_claim: true }
    ]) {
      expect(() =>
        Gate2PaperAccountContractSchema.parse({ ...gate2PaperAccountFixture, ...unsafe })
      ).toThrow();
    }
  });

  it("requires mismatched reconciliation to enter readonly emergency posture", () => {
    expect(() =>
      Gate2PaperAccountReconciliationContractSchema.parse({
        financial_gate: "G2_PAPER_TRADING",
        scope: "paper_simulation_planning_only",
        contract_authority: "contract_only",
        local_only: true,
        no_external_account: true,
        credentials_required: false,
        live_route: false,
        automated_action: false,
        external_access: false,
        execution_path: false,
        approval_claim: false,
        performance_claim: false,
        reconciliation_id: "reconciliation-fixture-001",
        paper_account_id: gate2PaperAccountFixture.paper_account_id,
        expected_journal_tail_hash: "sha256:expected",
        observed_journal_tail_hash: "sha256:observed",
        expected_equity: 100_000,
        observed_equity: 99_000,
        expected_open_position_count: 1,
        observed_open_position_count: 1,
        reconciliation_status: "mismatch",
        mismatch_reasons: ["equity_mismatch"],
        readonly_emergency_required: false,
        reconciled_at: "2026-07-19T12:00:00.000Z"
      })
    ).toThrow();
  });
});
