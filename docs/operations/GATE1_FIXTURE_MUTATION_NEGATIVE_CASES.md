# Gate 1 Fixture Mutation Negative Cases

Gate 1 blocked-evidence fixtures now have explicit mutation tests for boundary drift.

## Negative Cases

- Missing-candle evidence usability cannot become true.
- Stale-data blockers cannot carry approval claims.
- Duplicate-signal blockers cannot expose execution paths.
- Parameter-immutability blockers cannot revert to `G0_RESEARCH`.
- Evidence-bundle summaries cannot revert to `research_only`.

## Boundary

These are synthetic fixtures only. They do not contain market evidence, strategy results, broker
state, or account data.

## Source Links

- Source packet: `ops/assignments/TRD-326_FIXTURE_MUTATION_NEGATIVE_CASES.md`
- Reviews: `ops/runtime/reviews/TRD-326_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-326_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-326_ORCHESTRATOR_ACCEPTANCE.md`
