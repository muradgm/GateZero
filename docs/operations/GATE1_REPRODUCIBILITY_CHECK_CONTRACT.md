# Gate 1 Reproducibility Check Contract

## Purpose

This document records the local schema-only reproducibility check contract added for future evidence
use decisions.

It does not rerun backtests, fetch external data, publish reports, approve strategies, move gates,
or make performance claims.

## Implemented Contract

- Source: `packages/contracts/src/gate1-historical-backtest-contracts.ts`
- Test: `packages/contracts/tests/gate1-historical-backtest-contracts.test.ts`
- Schema: `Gate1ReproducibilityCheckContractSchema`

## Boundary Fields

- `financial_gate`: `G1_BACKTESTING`
- `scope`: `historical_backtesting_only`
- `contract_authority`: `schema_only`
- `external_access`: `false`
- `execution_path`: `false`

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Planning doc: `docs/operations/GATE1_REPRODUCIBILITY_CHECK_PLAN.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-162_GATE1_REPRODUCIBILITY_CHECK_CONTRACT_IMPLEMENTATION.md`
- Reviews: `ops/runtime/reviews/TRD-162_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-162_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-162_ORCHESTRATOR_ACCEPTANCE.md`
