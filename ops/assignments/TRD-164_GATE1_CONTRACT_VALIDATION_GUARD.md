# TRD-164: Gate 1 Contract Validation Guard

## Objective

Implement a local guard that checks Gate 1 contract docs, sources, tests, fixtures, and tracker
links.

## Scope

Allowed:

- Add a local validation script.
- Add guard tests.
- Wire the guard into the existing Gate 0 check suite.

Blocked:

- External access, strategy execution, report publishing, strategy promotion, gate movement, or
  risk-gate loosening.

## Required Output

- `scripts/check-gate1-contracts.ts`
- `packages/fixtures/tests/gate1-contract-guard.test.ts`
- `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Guard passes when Gate 1 contract records align.
- Guard fails with bounded findings when records drift.
- `pnpm check:gate0` runs the guard.

## Source Links

- Planning doc: `docs/operations/GATE1_CONTRACT_VALIDATION_GUARD_PLAN.md`
- Assignment authority:
  `ops/assignments/TRD-156_GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
