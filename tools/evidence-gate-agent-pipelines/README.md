# Evidence Gate Agent Pipelines

Runnable TypeScript monorepo for nine governed creative-production pipelines with Gemini-first hosted reasoning and Ollama as the guaranteed local fallback.

## Repository structure

```text
packages/
├── core/
├── eval/
├── model-router/
├── pipelines/
├── production-adapters/
├── provider/
├── store/
└── workflow/
```

## Recommended routing

With `EG_PROVIDER=hybrid`:

```text
Strategy, Concept Art, Storyboard,
Design System, 3D, Animation, Shader/VFX, QA
    → Gemini
    → Ollama fallback

Implementation
    → Ollama coder
    → Gemini fallback
```

OpenAI remains available as an explicit premium override. Paid image and 3D services are not called automatically.

The full service matrix and approval boundaries are documented in:

```text
docs/PRODUCTION-SERVICE-MATRIX.md
```

## Production adapter layer

`@eg/production-adapters` now defines the contracts for image generation, Meshy, Figma export, Blender automation, R3F/GLSL production and deterministic QA.

The package includes:

- a provider registry
- production job request/result contracts
- the preferred-service matrix for all nine pipelines
- explicit paid-service approval enforcement
- per-job budget enforcement
- artifact metadata support for images, 3D models, animation clips, shaders, design exports and test reports

Adapters are registered only when implemented and configured. Missing adapters fail clearly rather than silently pretending that an external artifact was generated.

## Setup

```bash
pnpm install
cp .env.example .env
```

Add a Gemini Developer API key to `.env`:

```env
EG_PROVIDER=hybrid
GEMINI_API_KEY=your_key
GEMINI_TEXT_MODEL=gemini-3.5-flash
```

Ollama normally runs automatically on Windows. Do not start a second `ollama serve` process when port `11434` is already occupied.

## Verify the environment

```bash
pnpm run doctor
pnpm typecheck
```

Ollama remains required for the default hybrid fallback:

```text
✓ Ollama is reachable
✓ qwen3:8b
✓ qwen2.5-coder:7b
```

## Provider overrides

```env
EG_PROVIDER=gemini
EG_PROVIDER=ollama
EG_PROVIDER=openai
EG_PROVIDER=mock
```

Per-pipeline example:

```env
EG_PROVIDER_IMPLEMENTATION=ollama
EG_PROVIDER_QA=gemini
```

## Run the workflow

```bash
pnpm run:demo
```

The first eligible pipeline runs and stops at review.

Draft outputs are written to:

```text
projects/traderframe-evidence-gate/drafts/<pipeline>/
```

Drafts are ignored by Git.

Review the draft outputs, then approve:

```bash
pnpm approve
```

Approval copies the pipeline artifacts into:

```text
projects/traderframe-evidence-gate/approved/<pipeline>/
```

Approved artifacts and `manifest.json` are version-controlled.

Continue:

```bash
pnpm run:demo
```

Repeat until all nine pipelines are approved.

## Paid-service gates

Paid generation is disabled by default:

```env
EG_ALLOW_PAID_GENERATION=false
EG_APPROVED_PAID_PROVIDERS=
EG_MAX_SINGLE_JOB_COST_USD=0
```

A paid adapter can execute only when:

1. `EG_ALLOW_PAID_GENERATION=true`
2. its exact adapter ID appears in `EG_APPROVED_PAID_PROVIDERS`
3. its estimate does not exceed `EG_MAX_SINGLE_JOB_COST_USD`
4. the pipeline artifact has passed the normal human review gate

Example:

```env
EG_ALLOW_PAID_GENERATION=true
EG_APPROVED_PAID_PROVIDERS=meshy,gpt-image
EG_MAX_SINGLE_JOB_COST_USD=2.50
```

## Status

```bash
pnpm status
```

## Reset

```bash
pnpm reset
```

Reset removes unapproved drafts and resets incomplete pipeline state. Approved artifacts and approved pipeline state are preserved.

## Current production status

Implemented:

- Gemini, OpenAI and Ollama text providers
- hybrid routing and fallback
- draft/approved artifact lifecycle
- resumable pipeline execution
- production adapter contracts and governance

Next adapters:

1. generic image adapter plus one configured image provider
2. Meshy job adapter and GLB download validation
3. Figma design-token exporter
4. Blender automation contract and validation scripts
5. Playwright, axe and Lighthouse QA runner
