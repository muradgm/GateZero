# Gate 1 Historical Data Snapshot Contract Plan

## Purpose

This plan defines the future historical data snapshot contract requirements for reproducible Gate 1
backtesting.

It is non-authorizing. It does not fetch data, implement ingestion, run backtests, add external API
access, add broker integration, or make strategy claims.

## Required Future Fields

- Snapshot id.
- Dataset source label.
- Instrument universe.
- Timeframe.
- Start and end timestamps.
- Data vendor or fixture origin label.
- Adjustment policy.
- Missing data policy.
- Timezone.
- Column schema.
- Content hash.
- Created-at timestamp.

## Validation Requirements

- Snapshot id must be stable.
- Time range must be explicit.
- Column schema must be deterministic.
- Missing data and adjustment policies must be declared.
- Content hash must be required before a backtest record can reference the snapshot.

## Blocked Assumptions

- No implicit live market data.
- No unstated data vendor.
- No hidden survivorship-bias policy.
- No broker data path.
- No performance or profitability interpretation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Gate 1 criteria: `docs/operations/GATE1_ENTRY_CRITERIA_DEFINITION.md`
- Contract assignment packet:
  `docs/operations/GATE1_HISTORICAL_BACKTEST_CONTRACT_ASSIGNMENT_PACKET.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-147_GATE1_HISTORICAL_DATA_SNAPSHOT_CONTRACT_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-147_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-147_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-147_ORCHESTRATOR_ACCEPTANCE.md`
