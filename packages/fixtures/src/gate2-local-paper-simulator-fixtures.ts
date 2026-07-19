import {
  Gate2DeterministicFillModelContractSchema,
  Gate2PaperAccountContractSchema,
  Gate2PaperRiskLimitPolicyContractSchema,
  Gate2PaperRiskSnapshotContractSchema,
  Gate2SimulatedOrderLifecycleEventContractSchema,
  type Gate2DeterministicFillModelContract,
  type Gate2PaperAccountContract,
  type Gate2PaperRiskLimitPolicyContract,
  type Gate2PaperRiskSnapshotContract,
  type Gate2SimulatedOrderLifecycleEventContract
} from "../../contracts/src/index.js";

const fixtureTimestamp = "2026-07-19T12:00:00.000Z";

const localBoundary = {
  financial_gate: "G2_PAPER_TRADING" as const,
  scope: "paper_simulation_planning_only" as const,
  contract_authority: "contract_only" as const,
  local_only: true as const,
  no_external_account: true as const,
  credentials_required: false as const,
  live_route: false as const,
  automated_action: false as const,
  external_access: false as const,
  execution_path: false as const,
  approval_claim: false as const,
  performance_claim: false as const
};

export const gate2PaperAccountFixture: Gate2PaperAccountContract =
  Gate2PaperAccountContractSchema.parse({
    ...localBoundary,
    paper_account_id: "gate2-paper-account-fixture-001",
    base_currency: "USD",
    starting_cash: 100_000,
    cash_balance: 90_000,
    realized_pnl: 0,
    unrealized_pnl: 0,
    equity: 100_000,
    positions: [
      {
        instrument: "EURUSD",
        quantity: 10_000,
        average_price: 1,
        mark_price: 1,
        market_value: 10_000
      }
    ],
    open_position_count: 1,
    leverage_multiple: 1,
    journal_tail_hash: "sha256:gate2-fixture-tail",
    snapshot_at: fixtureTimestamp
  });

export const gate2SimulatedOrderLifecycleEventFixture: Gate2SimulatedOrderLifecycleEventContract =
  Gate2SimulatedOrderLifecycleEventContractSchema.parse({
    ...localBoundary,
    lifecycle_event_id: "gate2-lifecycle-event-fixture-001",
    simulated_order_record_id: "gate2-sim-record-fixture-001",
    from_state: "review_required",
    to_state: "simulation_recorded",
    transition_reason: "Operator recorded a reviewed local simulation result.",
    risk_review_event_id: "gate2-risk-review-fixture-001",
    operator_action_log_id: "gate2-operator-action-fixture-001",
    operator_required: true,
    automated_transition: false,
    transitioned_at: fixtureTimestamp
  });

export const gate2PaperRiskLimitPolicyFixture: Gate2PaperRiskLimitPolicyContract =
  Gate2PaperRiskLimitPolicyContractSchema.parse({
    ...localBoundary,
    risk_limit_policy_id: "gate2-risk-policy-fixture-001",
    risk_review_event_id: "gate2-risk-review-fixture-001",
    policy_version: "fixture-v1",
    max_position_fraction: 0.0025,
    max_daily_loss_fraction: 0.01,
    max_weekly_loss_fraction: 0.03,
    max_drawdown_fraction: 0.05,
    max_open_positions: 3,
    max_candidate_age_seconds: 300,
    version_locked: true,
    automatic_limit_change: false,
    reviewed_at: fixtureTimestamp
  });

export const gate2PaperRiskSnapshotFixture: Gate2PaperRiskSnapshotContract =
  Gate2PaperRiskSnapshotContractSchema.parse({
    position_fraction: 0.002,
    daily_loss_fraction: 0.001,
    weekly_loss_fraction: 0.002,
    drawdown_fraction: 0.003,
    open_position_count: 1
  });

export const gate2DeterministicFillModelFixture: Gate2DeterministicFillModelContract =
  Gate2DeterministicFillModelContractSchema.parse({
    ...localBoundary,
    fill_model_id: "gate2-fill-model-fixture-001",
    model_version: "fixture-v1",
    reference_price: 1.1,
    spread_bps: 1,
    slippage_bps: 2,
    fee_per_unit: 0.00001,
    latency_ms: 100,
    deterministic: true,
    same_candle_fill_allowed: false,
    limitation_notes: ["Synthetic local assumptions do not model market liquidity."],
    reviewed_at: fixtureTimestamp
  });

export const gate2LocalPaperSimulatorFixtureTimestamp = fixtureTimestamp;
