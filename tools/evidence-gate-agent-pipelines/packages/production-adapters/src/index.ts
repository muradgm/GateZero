import type {
  ArtifactKind,
  PipelineId,
  ServiceCapability,
  ServiceSelection
} from "@eg/core";

export type ProductionJobStatus =
  | "planned"
  | "awaiting-approval"
  | "running"
  | "completed"
  | "failed";

export interface ProductionJobRequest {
  projectId: string;
  pipelineId: PipelineId;
  stageId: string;
  capability: ServiceCapability;
  prompt: string;
  sourceArtifacts: string[];
  outputName: string;
  outputKind: ArtifactKind;
  estimatedCostUsd?: number;
  metadata?: Record<string, unknown>;
}

export interface ProductionJobResult {
  providerId: string;
  status: ProductionJobStatus;
  outputPath?: string;
  mimeType?: string;
  externalJobId?: string;
  costUsd?: number;
  metadata?: Record<string, unknown>;
}

export interface ProductionAdapter {
  readonly id: string;
  readonly capability: ServiceCapability;
  readonly paid: boolean;
  isConfigured(): boolean;
  estimate?(request: ProductionJobRequest): Promise<number | undefined>;
  execute(request: ProductionJobRequest): Promise<ProductionJobResult>;
}

export class ApprovalRequiredError extends Error {
  constructor(
    readonly providerId: string,
    readonly estimatedCostUsd?: number
  ) {
    super(
      estimatedCostUsd === undefined
        ? `Explicit approval is required before running ${providerId}.`
        : `Explicit approval is required before running ${providerId} (estimated $${estimatedCostUsd.toFixed(2)}).`
    );
  }
}

export function assertPaidExecutionAllowed(
  providerId: string,
  paid: boolean,
  estimatedCostUsd?: number
): void {
  if (!paid) return;

  const enabled = process.env.EG_ALLOW_PAID_GENERATION === "true";
  const approvedProviders = new Set(
    (process.env.EG_APPROVED_PAID_PROVIDERS ?? "")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)
  );

  if (!enabled || !approvedProviders.has(providerId)) {
    throw new ApprovalRequiredError(providerId, estimatedCostUsd);
  }

  const budget = Number(process.env.EG_MAX_SINGLE_JOB_COST_USD ?? 0);
  if (
    estimatedCostUsd !== undefined &&
    Number.isFinite(budget) &&
    budget > 0 &&
    estimatedCostUsd > budget
  ) {
    throw new Error(
      `${providerId} estimate $${estimatedCostUsd.toFixed(2)} exceeds the single-job limit $${budget.toFixed(2)}.`
    );
  }
}

export const productionServiceMatrix: Record<PipelineId, ServiceSelection[]> = {
  strategy: [
    {
      capability: "text-generation",
      preferred: "gemini",
      fallback: "ollama",
      requiresExplicitApproval: false
    }
  ],
  "concept-art": [
    {
      capability: "text-generation",
      preferred: "gemini",
      fallback: "ollama",
      requiresExplicitApproval: false
    },
    {
      capability: "image-generation",
      preferred: "configured-image-provider",
      fallback: "prompt-pack",
      requiresExplicitApproval: true
    }
  ],
  storyboard: [
    {
      capability: "text-generation",
      preferred: "gemini",
      fallback: "ollama",
      requiresExplicitApproval: false
    },
    {
      capability: "image-generation",
      preferred: "configured-image-provider",
      fallback: "prompt-pack",
      requiresExplicitApproval: true
    }
  ],
  "design-system": [
    {
      capability: "design-export",
      preferred: "figma-export",
      fallback: "json-tokens",
      requiresExplicitApproval: false
    }
  ],
  "modeling-3d": [
    {
      capability: "model-generation-3d",
      preferred: "meshy",
      fallback: "blender-spec",
      requiresExplicitApproval: true
    }
  ],
  animation: [
    {
      capability: "animation-production",
      preferred: "blender",
      fallback: "animation-spec",
      requiresExplicitApproval: false
    }
  ],
  "shader-vfx": [
    {
      capability: "shader-production",
      preferred: "r3f-three-glsl",
      fallback: "shader-spec",
      requiresExplicitApproval: false
    }
  ],
  implementation: [
    {
      capability: "implementation",
      preferred: "ollama-coder",
      fallback: "gemini",
      requiresExplicitApproval: false
    }
  ],
  qa: [
    {
      capability: "quality-assurance",
      preferred: "playwright-lighthouse-axe",
      fallback: "manual-review",
      requiresExplicitApproval: false
    }
  ]
};

export class ProductionAdapterRegistry {
  private readonly adapters = new Map<string, ProductionAdapter>();

  register(adapter: ProductionAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  get(id: string): ProductionAdapter | undefined {
    return this.adapters.get(id);
  }

  listConfigured(): ProductionAdapter[] {
    return [...this.adapters.values()].filter(adapter => adapter.isConfigured());
  }

  async execute(id: string, request: ProductionJobRequest): Promise<ProductionJobResult> {
    const adapter = this.adapters.get(id);
    if (!adapter) {
      throw new Error(`Production adapter ${id} is not registered.`);
    }
    if (!adapter.isConfigured()) {
      throw new Error(`Production adapter ${id} is not configured.`);
    }

    const estimate = await adapter.estimate?.(request);
    assertPaidExecutionAllowed(adapter.id, adapter.paid, estimate);
    return adapter.execute(request);
  }
}
