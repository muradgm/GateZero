import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  ArtifactKind,
  ArtifactReference,
  PipelineId,
  ProjectManifest
} from "@eg/core";

export class ArtifactStore {
  constructor(private readonly workspaceRoot: string) {}

  private projectDir(projectId: string): string {
    return path.join(this.workspaceRoot, "projects", projectId);
  }

  async saveArtifact(input: {
    projectId: string;
    pipelineId: PipelineId;
    stageId: string;
    name: string;
    kind: ArtifactKind;
    content: unknown;
  }): Promise<ArtifactReference> {
    const directory = path.join(
      this.projectDir(input.projectId),
      "artifacts",
      input.pipelineId
    );
    await mkdir(directory, { recursive: true });

    const extension = input.kind === "markdown" ? "md" : "json";
    const filePath = path.join(directory, `${input.name}.${extension}`);
    const content =
      typeof input.content === "string"
        ? input.content
        : JSON.stringify(input.content, null, 2);

    await writeFile(filePath, content, "utf8");

    return {
      id: `${input.pipelineId}:${input.stageId}:${input.name}`,
      pipelineId: input.pipelineId,
      stageId: input.stageId,
      name: input.name,
      kind: input.kind,
      path: filePath,
      version: 1,
      createdAt: new Date().toISOString()
    };
  }

  async saveManifest(projectId: string, manifest: ProjectManifest): Promise<void> {
    const directory = this.projectDir(projectId);
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      "utf8"
    );
  }

  async loadManifest(projectId: string): Promise<ProjectManifest> {
    const raw = await readFile(
      path.join(this.projectDir(projectId), "manifest.json"),
      "utf8"
    );
    return JSON.parse(raw) as ProjectManifest;
  }
}
