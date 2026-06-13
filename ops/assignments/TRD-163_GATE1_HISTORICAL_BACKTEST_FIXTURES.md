# TRD-163: Gate 1 Historical Backtest Fixtures

## Objective

Add synthetic fixtures for the Gate 1 historical backtest contract set.

## Scope

Allowed:

- Add synthetic, deterministic local fixtures.
- Add fixture validation tests.
- Include a reproducibility mismatch fixture that is not usable as evidence.

Blocked:

- Real market data, external access, strategy claims, report publishing, execution paths, or gate
  movement.

## Required Output

- `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- `packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts`
- `docs/operations/GATE1_HISTORICAL_BACKTEST_FIXTURES.md`
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance Criteria

- Fixtures validate against the Gate 1 contract schemas.
- Fixtures remain synthetic and `research_only`.
- Gate 0 verification remains passing.

## Source Links

- Planning doc: `docs/operations/GATE1_FIXTURE_BOUNDARY_PLAN.md`
- Assignment authority:
  `ops/assignments/TRD-156_GATE1_CONTRACT_ONLY_IMPLEMENTATION_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
