# GateZero Ops — Professional Agent Operating System

GateZero is a personal trading research, risk-control, and execution-support system.

Core wedge:

> No trade without evidence. No execution without risk approval.

This package contains senior Codex-ready agents, governance files, contracts, benchmarks, evals,
references, and a learning loop.

## Agent Folders

Each folder in `ops/agents/` contains:

- `SKILL.md` — senior role definition and operating instructions
- `evals/evals.json` — required behavioral evals for that agent
- `references/README.md` — required local and external references
- `references/required_refs.md` — quick reference checklist

## Learning

The learning system lives in `ops/learning/`.

Learning can improve tests, risk rules, UI warnings, docs, and review quality. It cannot
automatically increase trading autonomy, risk limits, position size, or live execution privileges.

## Default Gate

This system starts at Gate 0 — Research Only.

No live trading. No broker integration. No autonomous execution.

## Reference upgrade

Every agent now includes a non-placeholder `references/` folder with:

- `README.md` — role-specific reference policy and required sources
- `required_refs.md` — human-readable required reference list
- `source_map.json` — machine-readable source index for Codex/agents

A global index is available at `ops/references/GLOBAL_REFERENCE_INDEX.md` and
`ops/references/GLOBAL_REFERENCE_INDEX.json`.
