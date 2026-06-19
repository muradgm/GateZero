# Gate 1 Directional PnL Contract Tests

## Purpose

This document records the focused test coverage for the Gate 1 schema-only directional PnL contract.

The tests validate calculation semantics and blocked claim fields. They do not run backtests,
publish reports, connect brokers, place orders, or approve strategies.

## Implemented Tests

- Source: `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Schema under test: `Gate1DirectionalPnlContractSchema`

## Covered Cases

- Valid long PnL using ask entry and bid exit.
- Valid short PnL using bid entry and ask exit.
- Rejection for wrong bid/ask side by direction.
- Rejection for mismatched gross or net PnL math.
- Rejection for non-evidence and performance-claim fields.

## Validation

```powershell
pnpm exec vitest run packages/contracts/tests/gate1-historical-backtest-contracts.test.ts --no-file-parallelism --maxWorkers=1
```

Focused result: 1 test file passed, 19 tests passed.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Contract doc: `docs/operations/GATE1_DIRECTIONAL_PNL_CONTRACT.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-270_DIRECTIONAL_PNL_CONTRACT_TESTS.md`
- Reviews: `ops/runtime/reviews/TRD-270_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-270_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-270_ORCHESTRATOR_ACCEPTANCE.md`
