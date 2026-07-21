import { readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

const workspaceRoot = process.cwd();
const projectId = "traderframe-evidence-gate";
const projectRoot = resolve(workspaceRoot, "projects", projectId);
const manifestPath = resolve(projectRoot, "manifest.json");
const outputPath = resolve(projectRoot, "approved", "PRODUCTION-HANDOFF.md");

type Artifact = {
  id?: string;
  name?: string;
  kind?: string;
  path?: string;
  stageId?: string;
};

type PipelineState = {
  status?: string;
  score?: number;
  approvedAt?: string;
  artifacts?: Artifact[];
};

type Manifest = {
  project?: { id?: string; version?: string; updatedAt?: string };
  pipelineOrder?: string[];
  pipelines?: Record<string, PipelineState>;
};

const executionPurpose: Record<string, string> = {
  strategy: "Product positioning, audience, message hierarchy, narrative and strategic acceptance criteria.",
  "concept-art": "Approved visual metaphor, art direction, prompt pack and concept lock.",
  storyboard: "Narrative beats, interaction map, shot language, sequence and timing.",
  "design-system": "Tokens, components, responsive behavior and accessibility rules.",
  "modeling-3d": "Asset inventory, topology, materials, scene assembly and optimization constraints.",
  animation: "Motion vocabulary, camera choreography, interaction animation and reduced-motion behavior.",
  "shader-vfx": "Shader architecture, VFX behavior, performance budgets and fallback strategy.",
  implementation: "Application architecture, component plan, integration sequence and delivery package.",
  qa: "Functional, visual, accessibility, performance and release acceptance gates.",
};

function relativeArtifactLink(path: string): string {
  const normalized = path.replaceAll("\\", "/");
  const marker = `projects/${projectId}/approved/`;
  const index = normalized.indexOf(marker);
  return index === -1 ? normalized : `./${normalized.slice(index + marker.length)}`;
}

async function main(): Promise<void> {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;
  const order = manifest.pipelineOrder ?? [];
  const pipelines = manifest.pipelines ?? {};
  const generatedAt = new Date().toISOString();
  const artifactCount = order.reduce(
    (sum, pipelineId) => sum + (pipelines[pipelineId]?.artifacts?.length ?? 0),
    0,
  );

  const lines: string[] = [
    "# TraderFrame Evidence Gate — Production Handoff",
    "",
    "> Canonical execution index generated from the approved Evidence Gate manifest.",
    "",
    "## Baseline",
    "",
    `- Project: \`${manifest.project?.id ?? projectId}\``,
    `- Version: \`${manifest.project?.version ?? "unknown"}\``,
    `- Pipelines: \`${order.length}\``,
    `- Approved artifacts: \`${artifactCount}\``,
    `- Generated: \`${generatedAt}\``,
    "",
    "## Production rule",
    "",
    "The approved artifacts are the source of truth. Implementation may translate them into code and production assets, but must not silently change locked strategy, concept, interaction, motion, accessibility, performance or QA decisions. Any material deviation requires a recorded review and a new approved artifact version.",
    "",
    "## Execution sequence",
    "",
    "1. Lock product message and selected visual direction.",
    "2. Convert storyboard and design-system outputs into application structure.",
    "3. Build or source approved 3D assets under the stated geometry and performance budgets.",
    "4. Implement motion, shaders and reduced-motion fallbacks.",
    "5. Integrate into the GateZero experience application behind a reviewable feature boundary.",
    "6. Run deterministic functional, visual, accessibility and performance QA.",
    "7. Promote only after every release blocker in the approved QA package is closed.",
    "",
    "## Approved pipeline index",
    "",
  ];

  for (const [index, pipelineId] of order.entries()) {
    const pipeline = pipelines[pipelineId];
    const artifacts = pipeline?.artifacts ?? [];
    lines.push(`### ${index + 1}. ${pipelineId}`);
    lines.push("");
    lines.push(`- Status: \`${pipeline?.status ?? "missing"}\``);
    lines.push(`- Score: \`${pipeline?.score ?? "-"}\``);
    lines.push(`- Approved: \`${pipeline?.approvedAt ?? "unknown"}\``);
    lines.push(`- Production purpose: ${executionPurpose[pipelineId] ?? "Approved production specification."}`);
    lines.push("");
    lines.push("| Artifact | Stage | Kind | Source |" );
    lines.push("|---|---|---|---|");

    for (const artifact of artifacts) {
      const label = artifact.name ?? artifact.id ?? basename(artifact.path ?? "artifact");
      const link = artifact.path ? relativeArtifactLink(artifact.path) : "";
      const source = link ? `[${basename(link)}](${link})` : "Missing path";
      lines.push(`| ${label} | ${artifact.stageId ?? "-"} | ${artifact.kind ?? "-"} | ${source} |`);
    }
    lines.push("");
  }

  lines.push(
    "## Implementation acceptance gate",
    "",
    "Before production code is considered complete:",
    "",
    "- Every implemented scene or interface state maps to an approved storyboard or implementation artifact.",
    "- Every reusable UI value maps to the approved design-system outputs rather than an unexplained hard-coded value.",
    "- 3D, animation and shader work meets the approved performance budgets and includes graceful fallback behavior.",
    "- Reduced motion, keyboard access, readable contrast and semantic structure are tested, not assumed.",
    "- QA evidence is reproducible in CI and contains no manual-only release blocker.",
    "- Production credentials, paid generation and external service calls remain outside approved artifacts and source control.",
    "",
    "## Open implementation boundary",
    "",
    "This handoff confirms that planning and governance are approved. It does not claim that final images, GLB files, Blender scenes, production shaders, browser implementation or automated QA evidence already exist. Those outputs must now be built, reviewed and linked back to this baseline.",
    "",
  );

  await writeFile(outputPath, `${lines.join("\n")}\n`, "utf8");
  console.log(`Production handoff generated: ${outputPath}`);
  console.log(`Pipelines indexed: ${order.length}`);
  console.log(`Artifacts indexed: ${artifactCount}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
