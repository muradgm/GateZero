# Gate 1 Duplicate Signal Fingerprint Contract

Duplicate-signal fingerprinting is a local evidence-hygiene boundary for Gate 1.

## Contract Boundary

- A signal fingerprint must identify the signal input shape being compared.
- Duplicate signal IDs must remain explicit when a duplicate blocker is raised.
- Duplicate signals block evidence use until the operator can review the duplicate cause.
- Fingerprints are not trade signals, predictions, or action recommendations.

## Non-Goals

- No deduplication engine.
- No automated signal approval.
- No broker or execution route.

## Source Links

- Source packet: `ops/assignments/TRD-330_DUPLICATE_SIGNAL_FINGERPRINT_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-330_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-330_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-330_ORCHESTRATOR_ACCEPTANCE.md`
