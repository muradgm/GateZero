import type { PipelineId } from "@eg/core";
import { EvaluationEngine } from "@eg/eval";
import { ModelRouter } from "@eg/model-router";
import { pipelineOrder, pipelines } from "@eg/pipelines";
import { checkOllama } from "@eg/provider";
import { ArtifactStore } from "@eg/store";
import { WorkflowEngine } from "@eg/workflow";
import { context, createManifest } from "./project.js";

const command = process.argv[2] ?? "help";
const workspaceRoot = process.cwd();
const store = new ArtifactStore(workspaceRoot);
const engine = new WorkflowEngine(
  store,
  new EvaluationEngine(),
  new ModelRouter()
);

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const projectId = arg("--project") ?? context.projectId;

async function manifest() {
  try {
    return await store.loadManifest(projectId);
  } catch {
    const next = createManifest();
    await store.saveManifest(projectId, next);
    return next;
  }
}

async function run() {
  const state = await manifest();
  const requested = arg("--pipeline") as PipelineId | undefined;
  const queue = requested ? [requested] : pipelineOrder;

  for (const id of queue) {
    const current = state.pipelines[id];

    if (current.status === "approved") {
      console.log(`✓ ${id} already approved`);
      continue;
    }

    if (current.status === "review") {
      console.log(`⏸ ${id} awaits approval. Run: pnpm approve`);
      return;
    }

    const result = await engine.run(pipelines[id], context, state);
    console.log(result.summary);
    console.log(`Status: ${result.status}`);
    console.log(`Artifacts: ${result.stages.length}`);
    console.log("Approve with: pnpm approve");
    return;
  }

  console.log("✓ All nine pipelines are approved.");
}

async function approve() {
  const state = await manifest();
  const requested = arg("--pipeline") as PipelineId | undefined;
  const id =
    requested ??
    pipelineOrder.find(item => state.pipelines[item].status === "review");

  if (!id) {
    console.log("No pipeline is awaiting approval.");
    return;
  }

  if (state.pipelines[id].status !== "review") {
    throw new Error(`${id} is not awaiting review.`);
  }

  const promoted = await store.promotePipeline(
    projectId,
    id,
    state.pipelines[id].artifacts
  );

  state.pipelines[id].artifacts = promoted;
  state.pipelines[id].status = "approved";
  state.pipelines[id].approvedAt = new Date().toISOString();
  state.project.updatedAt = new Date().toISOString();
  await store.saveManifest(projectId, state);

  console.log(`✓ Approved ${id}`);
  console.log(`✓ Promoted ${promoted.length} artifact(s) to projects/${projectId}/approved/${id}`);
}

async function status() {
  const state = await manifest();
  console.table(
    pipelineOrder.map(id => ({
      pipeline: id,
      status: state.pipelines[id].status,
      score: state.pipelines[id].score ?? "-",
      artifacts: state.pipelines[id].artifacts.length
    }))
  );
}

async function reset() {
  await store.clearDrafts(projectId);
  await store.saveManifest(projectId, createManifest());
  console.log(`✓ Reset ${projectId} drafts and workflow state`);
  console.log("Approved artifacts were preserved.");
}

async function doctor() {
  console.log("Evidence Gate doctor\n");
  console.log(`Workspace: ${workspaceRoot}`);
  console.log(`Provider: ${process.env.EG_PROVIDER ?? "ollama"}`);

  const result = await checkOllama();
  if (!result.ok) {
    console.error(`✗ Ollama unavailable: ${result.error}`);
    process.exitCode = 1;
    return;
  }

  console.log("✓ Ollama is reachable");
  console.log(`Models: ${result.models.join(", ") || "none"}`);

  const required = [
    process.env.OLLAMA_DEFAULT_MODEL ?? "qwen3:8b",
    process.env.OLLAMA_CODER_MODEL ?? "qwen2.5-coder:7b"
  ];

  for (const model of required) {
    const found = result.models.some(name => name === model || name.startsWith(`${model}:`));
    console.log(`${found ? "✓" : "✗"} ${model}`);
  }
}

function help() {
  console.log(`
Evidence Gate Agent Pipelines

Commands:
  pnpm run doctor
  pnpm run:demo
  pnpm approve
  pnpm status
  pnpm reset

Optional:
  pnpm dev -- run --pipeline concept-art
  pnpm dev -- approve --pipeline concept-art
`);
}

switch (command) {
  case "run":
    await run();
    break;
  case "approve":
    await approve();
    break;
  case "status":
    await status();
    break;
  case "reset":
    await reset();
    break;
  case "doctor":
    await doctor();
    break;
  default:
    help();
}
