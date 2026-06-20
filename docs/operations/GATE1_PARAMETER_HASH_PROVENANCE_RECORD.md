# Gate 1 Parameter Hash Provenance Record

Parameter hashes support reproducibility and drift detection. They do not approve a strategy.

## Provenance Rules

- Expected parameter hashes identify the strategy-version input intended for a run.
- Observed parameter hashes identify the input actually seen during review.
- Any mismatch remains a blocker until reviewed.
- Matching hashes only support provenance; they do not imply profitability, readiness, or risk
  acceptance.

## Boundary

No strategy promotion, automated approval, or execution path is introduced by this record.

## Source Links

- Source packet: `ops/assignments/TRD-329_PARAMETER_HASH_PROVENANCE_RECORD.md`
- Reviews: `ops/runtime/reviews/TRD-329_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-329_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-329_ORCHESTRATOR_ACCEPTANCE.md`
