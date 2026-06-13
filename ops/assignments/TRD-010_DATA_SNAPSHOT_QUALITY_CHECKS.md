# TRD-010 - Data Snapshot Quality Checks

## Assigned Agent

`MARKET_DATA`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Add deterministic data snapshot quality checks over synthetic inputs:

- missing record warnings
- date range sanity
- symbol universe presence
- expected symbol coverage
- warning propagation

This packet must not add market data access, ingestion pipelines, broker integration, predictions,
execution behavior, or performance claims.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Data quality issues must be visible before backtest evidence is trusted.

## Allowed Files

- `packages/data-quality/README.md`
- `packages/data-quality/src/data-snapshot-quality.ts`
- `packages/data-quality/src/index.ts`
- `packages/data-quality/tests/data-snapshot-quality.test.ts`
- `ops/assignments/TRD-010_DATA_SNAPSHOT_QUALITY_CHECKS.md`
- `ops/runtime/reviews/TRD-010_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-010_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-010_ORCHESTRATOR_ACCEPTANCE.md`

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

- `docs/operations/DATA_HANDLING.md`
- `docs/engineering/TESTING_STRATEGY.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/runtime/reviews/TRD-009_ORCHESTRATOR_ACCEPTANCE.md`

## Required Changes

Create data quality helpers that:

- validate input through `DataSnapshotSchema`
- report existing quality warnings as findings
- flag empty symbol universe through contract validation
- flag missing expected symbols
- flag date range expectation mismatches
- return explicit findings without mutating input
- do not fetch or ingest data

## Required Tests

Add tests proving:

- a clean synthetic snapshot returns no findings
- existing quality warnings are propagated
- missing expected symbols are flagged
- date range expectation mismatches are flagged
- invalid snapshot payloads are rejected
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

- Data quality package exists.
- Data quality tests pass.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
