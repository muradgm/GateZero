import { z } from "zod";
import { NonEmptyStringSchema } from "./schemas.js";

export const DecisionPipelineStageSchema = z.enum([
  "research_case",
  "market_context",
  "evidence_assessment",
  "setup_review",
  "intelligence_report",
  "risk_review",
  "operator_decision",
  "paper_simulation",
  "outcome",
  "learning"
]);

export const DecisionPipelineStageRecordSchema = z
  .object({
    stage: DecisionPipelineStageSchema,
    status: z.enum(["pending", "ready", "completed", "blocked", "not_applicable"]),
    recordId: NonEmptyStringSchema.optional(),
    completedAt: z.string().datetime().optional(),
    blockers: z.array(NonEmptyStringSchema),
    evidenceIds: z.array(NonEmptyStringSchema)
  })
  .strict()
  .superRefine((data, context) => {
    if (data.status === "completed" && (!data.recordId || !data.completedAt)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "completed stages require a record and completion time",
        path: ["recordId"]
      });
    }
    if (data.status === "blocked" && data.blockers.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "blocked stages require at least one blocker",
        path: ["blockers"]
      });
    }
  });

export const DecisionPipelineSchema = z
  .object({
    schemaVersion: z.literal(1),
    pipelineId: NonEmptyStringSchema,
    researchCaseId: NonEmptyStringSchema,
    instrument: NonEmptyStringSchema,
    gate: z.literal("G2_PAPER_TRADING"),
    scope: z.literal("paper_simulation_planning_only"),
    currentStage: DecisionPipelineStageSchema,
    stages: z.array(DecisionPipelineStageRecordSchema).length(10),
    recommendation: z.enum(["REJECT", "WATCH", "PAPER_SIMULATE"]).optional(),
    operatorRequired: z.literal(true),
    riskReviewRequired: z.literal(true),
    externalAccess: z.literal(false),
    executionPath: z.literal(false),
    automatedAction: z.literal(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  })
  .strict()
  .superRefine((data, context) => {
    const stageNames = data.stages.map((stage) => stage.stage);
    const expected = DecisionPipelineStageSchema.options;
    if (new Set(stageNames).size !== expected.length || expected.some((stage) => !stageNames.includes(stage))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "pipeline must contain each decision stage exactly once",
        path: ["stages"]
      });
    }

    const current = data.stages.find((stage) => stage.stage === data.currentStage);
    if (!current || current.status === "completed" || current.status === "not_applicable") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "current stage must be pending, ready, or blocked",
        path: ["currentStage"]
      });
    }
  });

export type DecisionPipelineStage = z.infer<typeof DecisionPipelineStageSchema>;
export type DecisionPipelineStageRecord = z.infer<typeof DecisionPipelineStageRecordSchema>;
export type DecisionPipeline = z.infer<typeof DecisionPipelineSchema>;
