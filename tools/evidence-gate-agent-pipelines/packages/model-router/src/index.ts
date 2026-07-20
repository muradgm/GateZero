import type { ModelProvider, PipelineId } from "@eg/core";
import { MockProvider, OllamaProvider } from "@eg/provider";

export class ModelRouter {
  private readonly general = new OllamaProvider(
    process.env.OLLAMA_DEFAULT_MODEL ?? "qwen3:8b"
  );

  private readonly coder = new OllamaProvider(
    process.env.OLLAMA_CODER_MODEL ?? "qwen2.5-coder:7b"
  );

  private readonly mock = new MockProvider();

  route(pipelineId: PipelineId): ModelProvider {
    if ((process.env.EG_PROVIDER ?? "ollama") === "mock") {
      return this.mock;
    }

    switch (pipelineId) {
      case "implementation":
      case "qa":
        return this.coder;
      default:
        return this.general;
    }
  }
}
