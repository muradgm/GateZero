import { z } from "zod";
import {
  STRATEGY_DECISION_TRACE_EVENT_ORDER,
  StrategyReviewBundleSchema,
  type StrategyReviewBundle
} from "../../contracts/src/index.js";
import { assertCanonicalStrategyDecisionTraceHashes } from "./trace-hashing.js";

export const Gate0DryRunOperatorChecklistStatusSchema = z.enum(["complete", "blocked"]);

export const Gate0DryRunOperatorChecklistItemIdSchema = z.enum([
  "gate_scope_check",
  "loop_order_check",
  "trace_hash_check",
  "risk_revision_check",
  "operator_outcome_check",
  "learning_boundary_check"
]);

export const Gate0DryRunOperatorChecklistInputSchema = z
  .object({
    scenario_id: z.string().trim().min(1),
    name: z.string().trim().min(1).optional(),
    expected_loop_steps: z.array(z.string().trim().min(1)),
    bundle: StrategyReviewBundleSchema
  })
  .strict();

export const Gate0DryRunOperatorChecklistItemSchema = z
  .object({
    item_id: Gate0DryRunOperatorChecklistItemIdSchema,
    status: Gate0DryRunOperatorChecklistStatusSchema,
    evidence: z.string().trim().min(1)
  })
  .strict();

export const Gate0DryRunOperatorChecklistSchema = z
  .object({
    scenario_id: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    bundle_id: z.string().trim().min(1),
    checklist_status: Gate0DryRunOperatorChecklistStatusSchema,
    item_count: z.number().int().nonnegative(),
    complete_count: z.number().int().nonnegative(),
    blocked_count: z.number().int().nonnegative(),
    items: z.array(Gate0DryRunOperatorChecklistItemSchema)
  })
  .strict()
  .superRefine((checklist, context) => {
    if (checklist.item_count !== checklist.items.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "item_count must match items length",
        path: ["item_count"]
      });
    }

    const completeCount = checklist.items.filter((item) => item.status === "complete").length;
    const blockedCount = checklist.items.filter((item) => item.status === "blocked").length;

    if (checklist.complete_count !== completeCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "complete_count must match complete items",
        path: ["complete_count"]
      });
    }

    if (checklist.blocked_count !== blockedCount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked_count must match blocked items",
        path: ["blocked_count"]
      });
    }

    const expectedStatus = blockedCount === 0 ? "complete" : "blocked";

    if (checklist.checklist_status !== expectedStatus) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "checklist_status must reflect item statuses",
        path: ["checklist_status"]
      });
    }
  });

export interface Gate0DryRunOperatorChecklistInput {
  readonly scenario_id: string;
  readonly name?: string;
  readonly expected_loop_steps: readonly string[];
  readonly bundle: StrategyReviewBundle;
}
export type Gate0DryRunOperatorChecklistItem = z.infer<
  typeof Gate0DryRunOperatorChecklistItemSchema
>;
export type Gate0DryRunOperatorChecklist = z.infer<typeof Gate0DryRunOperatorChecklistSchema>;

export function createGate0DryRunOperatorChecklist(
  input: Gate0DryRunOperatorChecklistInput
): Gate0DryRunOperatorChecklist {
  const parsedInput = Gate0DryRunOperatorChecklistInputSchema.parse(input);
  const items = createChecklistItems(parsedInput.expected_loop_steps, parsedInput.bundle);
  const completeCount = items.filter((item) => item.status === "complete").length;
  const blockedCount = items.length - completeCount;

  return Gate0DryRunOperatorChecklistSchema.parse({
    scenario_id: parsedInput.scenario_id,
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    bundle_id: parsedInput.bundle.strategy_review_bundle_id,
    checklist_status: blockedCount === 0 ? "complete" : "blocked",
    item_count: items.length,
    complete_count: completeCount,
    blocked_count: blockedCount,
    items
  });
}

function createChecklistItems(
  expectedLoopSteps: readonly string[],
  bundle: StrategyReviewBundle
): readonly Gate0DryRunOperatorChecklistItem[] {
  return [
    createChecklistItem(
      "gate_scope_check",
      bundle.financial_gate === "G0_RESEARCH" && bundle.trace.financial_gate === "G0_RESEARCH",
      `${bundle.financial_gate}:${bundle.trace.financial_gate}`
    ),
    createChecklistItem(
      "loop_order_check",
      loopStepsMatch(expectedLoopSteps, bundle),
      `${bundle.trace.events.length} trace events`
    ),
    createChecklistItem(
      "trace_hash_check",
      hasCanonicalTraceHashes(bundle),
      `${bundle.trace.events.length} trace hashes checked`
    ),
    createChecklistItem(
      "risk_revision_check",
      bundle.risk_review.verdict === "requires_revision" &&
        !bundle.risk_review.approved &&
        bundle.risk_review.blocking_findings.length > 0,
      `${bundle.risk_review.verdict}:${bundle.risk_review.approved}`
    ),
    createChecklistItem(
      "operator_outcome_check",
      bundle.operator_decision.decision === "revise" &&
        bundle.outcome_log.outcome === "revision_requested",
      `${bundle.operator_decision.decision}:${bundle.outcome_log.outcome}`
    ),
    createChecklistItem(
      "learning_boundary_check",
      bundle.learning_event.risk_limit_change === "none" &&
        bundle.learning_event.autonomy_change === "none",
      `${bundle.learning_event.risk_limit_change}:${bundle.learning_event.autonomy_change}`
    )
  ];
}

function loopStepsMatch(
  expectedLoopSteps: readonly string[],
  bundle: StrategyReviewBundle
): boolean {
  const traceSteps = bundle.trace.events.map((event) => event.event_type);

  return (
    JSON.stringify(expectedLoopSteps) === JSON.stringify(STRATEGY_DECISION_TRACE_EVENT_ORDER) &&
    JSON.stringify(traceSteps) === JSON.stringify(STRATEGY_DECISION_TRACE_EVENT_ORDER)
  );
}

function hasCanonicalTraceHashes(bundle: StrategyReviewBundle): boolean {
  try {
    assertCanonicalStrategyDecisionTraceHashes(bundle.trace);
    return true;
  } catch {
    return false;
  }
}

function createChecklistItem(
  itemId: Gate0DryRunOperatorChecklistItem["item_id"],
  passed: boolean,
  evidence: string
): Gate0DryRunOperatorChecklistItem {
  return Gate0DryRunOperatorChecklistItemSchema.parse({
    item_id: itemId,
    status: passed ? "complete" : "blocked",
    evidence
  });
}
