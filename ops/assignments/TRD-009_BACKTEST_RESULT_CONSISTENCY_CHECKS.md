# TRD-009 - Backtest Result Consistency Checks

## Assigned Agent

`QUANT`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add deterministic consistency checks that compare stored `BacktestResult.metric_summary` values
against recalculated synthetic metrics.

This packet must not add a backtest engine, strategy logic, market data access, predictions,
execution behavior, or performance claims.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Stored metrics must be auditable against deterministic recalculation before strategy review evidence
can be trusted.

## Allowed Files

- `packages/metrics/src/backtest-consistency.ts`
- `packages/metrics/src/index.ts`
- `packages/metrics/tests/backtest-consistency.test.ts`
- `ops/assignments/TRD-009_BACKTEST_RESULT_CONSISTENCY_CHECKS.md`
- `ops/runtime/reviews/TRD-009_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-009_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-009_ORCHESTRATOR_ACCEPTANCE.md`

## Blocked Files

- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- broker integration files
- live trading files
- paper execution files
- broker secret handling
- strategy promotion records
- API route files
- network client files

## Source Truth Files

- `ops/benchmarks/quant/backtest_honesty_checks.md`
- `docs/engineering/TESTING_STRATEGY.md`
- `docs/operations/DATA_HANDLING.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/runtime/reviews/TRD-008_ORCHESTRATOR_ACCEPTANCE.md`

## Required Changes

Create consistency helpers that:

- validate input through `BacktestResultSchema`
- recalculate metric summary values from stored equity/trade records
- compare stored and recalculated values with a small numeric tolerance
- return explicit mismatch findings
- always include drawdown context in the check result
- do not mutate input
- do not infer strategy quality or promote readiness

## Required Tests

Add tests proving:

- a consistent synthetic fixture returns no findings
- total return mismatch is flagged
- max drawdown mismatch is flagged
- trade count mismatch is flagged
- average win/loss ratio mismatch is flagged
- invalid backtest payloads are rejected
- input object is not mutated

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Backtest consistency helper exists and is exported.
- Consistency tests pass.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
