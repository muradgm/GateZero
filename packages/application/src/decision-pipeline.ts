import {
  ContractValidationError,
  DecisionPipelineSchema,
  DecisionPipelineStageSchema,
  type DecisionPipeline,
  type DecisionPipelineStage
} from "@traderframe/contracts";

const orderedStages = [...DecisionPipelineStageSchema.options];

export interface CreateDecisionPipelineCommand {
  readonly pipelineId: string;
  readonly researchCaseId: string;
  readonly instrument: string;
  readonly researchCaseRecordId: string;
  readonly now: string;
}

export interface CompleteDecisionPipelineStageCommand {
  readonly stage: DecisionPipelineStage;
  readonly recordId: string;
  readonly evidenceIds: readonly string[];
  readonly completedAt: string;
  readonly recommendation?: "REJECT" | "WATCH" | "PAPER_SIMULATE";
}

export function createDecisionPipeline(command: CreateDecisionPipelineCommand): DecisionPipeline {
  return DecisionPipelineSchema.parse({
    schemaVersion: 1,
    pipelineId: command.pipelineId,
    researchCaseId: command.researchCaseId,
    instrument: command.instrument,
    gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    currentStage: "market_context",
    stages: orderedStages.map((stage) => ({
      stage,
      status: stage === "research_case" ? "completed" : stage === "market_context" ? "ready" : "pending",
      recordId: stage === "research_case" ? command.researchCaseRecordId : undefined,
      completedAt: stage === "research_case" ? command.now : undefined,
      blockers: [],
      evidenceIds: stage === "research_case" ? [command.researchCaseRecordId] : []
    })),
    operatorRequired: true,
    riskReviewRequired: true,
    externalAccess: false,
    executionPath: false,
    automatedAction: false,
    createdAt: command.now,
    updatedAt: command.now
  });
}

export function completeDecisionPipelineStage(
  pipeline: DecisionPipeline,
  command: CompleteDecisionPipelineStageCommand
): DecisionPipeline {
  if (pipeline.currentStage !== command.stage) {
    throw new ContractValidationError(
      `cannot complete ${command.stage}; current stage is ${pipeline.currentStage}`
    );
  }

  const index = orderedStages.indexOf(command.stage);
  const nextStage = orderedStages[index + 1];
  const terminalRecommendation = command.stage === "operator_decision" ? command.recommendation : pipeline.recommendation;

  if (command.stage === "operator_decision" && !command.recommendation) {
    throw new ContractValidationError("operator decision stage requires a bounded recommendation");
  }

  const stages = pipeline.stages.map((stage) => {
    if (stage.stage === command.stage) {
      return {
        ...stage,
        status: "completed" as const,
        recordId: command.recordId,
        completedAt: command.completedAt,
        evidenceIds: [...command.evidenceIds],
        blockers: []
      };
    }
    if (nextStage && stage.stage === nextStage) {
      const notApplicable = terminalRecommendation !== "PAPER_SIMULATE" && nextStage === "paper_simulation";
      return {
        ...stage,
        status: notApplicable ? ("not_applicable" as const) : ("ready" as const)
      };
    }
    return stage;
  });

  let currentStage = nextStage;
  if (terminalRecommendation !== "PAPER_SIMULATE" && nextStage === "paper_simulation") {
    currentStage = "outcome";
    const outcome = stages.find((stage) => stage.stage === "outcome");
    if (outcome) outcome.status = "ready";
  }

  if (!currentStage) {
    throw new ContractValidationError("learning is the terminal pipeline stage");
  }

  return DecisionPipelineSchema.parse({
    ...pipeline,
    currentStage,
    stages,
    recommendation: terminalRecommendation,
    updatedAt: command.completedAt
  });
}

export function blockDecisionPipelineStage(
  pipeline: DecisionPipeline,
  blockers: readonly string[],
  updatedAt: string
): DecisionPipeline {
  if (blockers.length === 0) {
    throw new ContractValidationError("blocking a pipeline stage requires at least one blocker");
  }

  return DecisionPipelineSchema.parse({
    ...pipeline,
    stages: pipeline.stages.map((stage) =>
      stage.stage === pipeline.currentStage
        ? { ...stage, status: "blocked", blockers: [...blockers] }
        : stage
    ),
    updatedAt
  });
}
