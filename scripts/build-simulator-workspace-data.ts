import {
  calculateGate2DeterministicFill,
  evaluateGate2PaperRiskLimits,
  evaluateGate2SimulationCandidateIntegrity,
  reduceGate2PaperAccountState
} from "../packages/core/src/index.js";
import {
  gate2DeterministicFillModelFixture,
  gate2LocalPaperSimulatorFixtureTimestamp,
  gate2PaperAccountFixture,
  gate2PaperRiskLimitPolicyFixture,
  gate2PaperRiskSnapshotFixture,
  gate2SimulatedOrderLifecycleEventFixture
} from "../packages/fixtures/src/index.js";

export function buildSimulatorWorkspaceData() {
  const fill = calculateGate2DeterministicFill({
    model: gate2DeterministicFillModelFixture,
    simulatedOrderRecordId: gate2SimulatedOrderLifecycleEventFixture.simulated_order_record_id,
    side: "long",
    quantity: 10_000,
    calculatedAt: gate2LocalPaperSimulatorFixtureTimestamp
  });
  const risk = evaluateGate2PaperRiskLimits({
    policy: gate2PaperRiskLimitPolicyFixture,
    snapshot: gate2PaperRiskSnapshotFixture,
    simulatedOrderRecordId: fill.simulated_order_record_id,
    evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp
  });
  const candidate = evaluateGate2SimulationCandidateIntegrity({
    candidateGuardId: "candidate-guard-fixture-001",
    simulatedOrderRecordId: fill.simulated_order_record_id,
    candidateFingerprint: "sha256:candidate-a",
    observedAt: gate2LocalPaperSimulatorFixtureTimestamp,
    evaluatedAt: gate2LocalPaperSimulatorFixtureTimestamp,
    maxCandidateAgeSeconds: gate2PaperRiskLimitPolicyFixture.max_candidate_age_seconds,
    priorFingerprints: []
  });
  const result = reduceGate2PaperAccountState({
    expectedAccount: gate2PaperAccountFixture,
    observedAccount: gate2PaperAccountFixture,
    fill,
    instrument: "EURUSD",
    markPrice: 1.1,
    lifecycleEvent: gate2SimulatedOrderLifecycleEventFixture,
    riskEvaluation: risk,
    candidateGuard: candidate,
    journal: [],
    reducedAt: gate2LocalPaperSimulatorFixtureTimestamp
  });
  const beforePosition = result.account_before.positions[0];
  const afterPosition = result.account_after.positions[0];

  if (!beforePosition || !afterPosition) {
    throw new Error("Simulator workspace fixture requires one before and after position.");
  }

  return {
    title: "Local Simulator Evidence",
    subtitle: "One deterministic paper-account record, inspected end to end.",
    gate: result.financial_gate,
    scope: result.scope,
    status: result.reducer_status,
    reducedAt: result.reduced_at,
    account: {
      id: result.account_after.paper_account_id,
      currency: result.account_after.base_currency,
      cashBefore: result.account_before.cash_balance,
      cashAfter: result.account_after.cash_balance,
      equityBefore: result.account_before.equity,
      equityAfter: result.account_after.equity,
      feeAdjustedPnl: result.account_after.realized_pnl,
      openPositions: result.account_after.open_position_count
    },
    position: {
      instrument: afterPosition.instrument,
      quantityBefore: beforePosition.quantity,
      quantityAfter: afterPosition.quantity,
      averagePriceBefore: beforePosition.average_price,
      averagePriceAfter: afterPosition.average_price,
      markPrice: afterPosition.mark_price,
      markedValue: afterPosition.market_value
    },
    lifecycle: {
      from: gate2SimulatedOrderLifecycleEventFixture.from_state,
      to: gate2SimulatedOrderLifecycleEventFixture.to_state,
      reason: gate2SimulatedOrderLifecycleEventFixture.transition_reason,
      operatorRequired: gate2SimulatedOrderLifecycleEventFixture.operator_required,
      automated: gate2SimulatedOrderLifecycleEventFixture.automated_transition
    },
    risk: {
      status: risk.evaluation_status,
      breaches: risk.breaches,
      positionFraction: gate2PaperRiskSnapshotFixture.position_fraction,
      maxPositionFraction: gate2PaperRiskLimitPolicyFixture.max_position_fraction,
      drawdownFraction: gate2PaperRiskSnapshotFixture.drawdown_fraction,
      maxDrawdownFraction: gate2PaperRiskLimitPolicyFixture.max_drawdown_fraction,
      policyVersion: gate2PaperRiskLimitPolicyFixture.policy_version,
      policyLocked: gate2PaperRiskLimitPolicyFixture.version_locked
    },
    candidate: {
      status: candidate.guard_status,
      reasons: candidate.blocking_reasons,
      maxAgeSeconds: candidate.max_candidate_age_seconds
    },
    fill: {
      side: fill.side,
      quantity: fill.quantity,
      price: fill.fill_price,
      notional: fill.notional,
      fee: fill.fee_amount,
      spreadBps: gate2DeterministicFillModelFixture.spread_bps,
      slippageBps: gate2DeterministicFillModelFixture.slippage_bps,
      latencyMs: gate2DeterministicFillModelFixture.latency_ms,
      limitation: gate2DeterministicFillModelFixture.limitation_notes[0]
    },
    journal: {
      eventCount: result.journal_after.length,
      eventType: result.journal_after[0]?.event_type ?? "missing",
      tailHash: result.account_after.journal_tail_hash,
      immutable: result.journal_after[0]?.immutable ?? false
    },
    reconciliation: {
      status: result.input_reconciliation.reconciliation_status,
      mismatchReasons: result.input_reconciliation.mismatch_reasons,
      readonlyEmergency: result.input_reconciliation.readonly_emergency_required
    },
    boundaries: [
      "Synthetic local data only",
      "No external account or credential surface",
      "No external market route",
      "No automated action",
      "No prediction or performance claim",
      "Operator review remains required"
    ]
  } as const;
}

export type SimulatorWorkspaceData = ReturnType<typeof buildSimulatorWorkspaceData>;
