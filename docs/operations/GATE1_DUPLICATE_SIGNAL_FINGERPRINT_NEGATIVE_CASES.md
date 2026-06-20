# Gate 1 Duplicate Signal Fingerprint Negative Cases

Duplicate-signal blockers now reject weak duplicate evidence.

## Negative Cases

- Duplicate signal IDs must include at least two entries.
- Duplicate signal IDs must be distinct.
- Signal fingerprints must be non-empty.
- Duplicate signals remain blocked from evidence use.

## Boundary

Fingerprints are evidence hygiene only. They are not signals, predictions, or action
recommendations.

## Source Links

- Source packet: `ops/assignments/TRD-341_DUPLICATE_SIGNAL_FINGERPRINT_NEGATIVE_CASES.md`
- Reviews: `ops/runtime/reviews/TRD-341_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-341_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-341_ORCHESTRATOR_ACCEPTANCE.md`
