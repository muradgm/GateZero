import type {
  PipelineDefinition,
  PipelineResult,
  ProjectContext,
  ProjectManifest,
  StageResult
} from "@eg/core";
import { EvaluationEngine } from "@eg/eval";
import { ModelRouter } from "@eg/model-router";
import { ArtifactStore } from "@eg/store";

export class WorkflowEngine {
  constructor(
    private readonly store: ArtifactStore,
    private readonly evaluator: EvaluationEngine,
    private readonly router: ModelRouter
  ) {}

  async run(
    definition: PipelineDefinition,
    context: ProjectContext,
    manifest: ProjectManifest
  ): Promise<PipelineResult> {
    const blocked = definition.dependencies.filter(
      id => manifest.pipelines[id].status !== "approved"
    );

    if (blocked.length > 0) {
      throw new Error(
        `${definition.name} is blocked. Approve first: ${blocked.join(", ")}`
      );
    }

    const state = manifest.pipelines[definition.id];
    state.status = "running";
    manifest.project.updatedAt = new Date().toISOString();
    await this.store.saveManifest(context.projectId, manifest);

    const stages: StageResult[] = [];

    for (const [index, stage] of definition.stages.entries()) {
  console.log(
    `\n[${index + 1}/${definition.stages.length}] ${definition.name} → ${stage.name}`
  );

  state.currentStage = stage.id;
      await this.store.saveManifest(context.projectId, manifest);

      const provider = this.router.route(definition.id);
      
      console.log(`Using model: ${provider.id}`);
      console.log("Generating...");
      const startedAt = Date.now();

      const raw = await provider.complete({
        system: [
          `You are the ${definition.name}.`,
          definition.purpose,
          "Respect approved upstream decisions.",
          "Return implementation-ready work.",
          "Do not invent unsupported product facts."
        ].join(" "),
        prompt: [
          `Project: ${context.productName}`,
          `Product: ${context.productDescription}`,
          `Audience: ${context.targetAudience.join(", ")}`,
          `Business goal: ${context.businessGoal}`,
          `Core message: ${context.coreMessage}`,
          `Brand principles: ${context.brandPrinciples.join(", ")}`,
          `Stage: ${stage.name}`,
          `Objective: ${stage.objective}`
        ].join("\n"),
        responseFormat: stage.outputKind === "markdown" ? "markdown" : "json",
        temperature: 0.4
      }); const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);

      console.log(`✓ Generated in ${durationSeconds}s`);

      let output: unknown = raw;
      if (stage.outputKind !== "markdown") {
        try {
          output = JSON.parse(raw);
        } catch {
          output = {
            raw,
            warning: "Provider returned invalid JSON. Preserved as raw text."
          };
        }
      }

      const artifact = await this.store.saveArtifact({
        projectId: context.projectId,
        pipelineId: definition.id,
        stageId: stage.id,
        name: stage.outputName,
        kind: stage.outputKind,
        content: output
      });

      stages.push({
        stageId: stage.id,
        summary: `${stage.name} completed with ${provider.id}.`,
        output,
        artifacts: [artifact],
        assumptions: ["Approved upstream artifacts remain authoritative."],
        risks: ["Human review is required before approval."]
      });

      state.artifacts.push(artifact);
    }

    const evaluation = this.evaluator.evaluate(
      definition.id,
      stages,
      definition.qualityThreshold
    );

    state.score = evaluation.score;
    state.status = evaluation.passed ? "review" : "failed";
    delete state.currentStage;
    manifest.project.updatedAt = new Date().toISOString();
    await this.store.saveManifest(context.projectId, manifest);

    return {
      pipelineId: definition.id,
      status: state.status,
      summary: `${definition.name} completed with score ${evaluation.score}.`,
      stages,
      evaluation,
      requiresHumanApproval: definition.humanApprovalRequired
    };
  }
}
