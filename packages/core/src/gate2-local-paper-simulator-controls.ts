import { createHash } from "node:crypto";
import {
  Gate2DeterministicFillModelContractSchema,
  Gate2DeterministicFillResultContractSchema,
  Gate2PaperAccountContractSchema,
  Gate2PaperAccountReconciliationContractSchema,
  Gate2PaperRiskEvaluationContractSchema,
  Gate2PaperRiskLimitPolicyContractSchema,
  Gate2PaperRiskSnapshotContractSchema,
  Gate2SimulationCandidateGuardContractSchema,
  Gate2SimulationJournalEventContractSchema,
  Gate2SimulationJournalEventDraftSchema,
  type Gate2DeterministicFillModelContract,
  type Gate2DeterministicFillResultContract,
  type Gate2PaperAccountContract,
  type Gate2PaperAccountReconciliationContract,
  type Gate2PaperRiskBreach,
  type Gate2PaperRiskEvaluationContract,
  type Gate2PaperRiskLimitPolicyContract,
  type Gate2PaperRiskSnapshotContract,
  type Gate2SimulationCandidateGuardContract,
  type Gate2SimulationJournalEventContract,
  type Gate2SimulationJournalEventDraft,
  type Gate2SimulationSide
} from "../../contracts/src/index.js";

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

export interface Gate2PaperRiskEvaluationInput {
  readonly policy: Gate2PaperRiskLimitPolicyContract;
  readonly snapshot: Gate2PaperRiskSnapshotContract;
  readonly simulatedOrderRecordId: string;
  readonly evaluatedAt: string;
}

export interface Gate2DeterministicFillInput {
  readonly model: Gate2DeterministicFillModelContract;
  readonly simulatedOrderRecordId: string;
  readonly side: Gate2SimulationSide;
  readonly quantity: number;
  readonly calculatedAt: string;
}

export interface Gate2SimulationCandidateGuardInput {
  readonly candidateGuardId: string;
  readonly simulatedOrderRecordId: string;
  readonly candidateFingerprint: string;
  readonly observedAt: string;
  readonly evaluatedAt: string;
  readonly maxCandidateAgeSeconds: number;
  readonly priorFingerprints: readonly string[];
}

export interface Gate2PaperAccountReconciliationInput {
  readonly expected: Gate2PaperAccountContract;
  readonly observed: Gate2PaperAccountContract;
  readonly reconciledAt: string;
}

export function evaluateGate2PaperRiskLimits(
  input: Gate2PaperRiskEvaluationInput
): Gate2PaperRiskEvaluationContract {
  const policy = Gate2PaperRiskLimitPolicyContractSchema.parse(input.policy);
  const snapshot = Gate2PaperRiskSnapshotContractSchema.parse(input.snapshot);
  const breaches: Gate2PaperRiskBreach[] = [];

  if (snapshot.position_fraction > policy.max_position_fraction) {
    breaches.push("max_position_fraction");
  }
  if (snapshot.daily_loss_fraction > policy.max_daily_loss_fraction) {
    breaches.push("max_daily_loss_fraction");
  }
  if (snapshot.weekly_loss_fraction > policy.max_weekly_loss_fraction) {
    breaches.push("max_weekly_loss_fraction");
  }
  if (snapshot.drawdown_fraction > policy.max_drawdown_fraction) {
    breaches.push("max_drawdown_fraction");
  }
  if (snapshot.open_position_count >= policy.max_open_positions) {
    breaches.push("max_open_positions");
  }

  return Gate2PaperRiskEvaluationContractSchema.parse({
    ...localBoundary,
    risk_evaluation_id: `${input.simulatedOrderRecordId}:risk-evaluation`,
    risk_limit_policy_id: policy.risk_limit_policy_id,
    simulated_order_record_id: input.simulatedOrderRecordId,
    evaluation_status: breaches.length === 0 ? "clear_for_local_simulation" : "risk_blocked",
    breaches,
    operator_required: true,
    evaluated_at: input.evaluatedAt
  });
}

export function calculateGate2DeterministicFill(
  input: Gate2DeterministicFillInput
): Gate2DeterministicFillResultContract {
  const model = Gate2DeterministicFillModelContractSchema.parse(input.model);
  const direction = input.side === "long" ? 1 : -1;
  const priceAdjustment = ((model.spread_bps + model.slippage_bps) / 10_000) * direction;
  const fillPrice = round(model.reference_price * (1 + priceAdjustment));
  const notional = round(fillPrice * input.quantity);
  const feeAmount = round(model.fee_per_unit * input.quantity);

  return Gate2DeterministicFillResultContractSchema.parse({
    ...localBoundary,
    fill_result_id: `${input.simulatedOrderRecordId}:deterministic-fill`,
    fill_model_id: model.fill_model_id,
    simulated_order_record_id: input.simulatedOrderRecordId,
    side: input.side,
    quantity: input.quantity,
    fill_price: fillPrice,
    notional,
    fee_amount: feeAmount,
    calculation_formula: "reference_price_with_spread_slippage_bps",
    calculated_at: input.calculatedAt
  });
}

export function evaluateGate2SimulationCandidateIntegrity(
  input: Gate2SimulationCandidateGuardInput
): Gate2SimulationCandidateGuardContract {
  const observedMs = Date.parse(input.observedAt);
  const evaluatedMs = Date.parse(input.evaluatedAt);
  const ageSeconds = (evaluatedMs - observedMs) / 1000;
  const blockingReasons: Array<"duplicate_candidate" | "stale_candidate"> = [];

  if (input.priorFingerprints.includes(input.candidateFingerprint)) {
    blockingReasons.push("duplicate_candidate");
  }
  if (ageSeconds < 0 || ageSeconds > input.maxCandidateAgeSeconds) {
    blockingReasons.push("stale_candidate");
  }

  return Gate2SimulationCandidateGuardContractSchema.parse({
    ...localBoundary,
    candidate_guard_id: input.candidateGuardId,
    simulated_order_record_id: input.simulatedOrderRecordId,
    candidate_fingerprint: input.candidateFingerprint,
    observed_at: input.observedAt,
    evaluated_at: input.evaluatedAt,
    max_candidate_age_seconds: input.maxCandidateAgeSeconds,
    prior_fingerprints: input.priorFingerprints,
    guard_status: blockingReasons.length === 0 ? "clear_for_local_simulation" : "blocked",
    blocking_reasons: blockingReasons,
    operator_required: true
  });
}

export function appendGate2SimulationJournalEvent(
  journal: readonly Gate2SimulationJournalEventContract[],
  draftInput: Gate2SimulationJournalEventDraft
): readonly Gate2SimulationJournalEventContract[] {
  const existing = verifyGate2SimulationJournal(journal);
  const draft = Gate2SimulationJournalEventDraftSchema.parse(draftInput);
  const previous = existing.at(-1);

  if (previous && previous.journal_id !== draft.journal_id) {
    throw new Error("journal id does not match the existing local journal");
  }
  if (draft.sequence !== existing.length + 1) {
    throw new Error("journal sequence must append exactly one immutable event");
  }
  if (existing.some((event) => event.event_id === draft.event_id)) {
    throw new Error("journal event ids must be unique");
  }

  const previousEventHash = previous?.event_hash ?? "GENESIS";
  const eventHash = calculateJournalEventHash(draft, previousEventHash);
  const event = Object.freeze(
    Gate2SimulationJournalEventContractSchema.parse({
      ...localBoundary,
      ...draft,
      previous_event_hash: previousEventHash,
      event_hash: eventHash,
      immutable: true
    })
  );

  return Object.freeze([...existing, event]);
}

export function verifyGate2SimulationJournal(
  journal: readonly Gate2SimulationJournalEventContract[]
): readonly Gate2SimulationJournalEventContract[] {
  const verified: Gate2SimulationJournalEventContract[] = [];
  const eventIds = new Set<string>();

  for (const [index, eventInput] of journal.entries()) {
    const event = Gate2SimulationJournalEventContractSchema.parse(eventInput);
    const previousEventHash = verified.at(-1)?.event_hash ?? "GENESIS";

    if (event.sequence !== index + 1) {
      throw new Error("journal sequence is not contiguous");
    }
    if (event.previous_event_hash !== previousEventHash) {
      throw new Error("journal previous-event hash does not match");
    }
    if (event.event_hash !== calculateJournalEventHash(event, previousEventHash)) {
      throw new Error("journal event hash does not match its payload");
    }
    if (eventIds.has(event.event_id)) {
      throw new Error("journal event ids must be unique");
    }

    eventIds.add(event.event_id);
    verified.push(Object.freeze(event));
  }

  return Object.freeze(verified);
}

export function reconcileGate2PaperAccount(
  input: Gate2PaperAccountReconciliationInput
): Gate2PaperAccountReconciliationContract {
  const expected = Gate2PaperAccountContractSchema.parse(input.expected);
  const observed = Gate2PaperAccountContractSchema.parse(input.observed);

  if (expected.paper_account_id !== observed.paper_account_id) {
    throw new Error("paper account ids must match for reconciliation");
  }

  const mismatchReasons: Array<
    "journal_tail_mismatch" | "equity_mismatch" | "position_count_mismatch"
  > = [];
  if (expected.journal_tail_hash !== observed.journal_tail_hash) {
    mismatchReasons.push("journal_tail_mismatch");
  }
  if (Math.abs(expected.equity - observed.equity) > 0.000001) {
    mismatchReasons.push("equity_mismatch");
  }
  if (expected.open_position_count !== observed.open_position_count) {
    mismatchReasons.push("position_count_mismatch");
  }

  return Gate2PaperAccountReconciliationContractSchema.parse({
    ...localBoundary,
    reconciliation_id: `${expected.paper_account_id}:reconciliation`,
    paper_account_id: expected.paper_account_id,
    expected_journal_tail_hash: expected.journal_tail_hash,
    observed_journal_tail_hash: observed.journal_tail_hash,
    expected_equity: expected.equity,
    observed_equity: observed.equity,
    expected_open_position_count: expected.open_position_count,
    observed_open_position_count: observed.open_position_count,
    reconciliation_status: mismatchReasons.length === 0 ? "reconciled" : "mismatch",
    mismatch_reasons: mismatchReasons,
    readonly_emergency_required: mismatchReasons.length > 0,
    reconciled_at: input.reconciledAt
  });
}

function round(value: number): number {
  return Number(value.toFixed(10));
}

function calculateJournalEventHash(
  event: Gate2SimulationJournalEventDraft,
  previousEventHash: string
): string {
  const eventHash = createHash("sha256")
    .update(
      [
        event.journal_id,
        event.event_id,
        event.sequence,
        event.event_type,
        event.paper_account_id,
        event.simulated_order_record_id,
        event.risk_review_event_id,
        event.operator_action_log_id,
        event.payload_digest,
        previousEventHash,
        event.occurred_at
      ].join("|")
    )
    .digest("hex");

  return `sha256:${eventHash}`;
}
