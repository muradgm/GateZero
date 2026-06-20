# TRD-322 Skill Default Gate Alignment

## Goal

Align project-local skill default gate wording with the current TraderFrame operating state:
`G1_BACKTESTING` and `historical_backtesting_only`.

## Acceptance Criteria

- Project-local skills no longer default to `G0_RESEARCH` or `research_only`.
- Skill governance and routing guards enforce the Gate 1 current-state snippets.
- Historical command names may remain unchanged until a separate command naming migration.
- No broker, paper/live execution, autonomous action, AI prediction, approval, readiness, or
  performance-claim semantics are introduced.
- `pnpm verify:gate0` passes.
