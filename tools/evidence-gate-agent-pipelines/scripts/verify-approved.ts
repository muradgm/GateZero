import { access, readFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";

const workspaceRoot = process.cwd();
const projectRoot = resolve(
  workspaceRoot,
  "projects/traderframe-evidence-gate",
);
const manifestPath = resolve(projectRoot, "manifest.json");

const expectedPipelines = [
  "strategy",
  "concept-art",
  "storyboard",
  "design-system",
  "modeling-3d",
  "animation",
  "shader-vfx",
  "implementation",
  "qa",
] as const;

type Artifact = {
  id?: string;
  path?: string;
  pipelineId?: string;
};

type PipelineState = {
  status?: string;
  artifacts?: Artifact[];
};

type Manifest = {
  pipelineOrder?: string[];
  pipelines?: Record<string, PipelineState>;
};

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function toPortablePath(input: string): string {
  if (!isAbsolute(input)) return input.replaceAll("\\", "/");

  const normalized = input.replaceAll("\\", "/");
  const marker = "/projects/traderframe-evidence-gate/";
  const markerIndex = normalized.toLowerCase().indexOf(marker);

  if (markerIndex === -1) return input;
  return normalized.slice(markerIndex + 1);
}

async function main(): Promise<void> {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
  const pipelines = manifest.pipelines ?? {};
  const errors: string[] = [];
  const artifactIds = new Set<string>();
  let artifactCount = 0;

  for (const pipelineId of expectedPipelines) {
    const pipeline = pipelines[pipelineId];
    if (!pipeline) {
      errors.push(`Missing pipeline: ${pipelineId}`);
      continue;
    }

    if (pipeline.status !== "approved") {
      errors.push(`${pipelineId} is ${pipeline.status ?? "missing status"}, not approved`);
    }

    for (const artifact of pipeline.artifacts ?? []) {
      artifactCount += 1;

      if (!artifact.id) {
        errors.push(`${pipelineId} contains an artifact without an id`);
      } else if (artifactIds.has(artifact.id)) {
        errors.push(`Duplicate artifact id: ${artifact.id}`);
      } else {
        artifactIds.add(artifact.id);
      }

      if (!artifact.path) {
        errors.push(`${artifact.id ?? pipelineId} has no path`);
        continue;
      }

      if (isAbsolute(artifact.path)) {
        errors.push(`${artifact.id ?? pipelineId} uses an absolute path: ${artifact.path}`);
        continue;
      }

      const portablePath = toPortablePath(artifact.path);
      if (portablePath.includes("/drafts/") || portablePath.includes("\\drafts\\")) {
        errors.push(`${artifact.id ?? pipelineId} points to a draft artifact`);
      }

      const absoluteArtifactPath = resolve(workspaceRoot, portablePath);
      const relativeToWorkspace = relative(workspaceRoot, absoluteArtifactPath);
      if (relativeToWorkspace.startsWith(`..${sep}`) || relativeToWorkspace === "..") {
        errors.push(`${artifact.id ?? pipelineId} escapes the workspace`);
        continue;
      }

      try {
        await access(absoluteArtifactPath);
      } catch {
        errors.push(`${artifact.id ?? pipelineId} references a missing file: ${portablePath}`);
      }
    }
  }

  const order = manifest.pipelineOrder ?? [];
  if (JSON.stringify(order) !== JSON.stringify(expectedPipelines)) {
    errors.push("pipelineOrder does not match the required nine-stage order");
  }

  if (errors.length > 0) {
    console.error("Approved artifact verification failed:\n");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("Approved artifact verification passed");
  console.log(`Pipelines: ${expectedPipelines.length}`);
  console.log(`Artifacts: ${artifactCount}`);
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
