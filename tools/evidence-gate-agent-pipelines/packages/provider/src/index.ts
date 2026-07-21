import type { ModelProvider, ModelRequest } from "@eg/core";

type OllamaChatResponse = {
  message?: {
    content?: string;
    thinking?: string;
  };
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
};

export class OllamaProvider implements ModelProvider {
  readonly id: string;

  constructor(
    private readonly model = process.env.OLLAMA_DEFAULT_MODEL ?? "qwen3:8b",
    private readonly baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"
  ) {
    this.id = `ollama:${this.model}`;
  }

  async complete(request: ModelRequest): Promise<string> {
    const controller = new AbortController();
    const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS ?? 10 * 60 * 1000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          stream: false,
          think: false,
          format: request.responseFormat === "json" ? "json" : undefined,
          messages: [
            { role: "system", content: request.system },
            { role: "user", content: request.prompt }
          ],
          options: {
            temperature: request.temperature ?? 0.4,
            num_ctx: Number(process.env.OLLAMA_NUM_CTX ?? 4096),
            num_predict: Number(process.env.OLLAMA_NUM_PREDICT ?? 1200)
          },
          keep_alive: process.env.OLLAMA_KEEP_ALIVE ?? "15m"
        })
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Ollama timed out after ${timeoutMs / 1000} seconds while running ${this.model}.`
        );
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `Ollama request failed (${response.status} ${response.statusText}): ${details}`
      );
    }

    const data = (await response.json()) as OllamaChatResponse;
    const content = data.message?.content?.trim();

    if (!content) {
      throw new Error(`Ollama model ${this.model} returned an empty response.`);
    }

    return content;
  }
}

export class GeminiProvider implements ModelProvider {
  readonly id: string;

  constructor(
    private readonly model = process.env.GEMINI_TEXT_MODEL ?? "gemini-3.5-flash",
    private readonly apiKey = process.env.GEMINI_API_KEY,
    private readonly baseUrl = process.env.GEMINI_BASE_URL ??
      "https://generativelanguage.googleapis.com/v1beta"
  ) {
    this.id = `gemini:${this.model}`;
  }

  async complete(request: ModelRequest): Promise<string> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is required for the Gemini provider.");
    }

    const controller = new AbortController();
    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS ?? 5 * 60 * 1000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;

    try {
      const endpoint = `${this.baseUrl}/models/${encodeURIComponent(this.model)}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: request.system }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: request.prompt }]
            }
          ],
          generationConfig: {
            temperature: request.temperature ?? 0.4,
            maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? 1800),
            responseMimeType:
              request.responseFormat === "json" ? "application/json" : "text/plain"
          }
        })
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `Gemini timed out after ${timeoutMs / 1000} seconds while running ${this.model}.`
        );
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `Gemini request failed (${response.status} ${response.statusText}): ${details}`
      );
    }

    const data = (await response.json()) as GeminiResponse;
    const content = data.candidates
      ?.flatMap(candidate => candidate.content?.parts ?? [])
      .map(part => part.text ?? "")
      .join("\n")
      .trim();

    if (!content) {
      const reason = data.promptFeedback?.blockReason;
      throw new Error(
        reason
          ? `Gemini model ${this.model} returned no content. Block reason: ${reason}.`
          : `Gemini model ${this.model} returned an empty response.`
      );
    }

    return content;
  }
}

export class OpenAIProvider implements ModelProvider {
  readonly id: string;

  constructor(
    private readonly model = process.env.OPENAI_TEXT_MODEL ?? "gpt-5.2",
    private readonly apiKey = process.env.OPENAI_API_KEY,
    private readonly baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"
  ) {
    this.id = `openai:${this.model}`;
  }

  async complete(request: ModelRequest): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is required for the OpenAI provider.");
    }

    const controller = new AbortController();
    const timeoutMs = Number(process.env.OPENAI_TIMEOUT_MS ?? 5 * 60 * 1000);
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;

    try {
      response = await fetch(`${this.baseUrl}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.model,
          instructions: request.system,
          input: request.prompt,
          temperature: request.temperature ?? 0.4,
          max_output_tokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS ?? 1800)
        })
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(
          `OpenAI timed out after ${timeoutMs / 1000} seconds while running ${this.model}.`
        );
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const details = await response.text();
      throw new Error(
        `OpenAI request failed (${response.status} ${response.statusText}): ${details}`
      );
    }

    const data = (await response.json()) as OpenAIResponse;
    const content =
      data.output_text?.trim() ??
      data.output
        ?.flatMap(item => item.content ?? [])
        .filter(item => item.type === "output_text" && item.text)
        .map(item => item.text)
        .join("\n")
        .trim();

    if (!content) {
      throw new Error(`OpenAI model ${this.model} returned an empty response.`);
    }

    return content;
  }
}

export class FallbackProvider implements ModelProvider {
  readonly id: string;

  constructor(
    private readonly primary: ModelProvider,
    private readonly fallback: ModelProvider
  ) {
    this.id = `${primary.id} -> ${fallback.id}`;
  }

  async complete(request: ModelRequest): Promise<string> {
    try {
      return await this.primary.complete(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Primary provider failed: ${message}`);
      console.warn(`Falling back to ${this.fallback.id}`);
      return this.fallback.complete(request);
    }
  }
}

export class MockProvider implements ModelProvider {
  readonly id = "mock";

  async complete(request: ModelRequest): Promise<string> {
    if (request.responseFormat === "json") {
      return JSON.stringify(
        {
          generatedBy: this.id,
          objective: request.prompt,
          decisions: [
            "Preserve approved upstream decisions.",
            "Make assumptions explicit.",
            "Keep outputs production-oriented."
          ],
          risks: ["Mock output is not suitable for final production decisions."]
        },
        null,
        2
      );
    }

    return [
      "# Mock Artifact",
      "",
      request.prompt,
      "",
      "## Note",
      "This was generated by the fallback mock provider."
    ].join("\n");
  }
}

export async function checkOllama(
  baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434"
): Promise<{ ok: boolean; models: string[]; error?: string }> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`);

    if (!response.ok) {
      return {
        ok: false,
        models: [],
        error: `${response.status} ${response.statusText}`
      };
    }

    const data = (await response.json()) as {
      models?: Array<{ name?: string }>;
    };

    return {
      ok: true,
      models: (data.models ?? [])
        .map(item => item.name ?? "")
        .filter(Boolean)
    };
  } catch (error) {
    return {
      ok: false,
      models: [],
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
