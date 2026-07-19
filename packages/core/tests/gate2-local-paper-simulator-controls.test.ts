import { describe, expect, it } from "vitest";
import {
  appendGate2SimulationJournalEvent,
  calculateGate2DeterministicFill,
  evaluateGate2PaperRiskLimits,
  evaluateGate2SimulationCandidateIntegrity,
  reconcileGate2PaperAccount,
  verifyGate2SimulationJournal
} from "../src/index.js";
import {
  gate2DeterministicFillModelFixture,
  gate2LocalPaperSimulatorFixtureTimestamp,
  gate2PaperAccountFixture,
  gate2PaperRiskLimitPolicyFixture,
  gate2PaperRiskSnapshotFixture
} from "../../fixtures/src/index.js";

describe("Gate 2 local paper simulator controls", () => {
  it("fails closed on declared risk limits", () => {
    const clear = evaluateGate2PaperRiskLimits({
      policy: gate2PaperRiskLimitPolicyFixture,
      snapshot: gate2PaperRiskSnapshotFixture,
      simulatedOrderRecordId: "gate2-sim-record-fixture-001",
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
    });
    const blocked = evaluateGate2PaperRiskLimits({
      policy: gate2PaperRiskLimitPolicyFixture,
      snapshot: {
        ...gate2PaperRiskSnapshotFixture,
        daily_loss_fraction: 0.02,
        open_position_count: 3
      },
      simulatedOrderRecordId: "gate2-sim-record-fixture-001",
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
    });

    expect(clear.evaluation_status).toBe("clear_for_local_simulation");
    expect(blocked).toMatchObject({
      evaluation_status: "risk_blocked",
      breaches: ["max_daily_loss_fraction", "max_open_positions"],
      operator_required: true
    });
  });

  it("calculates reproducible long and short fills with explicit fees", () => {
    const base = {
      model: gate2DeterministicFillModelFixture,
      simulatedOrderRecordId: "gate2-sim-record-fixture-001",
      quantity: 10_000,
      calculatedAt: gate2LocalPaperSimulatorFixtureTimestamp
    } as const;
    const long = calculateGate2DeterministicFill({ ...base, side: "long" });
    const short = calculateGate2DeterministicFill({ ...base, side: "short" });

    expect(long.fill_price).toBeGreaterThan(gate2DeterministicFillModelFixture.reference_price);
    expect(short.fill_price).toBeLessThan(gate2DeterministicFillModelFixture.reference_price);
    expect(long.fee_amount).toBe(0.1);
    expect(calculateGate2DeterministicFill({ ...base, side: "long" })).toEqual(long);
  });

  it("blocks duplicate and stale candidates", () => {
    const result = evaluateGate2SimulationCandidateIntegrity({
      candidateGuardId: "candidate-guard-fixture-001",
      simulatedOrderRecordId: "gate2-sim-record-fixture-001",
      candidateFingerprint: "sha256:candidate-a",
      observedAt: "2026-07-19T11:50:00.000Z",
      evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp,
      maxCandidateAgeSeconds: 300,
      priorFingerprints: ["sha256:candidate-a"]
    });

    expect(result).toMatchObject({
      guard_status: "blocked",
      blocking_reasons: ["duplicate_candidate", "stale_candidate"]
    });
  });

  it("appends an immutable, hash-chained journal without mutating prior input", () => {
    const draft = {
      journal_id: "gate2-journal-fixture-001",
      event_id: "gate2-journal-event-fixture-001",
      sequence: 1,
      event_type: "candidate_checked" as const,
      paper_account_id: gate2PaperAccountFixture.paper_account_id,
      simulated_order_record_id: "gate2-sim-record-fixture-001",
      risk_review_event_id: "gate2-risk-review-fixture-001",
      operator_action_log_id: "gate2-operator-action-fixture-001",
      payload_digest: "sha256:payload-a",
      occurred_at: gate2LocalPaperSimulatorFixtureTimestamp
    };
    const original: readonly never[] = [];
    const first = appendGate2SimulationJournalEvent(original, draft);
    const second = appendGate2SimulationJournalEvent(first, {
      ...draft,
      event_id: "gate2-journal-event-fixture-002",
      sequence: 2,
      event_type: "risk_reviewed",
      payload_digest: "sha256:payload-b"
    });

    expect(original).toHaveLength(0);
    expect(Object.isFrozen(first)).toBe(true);
    expect(second[1]?.previous_event_hash).toBe(first[0]?.event_hash);
    expect(() => appendGate2SimulationJournalEvent(first, draft)).toThrow(/sequence/);
  });

  it("rejects duplicate ids and tampered prior journal events", () => {
    const draft = {
      journal_id: "gate2-journal-fixture-001",
      event_id: "gate2-journal-event-fixture-001",
      sequence: 1,
      event_type: "candidate_checked" as const,
      paper_account_id: gate2PaperAccountFixture.paper_account_id,
      simulated_order_record_id: "gate2-sim-record-fixture-001",
      risk_review_event_id: "gate2-risk-review-fixture-001",
      operator_action_log_id: "gate2-operator-action-fixture-001",
      payload_digest: "sha256:payload-a",
      occurred_at: gate2LocalPaperSimulatorFixtureTimestamp
    };
    const first = appendGate2SimulationJournalEvent([], draft);

    expect(() => appendGate2SimulationJournalEvent(first, { ...draft, sequence: 2 })).toThrow(
      /unique/
    );
    expect(() =>
      verifyGate2SimulationJournal([{ ...first[0]!, payload_digest: "sha256:tampered" }])
    ).toThrow(/event hash/);
  });

  it("reconciles exact state and freezes mismatched state", () => {
    const reconciled = reconcileGate2PaperAccount({
      expected: gate2PaperAccountFixture,
      observed: gate2PaperAccountFixture,
      reconciledAt: gate2LocalPaperSimulatorFixtureTimestamp
    });
    const mismatch = reconcileGate2PaperAccount({
      expected: gate2PaperAccountFixture,
      observed: {
        ...gate2PaperAccountFixture,
        cash_balance: 89_000,
        equity: 99_000,
        journal_tail_hash: "sha256:unexpected-tail"
      },
      reconciledAt: gate2LocalPaperSimulatorFixtureTimestamp
    });

    expect(reconciled.reconciliation_status).toBe("reconciled");
    expect(mismatch).toMatchObject({
      reconciliation_status: "mismatch",
      mismatch_reasons: ["journal_tail_mismatch", "equity_mismatch"],
      readonly_emergency_required: true
    });
  });
});
