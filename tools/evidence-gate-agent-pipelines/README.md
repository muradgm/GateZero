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

Ollama normally runs automatically on Windows. Do not run a second `ollama serve` when port `11434` is already occupied.

## Verify the environment

```bash
pnpm run doctor
```

## Run the workflow

```bash
pnpm reset
pnpm run:demo
```

Inspect generated artifacts under:

```text
projects/traderframe-evidence-gate/artifacts/
```
