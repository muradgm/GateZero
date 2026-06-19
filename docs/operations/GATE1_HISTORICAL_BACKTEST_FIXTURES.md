# Gate 1 Historical Backtest Fixtures

## Purpose

This document records the local synthetic fixtures added for Gate 1 historical backtest contract
validation.

The fixtures are not market evidence, strategy evidence, performance evidence, report material, or
gate movement.

## Implemented Fixtures

- Source: `packages/fixtures/src/gate1-historical-backtest-fixtures.ts`
- Test: `packages/fixtures/tests/gate1-historical-backtest-fixtures.test.ts`

## Boundary Fields

- `financial_gate`: `G1_BACKTESTING`
- `scope`: `historical_backtesting_only`
- `contract_authority`: `schema_only`
- `external_access`: `false`
- `execution_path`: `false`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_FIXTURE_BOUNDARY_PLAN.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-163_GATE1_HISTORICAL_BACKTEST_FIXTURES.md`
- Reviews: `ops/runtime/reviews/TRD-163_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-163_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-163_ORCHESTRATOR_ACCEPTANCE.md`
