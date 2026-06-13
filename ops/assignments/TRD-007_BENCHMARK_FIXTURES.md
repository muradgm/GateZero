# TRD-007 - Gate 0 Benchmark Fixtures

## Assigned Agent

`QUANT`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add synthetic Gate 0 benchmark fixtures for known research-quality failure modes:

- biased backtest case
- fee/slippage case
- missing-data case
- risk-veto case
- low-trade-count case

Fixtures must validate existing contracts and must not make strategy performance claims or add
strategy logic.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Fixtures make future tests prove that weak evidence, missing assumptions, and risk vetoes remain
visible.

## Allowed Files

- `packages/fixtures/README.md`
- `packages/fixtures/src/benchmark-fixtures.ts`
- `packages/fixtures/src/index.ts`
- `packages/fixtures/tests/benchmark-fixtures.test.ts`
- `ops/assignments/TRD-007_BENCHMARK_FIXTURES.md`
- `ops/runtime/reviews/TRD-007_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-007_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-007_ORCHESTRATOR_ACCEPTANCE.md`

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
- `ops/benchmarks/risk/risk_review_checks.md`
- `docs/engineering/TESTING_STRATEGY.md`
- `docs/operations/DATA_HANDLING.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`

## Required Changes

Create synthetic fixtures that:

- use existing contract schemas
- include fees and slippage when expected valid
- include drawdown context
- include data quality warnings for biased or missing-data cases
- include a blocked risk review with blocking findings
- include expected failure tags for tests
- contain no real market data
- contain no strategy performance claims

## Required Tests

Add tests proving:

- all valid fixtures parse through their contracts
- fee/slippage fixture includes required assumptions
- missing fee/slippage payloads are rejected by contract validation
- missing-data fixture includes data quality warnings
- biased backtest fixture is tagged as requiring review
- risk-veto fixture cannot be approved
- low-trade-count fixture includes a warning

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Benchmark fixture package exists.
- Fixture tests pass.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
