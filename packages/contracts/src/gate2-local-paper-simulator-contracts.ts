import { z } from "zod";
import { IdentifierSchema, IsoDateTimeSchema, NonEmptyStringSchema } from "./schemas.js";
import {
  Gate2SimulationSideSchema,
  Gate2SimulationStateSchema
} from "./gate2-paper-simulation-contracts.js";

const FractionSchema = z.number().finite().min(0).max(1);
const MoneySchema = z.number().finite().nonnegative();

const Gate2LocalSimulatorBoundarySchema = z
  .object({
    financial_gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    contract_authority: z.literal("contract_only"),
    local_only: z.literal(true),
    no_external_account: z.literal(true),
    credentials_required: z.literal(false),
    live_route: z.literal(false),
    automated_action: z.literal(false),
    external_access: z.literal(false),
    execution_path: z.literal(false),
    approval_claim: z.literal(false),
    performance_claim: z.literal(false)
  })
  .strict();

export const Gate2PaperPositionContractSchema = z
  .object({
    instrument: NonEmptyStringSchema,
    quantity: z
      .number()
      .finite()
      .refine((value) => value !== 0, "position quantity cannot be zero"),
    average_price: z.number().finite().positive(),
    mark_price: z.number().finite().positive(),
    market_value: z.number().finite()
  })
  .strict();

export const Gate2PaperAccountContractSchema = Gate2LocalSimulatorBoundarySchema.extend({
  paper_account_id: IdentifierSchema,
  base_currency: NonEmptyStringSchema,
  starting_cash: z.number().finite().positive(),
  cash_balance: MoneySchema,
  realized_pnl: z.number().finite(),
  unrealized_pnl: z.number().finite(),
  equity: MoneySchema,
  positions: z.array(Gate2PaperPositionContractSchema),
  open_position_count: z.number().int().nonnegative(),
  leverage_multiple: z.literal(1),
  journal_tail_hash: NonEmptyStringSchema,
  snapshot_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((account, context) => {
    if (account.open_position_count !== account.positions.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "open position count must match the position records",
        path: ["open_position_count"]
      });
    }

    const instruments = account.positions.map((position) => position.instrument);
    if (new Set(instruments).size !== instruments.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper account positions must use unique instruments",
        path: ["positions"]
      });
    }

    const calculatedEquity =
      account.cash_balance +
      account.positions.reduce((total, position) => total + position.market_value, 0);
    if (Math.abs(calculatedEquity - account.equity) > 0.000001) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "paper account equity must reconcile to cash and marked position values",
        path: ["equity"]
      });
    }
  });

const allowedTransitions: Readonly<
  Record<
    z.infer<typeof Gate2SimulationStateSchema>,
    readonly z.infer<typeof Gate2SimulationStateSchema>[]
  >
> = {
  planned: ["review_required", "voided"],
  review_required: ["risk_blocked", "operator_rejected", "simulation_recorded", "voided"],
  risk_blocked: ["voided"],
  operator_rejected: ["voided"],
  simulation_recorded: ["voided"],
  voided: []
};

export const Gate2SimulatedOrderLifecycleEventContractSchema =
  Gate2LocalSimulatorBoundarySchema.extend({
    lifecycle_event_id: IdentifierSchema,
    simulated_order_record_id: IdentifierSchema,
    from_state: Gate2SimulationStateSchema,
    to_state: Gate2SimulationStateSchema,
    transition_reason: NonEmptyStringSchema,
    risk_review_event_id: IdentifierSchema,
    operator_action_log_id: IdentifierSchema,
    operator_required: z.literal(true),
    automated_transition: z.literal(false),
    transitioned_at: IsoDateTimeSchema
  })
    .strict()
    .superRefine((event, context) => {
      if (!allowedTransitions[event.from_state].includes(event.to_state)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `disallowed local simulation transition: ${event.from_state} -> ${event.to_state}`,
          path: ["to_state"]
        });
      }
    });

export const Gate2PaperRiskLimitPolicyContractSchema = Gate2LocalSimulatorBoundarySchema.extend({
  risk_limit_policy_id: IdentifierSchema,
  risk_review_event_id: IdentifierSchema,
  policy_version: NonEmptyStringSchema,
  max_position_fraction: FractionSchema,
  max_daily_loss_fraction: FractionSchema,
  max_weekly_loss_fraction: FractionSchema,
  max_drawdown_fraction: FractionSchema,
  max_open_positions: z.number().int().positive(),
  max_candidate_age_seconds: z.number().int().positive(),
  version_locked: z.literal(true),
  automatic_limit_change: z.literal(false),
  reviewed_at: IsoDateTimeSchema
}).strict();

export const Gate2PaperRiskSnapshotContractSchema = z
  .object({
    position_fraction: FractionSchema,
    daily_loss_fraction: FractionSchema,
    weekly_loss_fraction: FractionSchema,
    drawdown_fraction: FractionSchema,
    open_position_count: z.number().int().nonnegative()
  })
  .strict();

export const Gate2PaperRiskBreachSchema = z.enum([
  "max_position_fraction",
  "max_daily_loss_fraction",
  "max_weekly_loss_fraction",
  "max_drawdown_fraction",
  "max_open_positions"
]);

export const Gate2PaperRiskEvaluationContractSchema = Gate2LocalSimulatorBoundarySchema.extend({
  risk_evaluation_id: IdentifierSchema,
  risk_limit_policy_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  evaluation_status: z.enum(["clear_for_local_simulation", "risk_blocked"]),
  breaches: z.array(Gate2PaperRiskBreachSchema),
  operator_required: z.literal(true),
  evaluated_at: IsoDateTimeSchema
})
  .strict()
  .superRefine((evaluation, context) => {
    if (evaluation.evaluation_status === "risk_blocked" && evaluation.breaches.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked risk evaluations require at least one breach",
        path: ["breaches"]
      });
    }
    if (
      evaluation.evaluation_status === "clear_for_local_simulation" &&
      evaluation.breaches.length > 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "clear risk evaluations cannot contain breaches",
        path: ["breaches"]
      });
    }
  });

export const Gate2DeterministicFillModelContractSchema = Gate2LocalSimulatorBoundarySchema.extend({
  fill_model_id: IdentifierSchema,
  model_version: NonEmptyStringSchema,
  reference_price: z.number().finite().positive(),
  spread_bps: z.number().finite().nonnegative(),
  slippage_bps: z.number().finite().nonnegative(),
  fee_per_unit: z.number().finite().nonnegative(),
  latency_ms: z.number().int().nonnegative(),
  deterministic: z.literal(true),
  same_candle_fill_allowed: z.literal(false),
  limitation_notes: z.array(NonEmptyStringSchema).min(1),
  reviewed_at: IsoDateTimeSchema
}).strict();

export const Gate2DeterministicFillResultContractSchema = Gate2LocalSimulatorBoundarySchema.extend({
  fill_result_id: IdentifierSchema,
  fill_model_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  side: Gate2SimulationSideSchema,
  quantity: z.number().finite().positive(),
  fill_price: z.number().finite().positive(),
  notional: MoneySchema,
  fee_amount: MoneySchema,
  calculation_formula: z.literal("reference_price_with_spread_slippage_bps"),
  calculated_at: IsoDateTimeSchema
}).strict();

export const Gate2SimulationCandidateGuardContractSchema = Gate2LocalSimulatorBoundarySchema.extend(
  {
    candidate_guard_id: IdentifierSchema,
    simulated_order_record_id: IdentifierSchema,
    candidate_fingerprint: NonEmptyStringSchema,
    observed_at: IsoDateTimeSchema,
    evaluated_at: IsoDateTimeSchema,
    max_candidate_age_seconds: z.number().int().positive(),
    prior_fingerprints: z.array(NonEmptyStringSchema),
    guard_status: z.enum(["clear_for_local_simulation", "blocked"]),
    blocking_reasons: z.array(z.enum(["duplicate_candidate", "stale_candidate"])),
    operator_required: z.literal(true)
  }
)
  .strict()
  .superRefine((guard, context) => {
    if (guard.guard_status === "blocked" && guard.blocking_reasons.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked candidate guards require blocking reasons",
        path: ["blocking_reasons"]
      });
    }
    if (guard.guard_status === "clear_for_local_simulation" && guard.blocking_reasons.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "clear candidate guards cannot contain blocking reasons",
        path: ["blocking_reasons"]
      });
    }
  });

export const Gate2SimulationJournalEventTypeSchema = z.enum([
  "candidate_checked",
  "risk_reviewed",
  "operator_decided",
  "simulation_recorded",
  "simulation_blocked",
  "state_reconciled",
  "state_mismatch"
]);

export const Gate2SimulationJournalEventDraftSchema = z
  .object({
    journal_id: IdentifierSchema,
    event_id: IdentifierSchema,
    sequence: z.number().int().positive(),
    event_type: Gate2SimulationJournalEventTypeSchema,
    paper_account_id: IdentifierSchema,
    simulated_order_record_id: IdentifierSchema,
    risk_review_event_id: IdentifierSchema,
    operator_action_log_id: IdentifierSchema,
    payload_digest: NonEmptyStringSchema,
    occurred_at: IsoDateTimeSchema
  })
  .strict();

export const Gate2SimulationJournalEventContractSchema = Gate2LocalSimulatorBoundarySchema.extend({
  journal_id: IdentifierSchema,
  event_id: IdentifierSchema,
  sequence: z.number().int().positive(),
  event_type: Gate2SimulationJournalEventTypeSchema,
  paper_account_id: IdentifierSchema,
  simulated_order_record_id: IdentifierSchema,
  risk_review_event_id: IdentifierSchema,
  operator_action_log_id: IdentifierSchema,
  payload_digest: NonEmptyStringSchema,
  previous_event_hash: NonEmptyStringSchema,
  event_hash: NonEmptyStringSchema,
  immutable: z.literal(true),
  occurred_at: IsoDateTimeSchema
}).strict();

export const Gate2PaperAccountReconciliationContractSchema =
  Gate2LocalSimulatorBoundarySchema.extend({
    reconciliation_id: IdentifierSchema,
    paper_account_id: IdentifierSchema,
    expected_journal_tail_hash: NonEmptyStringSchema,
    observed_journal_tail_hash: NonEmptyStringSchema,
    expected_equity: MoneySchema,
    observed_equity: MoneySchema,
    expected_open_position_count: z.number().int().nonnegative(),
    observed_open_position_count: z.number().int().nonnegative(),
    reconciliation_status: z.enum(["reconciled", "mismatch"]),
    mismatch_reasons: z.array(
      z.enum(["journal_tail_mismatch", "equity_mismatch", "position_count_mismatch"])
    ),
    readonly_emergency_required: z.boolean(),
    reconciled_at: IsoDateTimeSchema
  })
    .strict()
    .superRefine((result, context) => {
      if (result.reconciliation_status === "mismatch" && result.mismatch_reasons.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "reconciliation mismatches require reasons",
          path: ["mismatch_reasons"]
        });
      }
      if (result.reconciliation_status === "reconciled" && result.mismatch_reasons.length > 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "reconciled account state cannot contain mismatch reasons",
          path: ["mismatch_reasons"]
        });
      }
      if (result.reconciliation_status === "mismatch" && !result.readonly_emergency_required) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "account mismatches require readonly emergency posture",
          path: ["readonly_emergency_required"]
        });
      }
    });

export type Gate2PaperPositionContract = z.infer<typeof Gate2PaperPositionContractSchema>;
export type Gate2PaperAccountContract = z.infer<typeof Gate2PaperAccountContractSchema>;
export type Gate2SimulatedOrderLifecycleEventContract = z.infer<
  typeof Gate2SimulatedOrderLifecycleEventContractSchema
>;
export type Gate2PaperRiskLimitPolicyContract = z.infer<
  typeof Gate2PaperRiskLimitPolicyContractSchema
>;
export type Gate2PaperRiskSnapshotContract = z.infer<typeof Gate2PaperRiskSnapshotContractSchema>;
export type Gate2PaperRiskBreach = z.infer<typeof Gate2PaperRiskBreachSchema>;
export type Gate2PaperRiskEvaluationContract = z.infer<
  typeof Gate2PaperRiskEvaluationContractSchema
>;
export type Gate2DeterministicFillModelContract = z.infer<
  typeof Gate2DeterministicFillModelContractSchema
>;
export type Gate2DeterministicFillResultContract = z.infer<
  typeof Gate2DeterministicFillResultContractSchema
>;
export type Gate2SimulationCandidateGuardContract = z.infer<
  typeof Gate2SimulationCandidateGuardContractSchema
>;
export type Gate2SimulationJournalEventType = z.infer<typeof Gate2SimulationJournalEventTypeSchema>;
export type Gate2SimulationJournalEventDraft = z.infer<
  typeof Gate2SimulationJournalEventDraftSchema
>;
export type Gate2SimulationJournalEventContract = z.infer<
  typeof Gate2SimulationJournalEventContractSchema
>;
export type Gate2PaperAccountReconciliationContract = z.infer<
  typeof Gate2PaperAccountReconciliationContractSchema
>;
