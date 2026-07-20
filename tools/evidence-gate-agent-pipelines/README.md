# Evidence Gate Agent Pipelines

Updated runnable TypeScript monorepo with the correct folder structure:

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

It includes all nine role-based pipelines and connects directly to your local Ollama installation.

## Models

Default routing:

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

Git Bash on Windows:

```bash
cp .env.example .env
```

Ollama normally runs automatically on Windows. Do not run a second `ollama serve` when port `11434` is already occupied.

## Verify the environment

```bash
pnpm doctor
```

Expected:

```text
✓ Ollama is reachable
✓ qwen3:8b
✓ qwen2.5-coder:7b
```

## Run the workflow

```bash
pnpm reset
pnpm run:demo
```

The first eligible pipeline runs and stops at review.

Inspect its artifacts:

```text
projects/traderframe-evidence-gate/artifacts/
```

Approve it:

```bash
pnpm approve
```

Continue:

```bash
pnpm run:demo
```

Repeat until all nine pipelines are approved.

## Status

```bash
pnpm status
```

## Use the mock provider

Set in `.env`:

```env
EG_PROVIDER=mock
```

## Important limitation

This repository runs the complete text-based orchestration, artifact, evaluation and approval workflow. It does not yet create images, GLB files, Blender scenes or a React Three Fiber experience automatically. Those are separate production adapters to add after the conceptual pipelines are validated.
