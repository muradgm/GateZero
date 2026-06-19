# Gate 1 Directional PnL Fixtures

## Purpose

This document records reusable synthetic fixtures for the Gate 1 schema-only directional PnL
contract.

The fixtures make long and short PnL evidence reusable in local tests without adding a backtest
engine, broker connector, paper/live execution, strategy recommendation, or performance claim.

## Implemented Fixtures

- Source: `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- Tests: `packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts`
- Fixtures:
  - `gate1LongDirectionalPnlFixture`
  - `gate1ShortDirectionalPnlFixture`

## Fixture Semantics

- Long fixture enters on `ask` and exits on `bid`.
- Short fixture enters on `bid` and exits on `ask`.
- Both fixtures use synthetic EURUSD evidence with declared costs.
- Both fixtures remain evidence-only and schema-only.

## Validation

```powershell
pnpm exec vitest run packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts --no-file-parallelism --maxWorkers=1
pnpm exec vitest run packages/fixtures/tests/gate1-contract-guard.test.ts --no-file-parallelism --maxWorkers=1
pnpm check:gate1-contracts
```

Focused result:

- Fixture tests: 1 test file passed, 4 tests passed.
- Guard tests: 1 test file passed, 5 tests passed.
- Gate 1 contract guard: passed.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Contract doc: `docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md`
- Contract test doc: `docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT_TESTS.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-271_DIRECTIONAL_PNL_FIXTURES.md`
- Reviews: `ops/runtime/reviews/TRD-271_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-271_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-271_ORCHESTRATOR_ACCEPTANCE.md`
