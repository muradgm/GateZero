# Gate 1 Parameter Hash Negative Cases Plan

Parameter hash canonicalization needs negative cases before implementation.

## Planned Negative Cases

- Missing parameter schema version.
- Unstable key order.
- Type drift between numeric and string values.
- Hashing display text instead of canonical payload.
- Missing strategy version identifier.

## Boundary

This is planning only. Parameter hashes remain provenance evidence and do not approve strategy
quality.

## Source Links

- Source packet: `ops/assignments/TRD-346_PARAMETER_HASH_NEGATIVE_CASES_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-346_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-346_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-346_ORCHESTRATOR_ACCEPTANCE.md`
