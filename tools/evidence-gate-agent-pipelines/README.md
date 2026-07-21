# Evidence Gate Agent Pipelines

Runnable TypeScript monorepo for nine governed creative-production pipelines with Gemini-first hosted reasoning and Ollama as the guaranteed local fallback.

## Repository structure

```text
packages/
├── core/
├── eval/
├── model-router/
├── pipelines/
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

Paid generation remains disabled by default:

```env
EG_ALLOW_PAID_IMAGE_GENERATION=false
EG_ALLOW_PAID_3D_GENERATION=false
EG_MAX_PAID_JOB_USD=0
```

A future image or Meshy adapter must require both an explicit environment opt-in and human approval before submitting a paid job.

## Status

```bash
pnpm status
```

## Reset

```bash
pnpm reset
```

Reset removes unapproved drafts and resets incomplete pipeline state. Approved artifacts and approved pipeline state are preserved.

## Important limitation

The Gemini text provider and provider routing are implemented. Image generation, Meshy jobs, Figma export, Blender automation and deterministic browser QA adapters are defined as the next production adapters; they are not yet pretending to be complete.
