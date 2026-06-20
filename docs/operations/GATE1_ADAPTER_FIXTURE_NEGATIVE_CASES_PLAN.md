# Gate 1 Adapter Fixture Negative Cases Plan

TRD-357 plans future negative cases for imported adapter fixture validation.

## Planned Negative Cases

- Snapshot missing required timestamp, bid, ask, or close columns.
- Snapshot using generic OHLC mid-price columns where bid/ask fields are required.
- Snapshot with provider provenance omitted or ambiguous.
- Snapshot with `external_access`, `execution_path`, approval claims, or performance claims set.
- Snapshot with unreviewed license status or retention status.
- Snapshot with duplicate candles, stale range metadata, or unverifiable timezone assumptions.

## Boundary

These are planned future test classes only. This record adds no parser, fixture importer, provider
adapter, credential handling, or evidence promotion behavior.

## Source Links

- Source packet: `ops/assignments/TRD-357_ADAPTER_FIXTURE_NEGATIVE_CASES_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-357_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-357_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-357_ORCHESTRATOR_ACCEPTANCE.md`
