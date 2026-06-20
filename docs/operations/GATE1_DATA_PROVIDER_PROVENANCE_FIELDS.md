# Gate 1 Data Provider Provenance Fields

Future data-provider records need provenance fields before any adapter implementation.

## Draft Fields

- Provider label.
- License or permitted-use status.
- Retrieval method.
- Retrieval timestamp.
- Snapshot date range.
- Instrument universe.
- Content hash.
- Adjustment and missing-data policy.

## Boundary

These are planning fields only. No provider integration, credential handling, or network fetch path
is added.

## Source Links

- Source packet: `ops/assignments/TRD-338_DATA_PROVIDER_PROVENANCE_FIELDS.md`
- Reviews: `ops/runtime/reviews/TRD-338_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-338_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-338_ORCHESTRATOR_ACCEPTANCE.md`
