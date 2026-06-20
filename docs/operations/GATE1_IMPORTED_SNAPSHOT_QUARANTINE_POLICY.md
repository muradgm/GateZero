# Gate 1 Imported Snapshot Quarantine Policy

Any future imported snapshot starts blocked until validation and review complete.

## Quarantine Rules

- Imported snapshots begin with evidence use blocked.
- Provider provenance must be present.
- License review must be present.
- Column schema and bid/ask completeness must be checked.
- Missing data, stale data, timezone, and duplicate records must be reviewed.

## Boundary

No imported snapshot flow exists yet. This policy prevents future imported data from becoming
evidence by default.

## Source Links

- Source packet: `ops/assignments/TRD-350_IMPORTED_SNAPSHOT_QUARANTINE_POLICY.md`
- Reviews: `ops/runtime/reviews/TRD-350_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-350_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-350_ORCHESTRATOR_ACCEPTANCE.md`
