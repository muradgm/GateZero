# Gate 1 Historical Data OHLC Bid/Ask Column Plan

## Purpose

Plan bid/ask-aware OHLC column requirements for Gate 1 historical data snapshots.

## Required Columns

- `open_bid`, `open_ask`
- `high_bid`, `high_ask`
- `low_bid`, `low_ask`
- `close_bid`, `close_ask`

## Boundary

The plan improves historical evidence shape only. It does not fetch live data, connect accounts, or
place orders.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-285_HISTORICAL_DATA_OHLC_BID_ASK_COLUMN_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-285_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-285_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-285_ORCHESTRATOR_ACCEPTANCE.md`
