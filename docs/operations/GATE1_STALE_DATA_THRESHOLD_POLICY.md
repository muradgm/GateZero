# Gate 1 Stale Data Threshold Policy

Gate 1 stale-data handling remains local and historical. Snapshot age is reviewed as evidence
quality, not as a live market freshness signal.

## Policy

- Historical snapshots must carry generation time and a max-age policy before evidence review.
- Stale snapshots remain blocked until the operator and risk review accept the limitation.
- A future real-data adapter packet must define provider provenance, refresh cadence, and security
  controls before any external data access is added.

## Non-Goals

- No live market polling.
- No broker or account connectivity.
- No automatic override of stale-data blockers.

## Source Links

- Source packet: `ops/assignments/TRD-328_STALE_DATA_THRESHOLD_POLICY.md`
- Reviews: `ops/runtime/reviews/TRD-328_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-328_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-328_ORCHESTRATOR_ACCEPTANCE.md`
