# TRD-008 - Deterministic Metric Utilities

## Assigned Agent

`QUANT`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add deterministic metric utility functions over synthetic inputs:

- total return percentage
- max drawdown percentage
- trade count
- average win/loss ratio
- metric summary assembly

This packet must not add strategy logic, market data access, predictions, execution behavior, or
performance claims.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Metric utilities make evidence reproducible and testable before any broader backtest workflow
exists.

## Allowed Files

- `packages/metrics/README.md`
- `packages/metrics/src/metric-utils.ts`
- `packages/metrics/src/index.ts`
- `packages/metrics/tests/metric-utils.test.ts`
- `ops/assignments/TRD-008_DETERMINISTIC_METRIC_UTILITIES.md`
- `ops/runtime/reviews/TRD-008_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-008_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-008_ORCHESTRATOR_ACCEPTANCE.md`

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

## Required Changes

Create pure metric helpers that:

- accept explicit numeric inputs
- are deterministic
- validate impossible inputs by throwing contract-style errors
- compute total return from first and last equity values
- compute max drawdown from an equity curve
- compute trade count from trade-like records
- compute average win/loss ratio from closed trade PnL values
- assemble a `MetricSummary`-compatible object

## Required Tests

Add tests proving:

- total return is deterministic
- max drawdown handles peak-to-trough declines
- flat equity has zero drawdown
- trade count is counted explicitly
- average win/loss ratio uses average wins and average losses
- no-loss inputs return zero ratio with a warning
- metric summary includes drawdown context
- empty equity inputs are rejected

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Metric utility package exists.
- Metric tests pass.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
