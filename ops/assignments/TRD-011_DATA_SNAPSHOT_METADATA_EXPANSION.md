# TRD-011 - Data Snapshot Metadata Expansion

## Assigned Agent

`MARKET_DATA`

Mandatory review agents: `QA_SECURITY`, `RISK`

## Objective

Expand the Gate 0 `DataSnapshot` contract to include required metadata:

- timezone
- missing-data behavior
- corporate action policy
- adjusted/raw data policy

This packet must not add market data access, ingestion pipelines, broker integration, predictions,
execution behavior, or performance claims.

## Current Financial Gate

`G0_RESEARCH`

## Product Wedge Relevance

Supports:

```text
No trade without evidence. No execution without risk approval.
```

Backtest evidence cannot be trusted unless data assumptions are explicit.

## Allowed Files

- `packages/contracts/src/data-snapshot.ts`
- `packages/contracts/tests/contracts.test.ts`
- `packages/fixtures/src/benchmark-fixtures.ts`
- `packages/fixtures/tests/benchmark-fixtures.test.ts`
- `packages/data-quality/src/data-snapshot-quality.ts`
- `packages/data-quality/tests/data-snapshot-quality.test.ts`
- `ops/assignments/TRD-011_DATA_SNAPSHOT_METADATA_EXPANSION.md`
- `ops/runtime/reviews/TRD-011_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-011_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-011_ORCHESTRATOR_ACCEPTANCE.md`

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
- `ops/runtime/reviews/TRD-010_ORCHESTRATOR_ACCEPTANCE.md`

## Required Changes

- Add required metadata fields to `DataSnapshotSchema`.
- Update all synthetic snapshot fixtures.
- Update data quality checker to optionally validate expected metadata.
- Add tests proving metadata is required and mismatches are flagged.

## Required Validation

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

## Done When

- Snapshot metadata fields are required by contract.
- Fixtures and quality checks are updated.
- Full validation passes.
- Gate remains `G0_RESEARCH`.
