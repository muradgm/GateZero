import type { ModelProvider, PipelineId } from "@eg/core";
import {
  FallbackProvider,
  GeminiProvider,
  MockProvider,
  OllamaProvider,
  OpenAIProvider
} from "@eg/provider";

export type ProviderPreference =
  | "gemini"
  | "openai"
  | "ollama"
  | "hybrid"
  | "mock";

type ProviderName = "gemini" | "openai" | "ollama";

export const pipelineProviderMatrix: Record<PipelineId, {
  preferred: ProviderName;
  fallback: ProviderName;
  specialist: string;
  reason: string;
}> = {
  strategy: {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "DeepSeek (optional second opinion)",
    reason: "Use the hosted free tier for synthesis while preserving a local fallback."
  },
  "concept-art": {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "GPT Image, Ideogram or Krea after text approval",
    reason: "Separate concept reasoning from paid image generation."
  },
  storyboard: {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "Configurable image provider for approved scene frames",
    reason: "Narrative continuity and camera logic benefit from stronger hosted reasoning."
  },
  "design-system": {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "Figma exporter/plugin",
    reason: "The model defines the system; Figma remains the editable delivery surface."
  },
  "modeling-3d": {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "Meshy with explicit cost approval, then Blender validation",
    reason: "Generate production specifications before requesting paid mesh generation."
  },
  animation: {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "Blender first; Cascadeur or Rokoko only for character motion",
    reason: "Most current motion is procedural, camera or object choreography."
  },
  "shader-vfx": {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "React Three Fiber, Three.js and GLSL",
    reason: "Outputs must be executable web shaders with performance fallbacks."
  },
  implementation: {
    preferred: "ollama",
    fallback: "gemini",
    specialist: "Codex or GitHub Copilot for difficult repository work",
    reason: "Keep routine code generation local and use hosted reasoning only when needed."
  },
  qa: {
    preferred: "gemini",
    fallback: "ollama",
    specialist: "Playwright, Lighthouse, axe-core and visual snapshots",
    reason: "AI interprets deterministic evidence rather than replacing tests."
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

  private readonly geminiGeneral = new GeminiProvider(
    process.env.GEMINI_TEXT_MODEL ?? "gemini-3.5-flash"
  );

  private readonly geminiCoder = new GeminiProvider(
    process.env.GEMINI_CODER_MODEL ??
      process.env.GEMINI_TEXT_MODEL ??
      "gemini-3.5-flash"
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

    const isCodePipeline = pipelineId === "implementation" || pipelineId === "qa";
    const ollama = isCodePipeline ? this.ollamaCoder : this.ollamaGeneral;
    const gemini = pipelineId === "implementation" ? this.geminiCoder : this.geminiGeneral;
    const openai = pipelineId === "implementation" ? this.openaiCoder : this.openaiGeneral;

    if (pipelinePreference === "ollama") {
      return ollama;
    }

    if (pipelinePreference === "gemini") {
      return gemini;
    }

    if (pipelinePreference === "openai") {
      return openai;
    }

    const matrix = pipelineProviderMatrix[pipelineId];
    return matrix.preferred === "ollama"
      ? new FallbackProvider(ollama, gemini)
      : new FallbackProvider(gemini, ollama);
  }
}
