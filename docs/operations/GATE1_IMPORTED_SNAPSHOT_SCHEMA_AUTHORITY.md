# Gate 1 Imported Snapshot Schema Authority

TRD-354 defines the planning-level schema authority for any future imported historical snapshot
fixture.

## Authority

- `Gate1HistoricalDataSnapshotContractSchema` remains the authority for historical snapshot shape.
- Bid/ask OHLC snapshots must keep explicit bid and ask columns rather than generic mid-price OHLC.
- Imported snapshots must remain quarantined until a future local validation command accepts them.
- Imported snapshot records must preserve `G1_BACKTESTING`, `historical_backtesting_only`,
  `external_access: false`, and `execution_path: false`.

## Boundary

This record does not add import parsing, provider fetches, data promotion, credentials, execution
routes, or performance claims.

## Source Links

- Source packet: `ops/assignments/TRD-354_IMPORTED_SNAPSHOT_SCHEMA_AUTHORITY.md`
- Reviews: `ops/runtime/reviews/TRD-354_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-354_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-354_ORCHESTRATOR_ACCEPTANCE.md`
