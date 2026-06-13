# Gate 1 Historical Backtest Contract Assignment Packet

## Purpose

This packet defines the future boundary for historical backtest contract work.

It is non-authorizing. It does not move GateZero out of `G0_RESEARCH`, implement backtesting, add
broker integration, add paper or live execution, add AI prediction, publish reports, or make
strategy performance claims.

## Future Goal

Prepare contracts and fixtures that could support historical-data-only backtest records after a
later explicit implementation assignment.

## Required Agents

- ORCHESTRATOR.
- PM.
- QUANT.
- RISK.
- QA_SECURITY.
- BACKEND.

## Future Allowed Files

- `packages/contracts/src/gate1-historical-data-snapshot.ts`
- `packages/contracts/src/gate1-strategy-version.ts`
- `packages/contracts/src/gate1-fees-slippage.ts`
- `packages/contracts/src/gate1-backtest-record.ts`
- `packages/contracts/tests/gate1-*.test.ts`
- `packages/fixtures/src/gate1-*.ts`
- `packages/fixtures/tests/gate1-*.test.ts`
- `docs/operations/GATE1_*.md`

## Future Blocked Files

- Broker adapters.
- Execution services.
- Order placement modules.
- Broker secret handling.
- Live or paper trading modules.
- External publishing modules.
- Strategy promotion records.
- Risk gate or truth files unless explicitly assigned by governance.

## Required Future Contracts

- Historical data snapshot contract.
- Strategy version contract.
- Fees and slippage assumption contract.
- Immutable backtest record contract.
- Reproducibility check contract.

## Required Future Tests

- Runtime validation pass and fail paths.
- Deterministic fixture reads.
- Reproducibility mismatch cases.
- Blocked missing-cost cases.
- Immutable record identity cases.

## Acceptance Criteria

A later implementation packet must keep the active gate explicit, remain local, avoid performance
claims, include QA_SECURITY and RISK reviews, and pass `pnpm verify:gate0`.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Gate 1 criteria: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Gate 1 planning draft: `docs/operations/GATE1_PLANNING_PACKET_DRAFT.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-146_GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`
- Reviews: `ops/runtime/reviews/TRD-146_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-146_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-146_ORCHESTRATOR_ACCEPTANCE.md`
