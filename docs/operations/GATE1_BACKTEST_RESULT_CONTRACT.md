# Gate 1 Backtest Result Contract

## Purpose

This document records the local schema-only backtest result contract added for future evidence
records.

It does not run backtests, publish reports, approve strategies, move gates, or make performance
claims.

## Implemented Contract

- Source: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Test: `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Schema: `Gate1BacktestResultContractSchema`

## Boundary Fields

- `financial_gate`: `G0_RESEARCH`
- `scope`: `research_only`
- `contract_authority`: `schema_only`
- `evidence_only`: `true`
- `approval_claim`: `false`
- `performance_claim`: `false`
- `external_access`: `false`
- `execution_path`: `false`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_BACKTEST_RESULT_SCHEMA_PLAN.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-161_GATE1_BACKTEST_RESULT_CONTRACT_IMPLEMENTATION.md`
- Reviews: `ops/runtime/reviews/TRD-161_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-161_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-161_ORCHESTRATOR_ACCEPTANCE.md`
