import type { ModelProvider, PipelineId } from "@eg/core";
import {
  FallbackProvider,
  MockProvider,
  OllamaProvider,
  OpenAIProvider
} from "@eg/provider";

export type ProviderPreference = "openai" | "ollama" | "hybrid" | "mock";

export const pipelineProviderMatrix: Record<PipelineId, {
  preferred: "openai" | "ollama";
  fallback: "openai" | "ollama";
  reason: string;
}> = {
  strategy: {
    preferred: "openai",
    fallback: "ollama",
    reason: "High-value product reasoning and decision synthesis."
  },
  "concept-art": {
    preferred: "openai",
    fallback: "ollama",
    reason: "Creative direction benefits from stronger multimodal reasoning; image generation is added separately."
  },
  storyboard: {
    preferred: "openai",
    fallback: "ollama",
    reason: "Narrative continuity, camera logic and scene sequencing are quality-critical."
  },
  "design-system": {
    preferred: "openai",
    fallback: "ollama",
    reason: "Requires consistent translation from brand intent into reusable system rules."
  },
  "modeling-3d": {
    preferred: "openai",
    fallback: "ollama",
    reason: "Complex production planning, topology constraints and implementation-ready specifications."
  },
  animation: {
    preferred: "openai",
    fallback: "ollama",
    reason: "Timing, choreography, interaction and reduced-motion planning need coherent cross-scene reasoning."
  },
  "shader-vfx": {
    preferred: "openai",
    fallback: "ollama",
    reason: "Technical-art decisions require balanced visual quality, performance and implementation detail."
  },
  implementation: {
    preferred: "ollama",
    fallback: "openai",
    reason: "Local coder handles routine production work; OpenAI is reserved for difficult implementation failures."
  },
  qa: {
    preferred: "openai",
    fallback: "ollama",
    reason: "Independent final review should use the strongest available reasoning provider."
  }
};

function envKey(pipelineId: PipelineId): string {
  return `EG_PROVIDER_${pipelineId.toUpperCase().replaceAll("-", "_")}`;
}

export class ModelRouter {
  private readonly ollamaGeneral = new OllamaProvider(
    process.env.OLLAMA_DEFAULT_MODEL ?? "qwen3:8b"
  );

  private readonly ollamaCoder = new OllamaProvider(
    process.env.OLLAMA_CODER_MODEL ?? "qwen2.5-coder:7b"
  );

  private readonly openaiGeneral = new OpenAIProvider(
    process.env.OPENAI_TEXT_MODEL ?? "gpt-5.2"
  );

  private readonly openaiCoder = new OpenAIProvider(
    process.env.OPENAI_CODER_MODEL ?? process.env.OPENAI_TEXT_MODEL ?? "gpt-5.2"
  );

  private readonly mock = new MockProvider();

  route(pipelineId: PipelineId): ModelProvider {
    const globalPreference = (process.env.EG_PROVIDER ?? "hybrid") as ProviderPreference;
    const pipelinePreference = (
      process.env[envKey(pipelineId)] ?? globalPreference
    ) as ProviderPreference;

    if (pipelinePreference === "mock") {
      return this.mock;
    }

    const ollama =
      pipelineId === "implementation" || pipelineId === "qa"
        ? this.ollamaCoder
        : this.ollamaGeneral;

    const openai =
      pipelineId === "implementation"
        ? this.openaiCoder
        : this.openaiGeneral;

    if (pipelinePreference === "ollama") {
      return ollama;
    }

    if (pipelinePreference === "openai") {
      return openai;
    }

    const matrix = pipelineProviderMatrix[pipelineId];
    return matrix.preferred === "openai"
      ? new FallbackProvider(openai, ollama)
      : new FallbackProvider(ollama, openai);
  }
}
