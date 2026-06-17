# TRD-236 Tracklist Section Length Guard

## Goal

Add a local guard that prevents long unbroken tracklist sections from degrading editor and spell
checker usability.

## Allowed Scope

- Add a local tracklist section length checker.
- Add focused tests for pass and failure paths.
- Add the command to the Gate 0 guard suite.
- Document the guard and update control-plane indexes.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No content deletion outside the formatting need.
- No scope expansion.
- No live trading, broker integration, paper order mechanics, autonomous execution, AI prediction,
  broker API key handling, strategy approval, readiness semantics, profitability claims, marketing
  claims, or risk-gate loosening.

## Required Outputs

- `scripts/check-gate0-tracklist-section-length.ts`.
- `packages/fixtures/tests/gate0-tracklist-section-length.test.ts`.
- `docs/operations/GATE0_TRACKLIST_SECTION_LENGTH_GUARD.md`.
- Updated `package.json`.

## Acceptance Criteria

- `pnpm check:gate0-tracklist-sections` passes.
- Focused tests pass.
- The guard is included in `pnpm check:gate0`.
- Gate remains `G0_RESEARCH` and scope remains `research_only`.

## Next Agent

QA_SECURITY review, then RISK review, then ORCHESTRATOR acceptance.
