# TRD-317 Duplicate Signal Blocker Contract

## Goal

Add a Gate 1 schema-only contract and fixture proving that duplicate signal fingerprints block
evidence use until deduplicated.

## Acceptance Criteria

- Duplicate-signal blockers require at least two duplicate signal references.
- Attempts to bypass blocked state fail validation.
- No trade recommendation, execution, paper route, or approval path is added.
- `pnpm check:gate1-contracts` and `pnpm verify:gate0` pass.
