# TRD-261 CI Evidence Refresh Loop Pause

## Goal

Record a Gate 0 operating control that prevents CI evidence refresh work from chaining into
bookkeeping churn.

The latest recorded remote evidence remains the passing Gate 0 verification run already captured by
`TRD-260`. This packet intentionally does not record the push created by `TRD-260` unless a concrete
maintenance, audit, or handoff need appears.

## Current Gate

```text
G0_RESEARCH
research_only
```

## Allowed Scope

- Add a local documentation control for when to use `pnpm refresh:gate0-ci-evidence`.
- Update docs indexes, tracker records, progress snapshot, and command-center metadata to reflect
  the accepted pause control.
- Preserve the existing latest recorded CI evidence values.

## Blocked Scope

- No broker integration.
- No live or paper order placement.
- No autonomous execution.
- No AI buy/sell prediction.
- No broker credentials, API keys, or account identifiers.
- No strategy approval, readiness, promotion, profitability, or performance claims.
- No risk-gate loosening.

## Required Outputs

- `docs/operations/GATE0_CI_EVIDENCE_REFRESH_LOOP_PAUSE.md`
- `ops/runtime/reviews/TRD-261_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-261_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-261_ORCHESTRATOR_ACCEPTANCE.md`
- Updated docs index, artifact map, tracklist, progress snapshot, and command-center metadata.

## Acceptance Criteria

- The refresh helper remains available for explicit, meaningful Gate 0 maintenance evidence.
- Evidence-only follow-up pushes are not automatically recorded.
- The command center can show `TRD-261` as the latest accepted packet while keeping the latest
  recorded CI run at the existing evidence value.
- QA_SECURITY, RISK, and ORCHESTRATOR reviews exist before acceptance.
- Gate 0 validation passes.

## Validation Commands

```powershell
pnpm snapshot:gate0-progress
pnpm test -- packages/fixtures/tests/gate0-command-center-data.test.ts packages/fixtures/tests/gate0-command-center-runtime-data.test.ts
pnpm check:gate0-command-center
pnpm check:gate0-tracklist
pnpm check:gate0-reviews
pnpm check:gate0-docs-coverage
pnpm verify:gate0
```

## Done When

The pause control is indexed, reviewed, accepted, locally verified, and keeps GateZero at
`G0_RESEARCH` with `research_only` scope.

## Next Agent

ORCHESTRATOR may choose the next bounded Gate 0 maintenance task only when a concrete control gap is
identified.
