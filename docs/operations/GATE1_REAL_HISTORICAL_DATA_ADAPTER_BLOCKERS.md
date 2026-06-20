# Gate 1 Real Historical Data Adapter Blockers

TraderFrame remains on synthetic fixtures until a separate adapter authorization packet exists.

## Required Future Blockers

- Provider provenance and licensing review.
- Credential and secret-handling review.
- Local schema validation for imported bars.
- Missing, stale, duplicate, timezone, and bid/ask completeness checks.
- QA/security review proving no live, paper, broker, or account route is present.

## Current Decision

No real historical data adapter is authorized in this packet.

## Source Links

- Source packet: `ops/assignments/TRD-331_REAL_HISTORICAL_DATA_ADAPTER_BLOCKERS.md`
- Reviews: `ops/runtime/reviews/TRD-331_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-331_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-331_ORCHESTRATOR_ACCEPTANCE.md`
