export type PipelineId =
  | "strategy"
  | "concept-art"
  | "storyboard"
  | "design-system"
  | "modeling-3d"
  | "animation"
  | "shader-vfx"
  | "implementation"
  | "qa";

export type PipelineStatus =
  | "pending"
  | "running"
  | "review"
  | "approved"
  | "failed"
  | "blocked";

export type ArtifactKind =
  | "markdown"
  | "json"
  | "prompt-pack"
  | "scorecard"
  | "report"
  | "image"
  | "model-3d"
  | "animation-clip"
  | "shader"
  | "design-export"
  | "test-report";

export type ServiceCapability =
  | "text-generation"
  | "image-generation"
  | "model-generation-3d"
  | "design-export"
  | "animation-production"
  | "shader-production"
  | "implementation"
  | "quality-assurance";

export interface ServiceSelection {
  capability: ServiceCapability;
  preferred: string;
  fallback: string;
  requiresExplicitApproval: boolean;
  estimatedCostUsd?: number;
}

export interface TechnicalConstraints {
  targetFpsDesktop: number;
  targetFpsMobile: number;
  maxInitialDownloadMb: number;
  reducedMotionRequired: boolean;
  mobileFallbackRequired: boolean;
}

export interface ProjectContext {
  projectId: string;
  productName: string;
  productDescription: string;
  targetAudience: string[];
  businessGoal: string;
  coreMessage: string;
  brandPrinciples: string[];
  visualReferences: string[];
  technicalConstraints: TechnicalConstraints;
  accessibilityRequirements: string[];
}

export interface StageDefinition {
  id: string;
  name: string;
  objective: string;
  outputName: string;
  outputKind: ArtifactKind;
}

export interface PipelineDefinition {
  id: PipelineId;
  name: string;
  purpose: string;
  dependencies: PipelineId[];
  stages: StageDefinition[];
  qualityThreshold: number;
  maxAutomaticIterations: number;
  humanApprovalRequired: boolean;
}

export interface ArtifactReference {
  id: string;
  pipelineId: PipelineId;
  stageId: string;
  name: string;
  kind: ArtifactKind;
  path: string;
  version: number;
  createdAt: string;
  generatedBy?: string;
  mimeType?: string;
  metadata?: Record<string, unknown>;
}

export interface StageResult {
  stageId: string;
  summary: string;
  output: unknown;
  artifacts: ArtifactReference[];
  assumptions: string[];
  risks: string[];
}

export interface EvaluationCriterion {
  name: string;
  weight: number;
  score: number;
  notes: string;
}

export interface EvaluationResult {
  score: number;
  threshold: number;
  passed: boolean;
  criteria: EvaluationCriterion[];
  hardFailures: string[];
}

export interface PipelineResult {
  pipelineId: PipelineId;
  status: PipelineStatus;
  summary: string;
  stages: StageResult[];
  evaluation: EvaluationResult;
  requiresHumanApproval: boolean;
}

export interface ProjectManifest {
  project: {
    id: string;
    version: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  pipelineOrder: PipelineId[];
  pipelines: Record<PipelineId, {
    status: PipelineStatus;
    currentStage?: string;
    score?: number;
    approvedAt?: string;
    artifacts: ArtifactReference[];
  }>;
  constraints: TechnicalConstraints;
  services?: ServiceSelection[];
}

export interface ModelRequest {
  system: string;
  prompt: string;
  responseFormat: "markdown" | "json";
  temperature?: number;
}

export interface ModelProvider {
  id: string;
  complete(request: ModelRequest): Promise<string>;
}
