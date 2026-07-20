# Evidence Gate Agent Pipelines

Runnable TypeScript monorepo for nine governed creative-production pipelines connected to local Ollama models.

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

## Default model routing

```text
Strategy, Concept Art, Storyboard,
Design System, 3D, Animation, Shader/VFX
    → qwen3:8b

Implementation and QA
    → qwen2.5-coder:7b
```

## Setup

```bash
pnpm install
cp .env.example .env
```

Ollama normally runs automatically on Windows. Do not start a second `ollama serve` process when port `11434` is already occupied.

## Verify the environment

```bash
pnpm run doctor
```

Expected:

```text
✓ Ollama is reachable
✓ qwen3:8b
✓ qwen2.5-coder:7b
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

## Status

```bash
pnpm status
```

## Reset

```bash
pnpm reset
```

Reset removes unapproved drafts and resets incomplete pipeline state. Approved artifacts and approved pipeline state are preserved.

## Use the mock provider

Set in `.env`:

```env
EG_PROVIDER=mock
```

## Important limitation

This repository runs the text-based orchestration, artifact, evaluation and approval workflow. It does not yet generate images, GLB files, Blender scenes or the React Three Fiber experience automatically. Those require production adapters added after the conceptual pipelines are validated.
