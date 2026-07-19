import { createHash } from "node:crypto";
import { z } from "zod";
import {
  Gate2DeterministicFillResultContractSchema,
  Gate2PaperAccountContractSchema,
  Gate2PaperAccountReconciliationContractSchema,
  Gate2PaperRiskEvaluationContractSchema,
  Gate2SimulatedOrderLifecycleEventContractSchema,
  Gate2SimulationCandidateGuardContractSchema,
  Gate2SimulationJournalEventContractSchema,
  type Gate2DeterministicFillResultContract,
  type Gate2PaperAccountContract,
  type Gate2PaperAccountReconciliationContract,
  type Gate2PaperPositionContract,
  type Gate2PaperRiskEvaluationContract,
  type Gate2SimulatedOrderLifecycleEventContract,
  type Gate2SimulationCandidateGuardContract,
  type Gate2SimulationJournalEventContract
} from "../../contracts/src/index.js";
import {
  appendGate2SimulationJournalEvent,
  reconcileGate2PaperAccount,
  verifyGate2SimulationJournal
} from "./gate2-local-paper-simulator-controls.js";

const Gate2PaperAccountReducerBoundarySchema = z
  .object({
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    local_only: z.literal(true),
    no_external_account: z.literal(true),
    credentials_required: z.literal(false),
    live_route: z.literal(false),
    automated_action: z.literal(false),
    execution_path: z.literal(false),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false)
  })
  .strict();

export const Gate2PaperAccountReducerResultSchema = Gate2PaperAccountReducerBoundarySchema.extend({
  reducer_result_id: z.string().trim().min(1),
  reducer_status: z.enum(["local_state_recorded", "local_state_blocked"]),
  blocking_reasons: z.array(z.string().trim().min(1)),
  account_before: Gate2PaperAccountContractSchema,
  account_after: Gate2PaperAccountContractSchema,
  journal_before: z.array(Gate2SimulationJournalEventContractSchema),
  journal_after: z.array(Gate2SimulationJournalEventContractSchema),
  input_reconciliation: Gate2PaperAccountReconciliationContractSchema,
  simulated_order_record_id: z.string().trim().min(1),
  lifecycle_event_id: z.string().trim().min(1),
  risk_evaluation_id: z.string().trim().min(1),
  candidate_guard_id: z.string().trim().min(1),
  fill_result_id: z.string().trim().min(1),
  reduced_at: z.string().datetime({ offset: true })
})
  .strict()
  .superRefine((result, context) => {
    if (result.reducer_status === "local_state_blocked" && result.blocking_reasons.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked reducer results require blocking reasons",
        path: ["blocking_reasons"]
      });
    }
    if (result.reducer_status === "local_state_recorded" && result.blocking_reasons.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "recorded reducer results cannot contain blocking reasons",
        path: ["blocking_reasons"]
      });
    }
  });

export type Gate2PaperAccountReducerResult = z.infer<typeof Gate2PaperAccountReducerResultSchema>;

export interface Gate2PaperPositionFillInput {
  readonly account: Gate2PaperAccountContract;
  readonly fill: Gate2DeterministicFillResultContract;
  readonly instrument: string;
  readonly markPrice: number;
  readonly snapshotAt: string;
}

export interface Gate2PaperAccountReducerInput {
  readonly expectedAccount: Gate2PaperAccountContract;
  readonly observedAccount: Gate2PaperAccountContract;
  readonly fill: Gate2DeterministicFillResultContract;
  readonly instrument: string;
  readonly markPrice: number;
  readonly lifecycleEvent: Gate2SimulatedOrderLifecycleEventContract;
  readonly riskEvaluation: Gate2PaperRiskEvaluationContract;
  readonly candidateGuard: Gate2SimulationCandidateGuardContract;
  readonly journal: readonly Gate2SimulationJournalEventContract[];
  readonly reducedAt: string;
}

export function applyGate2PaperPositionFill(
  input: Gate2PaperPositionFillInput
): Gate2PaperAccountContract {
  const account = Gate2PaperAccountContractSchema.parse(input.account);
  const fill = Gate2DeterministicFillResultContractSchema.parse(input.fill);
  const signedFillQuantity = fill.side === "long" ? fill.quantity : -fill.quantity;
  const existing = account.positions.find((position) => position.instrument === input.instrument);
  const otherPositions = account.positions.filter(
    (position) => position.instrument !== input.instrument
  );
  const realizedDelta = calculateRealizedPnl(existing, signedFillQuantity, fill.fill_price);
  const nextPosition = buildNextPosition(
    existing,
    input.instrument,
    signedFillQuantity,
    fill.fill_price,
    input.markPrice
  );
  const positions = [...otherPositions, ...(nextPosition ? [nextPosition] : [])].sort(
    (left, right) => left.instrument.localeCompare(right.instrument)
  );
  const cashBalance = round(
    account.cash_balance - signedFillQuantity * fill.fill_price - fill.fee_amount
  );
  const unrealizedPnl = round(
    positions.reduce(
      (total, position) =>
        total + (position.mark_price - position.average_price) * position.quantity,
      0
    )
  );
  const equity = round(
    cashBalance + positions.reduce((total, position) => total + position.market_value, 0)
  );

  return Gate2PaperAccountContractSchema.parse({
    ...account,
    cash_balance: cashBalance,
    realized_pnl: round(account.realized_pnl + realizedDelta - fill.fee_amount),
    unrealized_pnl: unrealizedPnl,
    equity,
    positions,
    open_position_count: positions.length,
    snapshot_at: input.snapshotAt
  });
}

export function reduceGate2PaperAccountState(
  input: Gate2PaperAccountReducerInput
): Gate2PaperAccountReducerResult {
  const expectedAccount = Gate2PaperAccountContractSchema.parse(input.expectedAccount);
  const observedAccount = Gate2PaperAccountContractSchema.parse(input.observedAccount);
  const fill = Gate2DeterministicFillResultContractSchema.parse(input.fill);
  const lifecycleEvent = Gate2SimulatedOrderLifecycleEventContractSchema.parse(
    input.lifecycleEvent
  );
  const riskEvaluation = Gate2PaperRiskEvaluationContractSchema.parse(input.riskEvaluation);
  const candidateGuard = Gate2SimulationCandidateGuardContractSchema.parse(input.candidateGuard);
  const journal = verifyGate2SimulationJournal(input.journal);
  const inputReconciliation = reconcileGate2PaperAccount({
    expected: expectedAccount,
    observed: observedAccount,
    reconciledAt: input.reducedAt
  });
  const blockingReasons = collectReducerBlockingReasons({
    inputReconciliation,
    lifecycleEvent,
    riskEvaluation,
    candidateGuard,
    fill,
    expectedJournalTailHash: expectedAccount.journal_tail_hash,
    observedJournalTailHash: journal.at(-1)?.event_hash ?? "GENESIS"
  });

  if (blockingReasons.length > 0) {
    return buildReducerResult({
      input,
      expectedAccount,
      accountAfter: expectedAccount,
      journalBefore: journal,
      journalAfter: journal,
      inputReconciliation,
      blockingReasons
    });
  }

  const reducedAccount = applyGate2PaperPositionFill({
    account: expectedAccount,
    fill,
    instrument: input.instrument,
    markPrice: input.markPrice,
    snapshotAt: input.reducedAt
  });
  const payloadDigest = createHash("sha256")
    .update(JSON.stringify({ fill, reducedAccount }))
    .digest("hex");
  const journalAfter = appendGate2SimulationJournalEvent(journal, {
    journal_id: journal.at(-1)?.journal_id ?? `${expectedAccount.paper_account_id}:journal`,
    event_id: `${lifecycleEvent.lifecycle_event_id}:journal-event`,
    sequence: journal.length + 1,
    event_type: "simulation_recorded",
    paper_account_id: expectedAccount.paper_account_id,
    simulated_order_record_id: fill.simulated_order_record_id,
    risk_review_event_id: lifecycleEvent.risk_review_event_id,
    operator_action_log_id: lifecycleEvent.operator_action_log_id,
    payload_digest: `sha256:${payloadDigest}`,
    occurred_at: input.reducedAt
  });
  const journalTailHash = journalAfter.at(-1)?.event_hash;

  if (!journalTailHash) {
    throw new Error("recorded local state requires a journal tail hash");
  }

  const accountAfter = Gate2PaperAccountContractSchema.parse({
    ...reducedAccount,
    journal_tail_hash: journalTailHash
  });

  return buildReducerResult({
    input,
    expectedAccount,
    accountAfter,
    journalBefore: journal,
    journalAfter,
    inputReconciliation,
    blockingReasons: []
  });
}

function collectReducerBlockingReasons(input: {
  readonly inputReconciliation: Gate2PaperAccountReconciliationContract;
  readonly lifecycleEvent: Gate2SimulatedOrderLifecycleEventContract;
  readonly riskEvaluation: Gate2PaperRiskEvaluationContract;
  readonly candidateGuard: Gate2SimulationCandidateGuardContract;
  readonly fill: Gate2DeterministicFillResultContract;
  readonly expectedJournalTailHash: string;
  readonly observedJournalTailHash: string;
}): string[] {
  const reasons: string[] = [];

  if (input.inputReconciliation.reconciliation_status === "mismatch") {
    reasons.push("local paper-account state requires readonly reconciliation review");
  }
  if (input.expectedJournalTailHash !== input.observedJournalTailHash) {
    reasons.push("local journal tail does not match paper-account state");
  }
  if (input.riskEvaluation.evaluation_status !== "clear_for_local_simulation") {
    reasons.push("risk evaluation blocks local state mutation");
  }
  if (input.candidateGuard.guard_status !== "clear_for_local_simulation") {
    reasons.push("candidate integrity blocks local state mutation");
  }
  if (
    input.lifecycleEvent.from_state !== "review_required" ||
    input.lifecycleEvent.to_state !== "simulation_recorded"
  ) {
    reasons.push("manual lifecycle evidence does not authorize local recording");
  }
  if (
    input.lifecycleEvent.simulated_order_record_id !== input.fill.simulated_order_record_id ||
    input.riskEvaluation.simulated_order_record_id !== input.fill.simulated_order_record_id ||
    input.candidateGuard.simulated_order_record_id !== input.fill.simulated_order_record_id
  ) {
    reasons.push("local simulation evidence references do not align");
  }

  return reasons;
}

function buildReducerResult(input: {
  readonly input: Gate2PaperAccountReducerInput;
  readonly expectedAccount: Gate2PaperAccountContract;
  readonly accountAfter: Gate2PaperAccountContract;
  readonly journalBefore: readonly Gate2SimulationJournalEventContract[];
  readonly journalAfter: readonly Gate2SimulationJournalEventContract[];
  readonly inputReconciliation: Gate2PaperAccountReconciliationContract;
  readonly blockingReasons: readonly string[];
}): Gate2PaperAccountReducerResult {
  return Gate2PaperAccountReducerResultSchema.parse({
    financial_gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    local_only: true,
    no_external_account: true,
    credentials_required: false,
    live_route: false,
    automated_action: false,
    execution_path: false,
    approval_claim: false,
    performance_claim: false,
    reducer_result_id: `${input.input.fill.simulated_order_record_id}:paper-account-reducer`,
    reducer_status:
      input.blockingReasons.length === 0 ? "local_state_recorded" : "local_state_blocked",
    blocking_reasons: input.blockingReasons,
    account_before: input.expectedAccount,
    account_after: input.accountAfter,
    journal_before: input.journalBefore,
    journal_after: input.journalAfter,
    input_reconciliation: input.inputReconciliation,
    simulated_order_record_id: input.input.fill.simulated_order_record_id,
    lifecycle_event_id: input.input.lifecycleEvent.lifecycle_event_id,
    risk_evaluation_id: input.input.riskEvaluation.risk_evaluation_id,
    candidate_guard_id: input.input.candidateGuard.candidate_guard_id,
    fill_result_id: input.input.fill.fill_result_id,
    reduced_at: input.input.reducedAt
  });
}

function buildNextPosition(
  existing: Gate2PaperPositionContract | undefined,
  instrument: string,
  signedFillQuantity: number,
  fillPrice: number,
  markPrice: number
): Gate2PaperPositionContract | undefined {
  const previousQuantity = existing?.quantity ?? 0;
  const nextQuantity = round(previousQuantity + signedFillQuantity);

  if (nextQuantity === 0) {
    return undefined;
  }

  const sameDirection =
    previousQuantity === 0 || Math.sign(previousQuantity) === Math.sign(signedFillQuantity);
  const reversed =
    previousQuantity !== 0 && Math.sign(previousQuantity) !== Math.sign(nextQuantity);
  const averagePrice =
    sameDirection && existing
      ? round(
          (Math.abs(previousQuantity) * existing.average_price +
            Math.abs(signedFillQuantity) * fillPrice) /
            Math.abs(nextQuantity)
        )
      : reversed || !existing
        ? fillPrice
        : existing.average_price;

  return {
    instrument,
    quantity: nextQuantity,
    average_price: averagePrice,
    mark_price: markPrice,
    market_value: round(nextQuantity * markPrice)
  };
}

function calculateRealizedPnl(
  existing: Gate2PaperPositionContract | undefined,
  signedFillQuantity: number,
  fillPrice: number
): number {
  if (!existing || Math.sign(existing.quantity) === Math.sign(signedFillQuantity)) {
    return 0;
  }

  const closedQuantity = Math.min(Math.abs(existing.quantity), Math.abs(signedFillQuantity));
  return round(
    (fillPrice - existing.average_price) * closedQuantity * Math.sign(existing.quantity)
  );
}

function round(value: number): number {
  return Number(value.toFixed(10));
}
