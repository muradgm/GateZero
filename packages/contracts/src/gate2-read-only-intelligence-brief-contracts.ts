import { z } from "zod";
import {
  Gate2AdversarialScenarioReviewSchema,
  Gate2ConditionalScenarioSetSchema,
  Gate2EvidenceQualityAssessmentSchema,
  Gate2LocalReplaySourceEnvelopeSchema,
  Gate2MarketIntelligenceBoundarySchema,
  Gate2MultiTimeframeEvidenceAssemblySchema
} from "./gate2-market-intelligence-foundation-contracts.js";

const IdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9][a-z0-9-]*$/);
const NonEmptyStringSchema = z.string().trim().min(1);
const IsoDateTimeSchema = z.string().datetime({ offset: true });
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const Gate2ReadOnlyIntelligenceBriefSchema = Gate2MarketIntelligenceBoundarySchema.extend({
  brief_id: IdentifierSchema,
  linked_research_case_id: IdentifierSchema,
  brief_status: z.literal("evidence_available"),
  source_inventory: z.array(Gate2LocalReplaySourceEnvelopeSchema).min(1),
  evidence_assembly: Gate2MultiTimeframeEvidenceAssemblySchema,
  quality_assessment: Gate2EvidenceQualityAssessmentSchema,
  scenario_set: Gate2ConditionalScenarioSetSchema,
  adversarial_review: Gate2AdversarialScenarioReviewSchema,
  cross_timeframe_conflicts: z.array(NonEmptyStringSchema),
  limitations: z.array(NonEmptyStringSchema).min(1),
  risk_review_status: z.literal("required"),
  operator_decision_status: z.literal("required"),
  blocked_scope_reminder: z.array(NonEmptyStringSchema).min(1),
  generated_at: IsoDateTimeSchema,
  content_sha256: Sha256Schema
})
  .strict()
  .superRefine((brief, context) => {
    const sourceIds = brief.source_inventory.map((source) => source.source_id);
    const scenarioDirections = brief.scenario_set.scenarios.map((scenario) => scenario.direction);

    if (new Set(sourceIds).size !== sourceIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "brief source ids must be unique",
        path: ["source_inventory"]
      });
    }

    if (
      brief.evidence_assembly.linked_research_case_id !== brief.linked_research_case_id ||
      brief.scenario_set.linked_research_case_id !== brief.linked_research_case_id
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "brief records must reference one research case",
        path: ["linked_research_case_id"]
      });
    }

    if (
      brief.quality_assessment.assembly_id !== brief.evidence_assembly.assembly_id ||
      brief.scenario_set.assembly_id !== brief.evidence_assembly.assembly_id ||
      brief.adversarial_review.scenario_set_id !== brief.scenario_set.scenario_set_id
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "brief evidence chain references must align"
      });
    }

    if (
      new Set(scenarioDirections).size !== 3 ||
      !(["bullish", "bearish", "neutral"] as const).every((direction) =>
        scenarioDirections.includes(direction)
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "brief must show bullish, bearish, and neutral scenarios together",
        path: ["scenario_set", "scenarios"]
      });
    }
  });

export type Gate2ReadOnlyIntelligenceBrief = z.infer<typeof Gate2ReadOnlyIntelligenceBriefSchema>;
