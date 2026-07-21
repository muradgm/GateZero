# Production Service Matrix

Evidence Gate uses one preferred provider, one guaranteed fallback and one optional specialist path per capability. Paid generation is never automatic.

## Core routing

| Pipeline | Preferred reasoning | Local fallback | Specialist production service |
|---|---|---|---|
| Strategy | Gemini | Ollama qwen3 | DeepSeek only as an optional second opinion |
| Concept Art | Gemini | Ollama qwen3 | GPT Image, Ideogram or Krea after concept approval |
| Storyboard | Gemini | Ollama qwen3 | Configurable image provider after scene-plan approval |
| Design System | Gemini | Ollama qwen3 | Figma exporter/plugin |
| 3D Modeling | Gemini | Ollama qwen3 | Meshy after explicit cost approval; Blender validates output |
| Animation | Gemini | Ollama qwen3 | Blender first; Cascadeur/Rokoko only for character motion |
| Shader/VFX | Gemini | Ollama qwen3 | React Three Fiber, Three.js and GLSL |
| Implementation | Ollama coder | Gemini | Codex or GitHub Copilot for difficult repository work |
| QA | Gemini | Ollama coder | Playwright, Lighthouse, axe-core and visual snapshots |

## Rules

1. `EG_PROVIDER=hybrid` is the default.
2. Gemini handles hosted reasoning where a free quota is available.
3. Ollama is the guaranteed local fallback and keeps the workflow operable without billing.
4. OpenAI is an explicit premium override, not part of the automatic default chain.
5. Image, video and 3D generation require a reviewed text specification first.
6. Paid generation requires both an environment opt-in and a human approval step.
7. AI interpretation supplements deterministic QA; it does not replace tests.
8. Figma, Blender and the repository remain the editable sources of truth.

## Paid-service gates

The following defaults must remain disabled:

```env
EG_ALLOW_PAID_IMAGE_GENERATION=false
EG_ALLOW_PAID_3D_GENERATION=false
EG_MAX_PAID_JOB_USD=0
```

A production adapter must refuse work unless its specific permission is enabled and its estimated cost is inside the configured ceiling.

## Deferred integrations

Do not add overlapping providers until a concrete limitation appears. Deferred options include Midjourney automation, Kling, Runway, Pika, Kaiber, Galileo, Magician, multiple mocap platforms, Unity VFX Graph, Testim and Applitools.

## Next adapters

The implementation order is:

1. Gemini text provider and health check.
2. Generic image-provider contract with draft-only outputs.
3. Meshy adapter behind paid-job approval.
4. Figma export contract.
5. Blender/R3F production validation contracts.
6. Deterministic Playwright/Lighthouse/axe QA evidence ingestion.
