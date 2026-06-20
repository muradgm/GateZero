# Gate 1 Adapter Fixture Import Contract Plan

Future adapter imports must produce quarantined, schema-checked fixtures before any evidence use.

## Draft Contract Requirements

- Provider provenance fields.
- License review reference.
- Retrieval timestamp.
- Snapshot hash.
- Column schema.
- Timezone policy.
- Bid/ask completeness status.
- Quarantine status.

## Boundary

This is a contract plan only. No parser, provider integration, network fetch, or credential path is
added.

## Source Links

- Source packet: `ops/assignments/TRD-344_ADAPTER_FIXTURE_IMPORT_CONTRACT_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-344_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-344_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-344_ORCHESTRATOR_ACCEPTANCE.md`
