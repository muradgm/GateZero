# Gate 1 Snapshot Column Completeness Guard

The Gate 1 contract guard now checks the synthetic bid/ask historical snapshot for required OHLC
columns.

## Required Columns

- `timestamp`
- `open_bid`
- `open_ask`
- `high_bid`
- `high_ask`
- `low_bid`
- `low_ask`
- `close_bid`
- `close_ask`

Each column must remain present and required.

## Boundary

This guard validates fixture structure only. It does not authorize live quotes, real data adapters,
or external provider access.

## Source Links

- Source packet: `ops/assignments/TRD-327_SNAPSHOT_COLUMN_COMPLETENESS_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-327_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-327_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-327_ORCHESTRATOR_ACCEPTANCE.md`
