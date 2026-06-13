import { z } from "zod";
import {
  Gate0DryRunChecklistSummarySchema,
  summarizeGate0DryRunOperatorChecklist
} from "./gate0-dry-run-checklist-summary.js";
import {
  Gate0DryRunFrictionReportSchema,
  createGate0DryRunFrictionReport
} from "./gate0-dry-run-friction-report.js";
import {
  Gate0DryRunIterationRecommendationSchema,
  createGate0DryRunIterationRecommendation
} from "./gate0-dry-run-iteration-recommendation.js";
import {
  createGate0DryRunOperatorChecklist,
  type Gate0DryRunOperatorChecklistInput
} from "./gate0-dry-run-operator-checklist.js";

export const Gate0DryRunInspectResultSchema = z
  .object({
    inspection_id: z.string().trim().min(1),
    scenario_id: z.string().trim().min(1),
    financial_gate: z.literal("G0_RESEARCH"),
    scope: z.literal("research_only"),
    bundle_id: z.string().trim().min(1),
    inspect_status: z.enum(["clear", "friction_found"]),
    checklist_summary: Gate0DryRunChecklistSummarySchema,
    friction_report: Gate0DryRunFrictionReportSchema,
    iteration_recommendation: Gate0DryRunIterationRecommendationSchema
  })
  .strict();

export type Gate0DryRunInspectResult = z.infer<typeof Gate0DryRunInspectResultSchema>;

export function createGate0DryRunInspectResult(
  input: Gate0DryRunOperatorChecklistInput
): Gate0DryRunInspectResult {
  const checklist = createGate0DryRunOperatorChecklist(input);
  const checklistSummary = summarizeGate0DryRunOperatorChecklist(checklist);
  const frictionReport = createGate0DryRunFrictionReport(checklistSummary);
  const iterationRecommendation = createGate0DryRunIterationRecommendation(frictionReport);

  return Gate0DryRunInspectResultSchema.parse({
    inspection_id: `${checklist.scenario_id}:gate0-dry-run-inspect`,
    scenario_id: checklist.scenario_id,
    financial_gate: "G0_RESEARCH",
    scope: "research_only",
    bundle_id: checklist.bundle_id,
    inspect_status: frictionReport.report_status,
    checklist_summary: checklistSummary,
    friction_report: frictionReport,
    iteration_recommendation: iterationRecommendation
  });
}
