# Gate 2 Failure Mode Fixtures And Tests

TRD-448 adds `createGate2LocalSimulationFailureModeFixtures`.

The fixtures exercise blocked local simulation paths for risk-review blockers, operator revision
decisions, and mismatched simulation records. They are synthetic only and carry no external account
or credential data.

## Source Links

- Source packet: `ops/assignments/TRD-448_FAILURE_MODE_FIXTURES_AND_TESTS.md`
- Reviews: `ops/runtime/reviews/TRD-448_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-448_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-448_ORCHESTRATOR_ACCEPTANCE.md`
- Source: `packages/core/src/gate2-local-simulation-engine.ts`
- Tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
