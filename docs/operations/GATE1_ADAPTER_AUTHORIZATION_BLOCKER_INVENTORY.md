# Gate 1 Adapter Authorization Blocker Inventory

Real historical data adapters remain blocked until every authorization blocker is resolved.

## Blockers

- Provider provenance record is missing.
- Provider license review is missing.
- Credential and secret-handling policy is missing.
- Imported snapshot quarantine contract is missing.
- Schema validation for imported bars is missing.
- QA/security review for provider access is missing.
- Risk review for evidence use is missing.

## Current Decision

No adapter work is authorized. Synthetic fixtures remain the only current data source.

## Source Links

- Source packet: `ops/assignments/TRD-343_ADAPTER_AUTHORIZATION_BLOCKER_INVENTORY.md`
- Reviews: `ops/runtime/reviews/TRD-343_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-343_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-343_ORCHESTRATOR_ACCEPTANCE.md`
