import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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

  private draftDir(projectId: string, pipelineId: PipelineId): string {
    return path.join(this.projectDir(projectId), "drafts", pipelineId);
  }

  private approvedDir(projectId: string, pipelineId: PipelineId): string {
    return path.join(this.projectDir(projectId), "approved", pipelineId);
  }

  async saveArtifact(input: {
    projectId: string;
    pipelineId: PipelineId;
    stageId: string;
    name: string;
    kind: ArtifactKind;
    content: unknown;
  }): Promise<ArtifactReference> {
    const directory = this.draftDir(input.projectId, input.pipelineId);
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

  async promotePipeline(
    projectId: string,
    pipelineId: PipelineId,
    artifacts: ArtifactReference[]
  ): Promise<ArtifactReference[]> {
    const directory = this.approvedDir(projectId, pipelineId);
    await mkdir(directory, { recursive: true });

    const promoted: ArtifactReference[] = [];

    for (const artifact of artifacts) {
      const extension = artifact.kind === "markdown" ? "md" : "json";
      const destination = path.join(directory, `${artifact.name}.${extension}`);
      await copyFile(artifact.path, destination);

      promoted.push({
        ...artifact,
        path: destination,
        version: artifact.version + 1,
        createdAt: new Date().toISOString()
      });
    }

    return promoted;
  }

  async clearDrafts(projectId: string): Promise<void> {
    await rm(path.join(this.projectDir(projectId), "drafts"), {
      recursive: true,
      force: true
    });
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
