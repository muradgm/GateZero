import { describe, expect, it } from "vitest";
import {
  applyGate2PaperPositionFill,
  calculateGate2DeterministicFill,
  evaluateGate2PaperRiskLimits,
  evaluateGate2SimulationCandidateIntegrity,
  reduceGate2PaperAccountState,
  verifyGate2SimulationJournal,
  type Gate2PaperAccountReducerInput
} from "../src/index.js";
import {
  gate2DeterministicFillModelFixture,
  gate2LocalPaperSimulatorFixtureTimestamp,
  gate2PaperAccountFixture,
  gate2PaperRiskLimitPolicyFixture,
  gate2PaperRiskSnapshotFixture,
  gate2SimulatedOrderLifecycleEventFixture
} from "../../fixtures/src/index.js";

describe("Gate 2 local paper-account reducer", () => {
  it("updates position, cash, equity, and fees without mutating input", () => {
    const fill = buildFill();
    const before = structuredClone(gate2PaperAccountFixture);
    const after = applyGate2PaperPositionFill({
      account: gate2PaperAccountFixture,
      fill,
      instrument: "EURUSD",
      markPrice: 1.1,
      snapshotAt: gate2LocalPaperSimulatorFixtureTimestamp
    });

    expect(gate2PaperAccountFixture).toEqual(before);
    expect(after.positions[0]?.quantity).toBe(20_000);
    expect(after.positions[0]?.average_price).toBe(1.050165);
    expect(after.cash_balance).toBe(78_996.6);
    expect(after.realized_pnl).toBe(-0.1);
    expect(after.equity).toBe(100_996.6);
  });

  it("records one deterministic mutation and journal event", () => {
    const input = buildReducerInput();
    const first = reduceGate2PaperAccountState(input);
    const second = reduceGate2PaperAccountState(input);

    expect(first).toEqual(second);
    expect(first.reducer_status).toBe("local_state_recorded");
    expect(first.journal_after).toHaveLength(1);
    expect(first.account_after.journal_tail_hash).toBe(first.journal_after[0]?.event_hash);
    expect(first.account_before).toEqual(gate2PaperAccountFixture);
  });

  it("blocks account mutation after a risk breach", () => {
    const input = buildReducerInput();
    const result = reduceGate2PaperAccountState({
      ...input,
      riskEvaluation: evaluateGate2PaperRiskLimits({
        policy: gate2PaperRiskLimitPolicyFixture,
        snapshot: { ...gate2PaperRiskSnapshotFixture, drawdown_fraction: 0.1 },
        simulatedOrderRecordId: input.fill.simulated_order_record_id,
        evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
      })
    });

    expect(result.reducer_status).toBe("local_state_blocked");
    expect(result.blocking_reasons).toContain("risk evaluation blocks local state mutation");
    expect(result.account_after).toEqual(result.account_before);
    expect(result.journal_after).toEqual(result.journal_before);
  });

  it("blocks stale candidates before mutation", () => {
    const input = buildReducerInput();
    const result = reduceGate2PaperAccountState({
      ...input,
      candidateGuard: evaluateGate2SimulationCandidateIntegrity({
        candidateGuardId: "candidate-guard-fixture-001",
        simulatedOrderRecordId: input.fill.simulated_order_record_id,
        candidateFingerprint: "sha256:candidate-a",
        observedAt: "2026-07-19T11:00:00.000Z",
        evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp,
        maxCandidateAgeSeconds: 300,
        priorFingerprints: []
      })
    });

    expect(result.reducer_status).toBe("local_state_blocked");
    expect(result.blocking_reasons).toContain("candidate integrity blocks local state mutation");
  });

  it("freezes mutation when observed account state drifts", () => {
    const input = buildReducerInput();
    const result = reduceGate2PaperAccountState({
      ...input,
      observedAccount: {
        ...input.observedAccount,
        cash_balance: 89_000,
        equity: 99_000
      }
    });

    expect(result.reducer_status).toBe("local_state_blocked");
    expect(result.input_reconciliation).toMatchObject({
      reconciliation_status: "mismatch",
      readonly_emergency_required: true
    });
    expect(result.account_after).toEqual(result.account_before);
  });

  it("blocks mutation when account and journal tails differ", () => {
    const input = buildReducerInput();
    const result = reduceGate2PaperAccountState({
      ...input,
      expectedAccount: { ...input.expectedAccount, journal_tail_hash: "sha256:missing-tail" },
      observedAccount: { ...input.observedAccount, journal_tail_hash: "sha256:missing-tail" }
    });

    expect(result.blocking_reasons).toContain(
      "local journal tail does not match paper-account state"
    );
  });

  it("rejects a tampered journal before account mutation", () => {
    const recorded = reduceGate2PaperAccountState(buildReducerInput());
    const tampered = [{ ...recorded.journal_after[0]!, payload_digest: "sha256:tampered" }];

    expect(() => verifyGate2SimulationJournal(tampered)).toThrow(/event hash/);
    expect(() =>
      reduceGate2PaperAccountState({ ...buildReducerInput(), journal: tampered })
    ).toThrow(/event hash/);
  });
});

function buildFill() {
  return calculateGate2DeterministicFill({
    model: gate2DeterministicFillModelFixture,
    simulatedOrderRecordId: "gate2-sim-record-fixture-001",
    side: "long",
    quantity: 10_000,
    calculatedAt: gate2LocalPaperSimulatorFixtureTimestamp
  });
}

function buildReducerInput(): Gate2PaperAccountReducerInput {
  const fill = buildFill();

  return {
    expectedAccount: gate2PaperAccountFixture,
    observedAccount: gate2PaperAccountFixture,
    fill,
    instrument: "EURUSD",
    markPrice: 1.1,
    lifecycleEvent: gate2SimulatedOrderLifecycleEventFixture,
    riskEvaluation: evaluateGate2PaperRiskLimits({
      policy: gate2PaperRiskLimitPolicyFixture,
      snapshot: gate2PaperRiskSnapshotFixture,
      simulatedOrderRecordId: fill.simulated_order_record_id,
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
    }),
    candidateGuard: evaluateGate2SimulationCandidateIntegrity({
      candidateGuardId: "candidate-guard-fixture-001",
      simulatedOrderRecordId: fill.simulated_order_record_id,
      candidateFingerprint: "sha256:candidate-a",
      observedAt: gate2LocalPaperSimulatorFixtureTimestamp,
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp,
      maxCandidateAgeSeconds: 300,
      priorFingerprints: []
    }),
    journal: [],
    reducedAt: gate2LocalPaperSimulatorFixtureTimestamp
  };
}
