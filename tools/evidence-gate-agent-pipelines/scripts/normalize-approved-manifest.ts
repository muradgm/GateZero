import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, resolve } from "node:path";

const workspaceRoot = process.cwd();
const projectId = "traderframe-evidence-gate";
const projectRoot = resolve(workspaceRoot, "projects", projectId);
const manifestPath = resolve(projectRoot, "manifest.json");

type Artifact = {
  path?: string;
  pipelineId?: string;
  [key: string]: unknown;
};

type PipelineState = {
  status?: string;
  artifacts?: Artifact[];
  [key: string]: unknown;
};

type Manifest = {
  project?: { updatedAt?: string; [key: string]: unknown };
  pipelines?: Record<string, PipelineState>;
  [key: string]: unknown;
};

function slash(value: string): string {
  return value.replaceAll("\\", "/");
}

function extractProjectRelativePath(value: string): string | null {
  const normalized = slash(value);
  const marker = `/projects/${projectId}/`;
  const index = normalized.toLowerCase().indexOf(marker);
  if (index === -1) return null;
  return normalized.slice(index + 1);
}

async function main(): Promise<void> {
  const original = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(original) as Manifest;
  const pipelines = manifest.pipelines ?? {};
  let normalizedCount = 0;
  let migratedCount = 0;

  for (const [pipelineId, pipeline] of Object.entries(pipelines)) {
    if (pipeline.status !== "approved") continue;

    for (const artifact of pipeline.artifacts ?? []) {
      if (!artifact.path) continue;

      const extracted = isAbsolute(artifact.path)
        ? extractProjectRelativePath(artifact.path)
        : slash(artifact.path);

      if (!extracted) {
        throw new Error(`Cannot normalize artifact path: ${artifact.path}`);
      }

      let portablePath = extracted;
      const legacyPrefix = `projects/${projectId}/artifacts/${pipelineId}/`;
      if (portablePath.startsWith(legacyPrefix)) {
        const approvedPath = `projects/${projectId}/approved/${pipelineId}/${basename(portablePath)}`;
        const sourcePath = resolve(workspaceRoot, portablePath);
        const destinationPath = resolve(workspaceRoot, approvedPath);
        await mkdir(dirname(destinationPath), { recursive: true });
        await copyFile(sourcePath, destinationPath);
        portablePath = approvedPath;
        migratedCount += 1;
      }

      if (artifact.path !== portablePath) {
        artifact.path = portablePath;
        normalizedCount += 1;
      }
    }
  }

  const changed = normalizedCount > 0 || migratedCount > 0;
  if (changed) {
    if (manifest.project) manifest.project.updatedAt = new Date().toISOString();
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  console.log(changed ? "Approved manifest normalized" : "Approved manifest already normalized");
  console.log(`Paths normalized: ${normalizedCount}`);
  console.log(`Legacy artifacts migrated: ${migratedCount}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
