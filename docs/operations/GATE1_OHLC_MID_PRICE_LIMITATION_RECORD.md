# Gate 1 OHLC Mid-Price Limitation Record

Gate 1 bid/ask OHLC evidence must not silently collapse into generic mid-price OHLC columns.

## Limitation

- Bid/ask fixtures require explicit bid and ask columns.
- Generic `open`, `high`, `low`, and `close` columns are not accepted in the bid/ask fixture.
- Future adapter work must preserve side-specific price provenance.

## Boundary

This record is a fixture guard and limitation note only. It does not authorize real historical data
adapter work or live quote access.

## Source Links

- Source packet: `ops/assignments/TRD-336_OHLC_MID_PRICE_LIMITATION_RECORD.md`
- Reviews: `ops/runtime/reviews/TRD-336_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-336_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-336_ORCHESTRATOR_ACCEPTANCE.md`
