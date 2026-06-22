# Gate 2 Replay Determinism Guard

TRD-447 adds `checkGate2LocalSimulationReplayDeterminism`.

The guard compares local simulation outputs by deterministic replay key and payload equality. A
passing replay check is repository evidence only; it does not approve or promote a strategy.

## Source Links

- Source packet: `ops/assignments/TRD-447_REPLAY_DETERMINISM_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-447_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-447_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-447_ORCHESTRATOR_ACCEPTANCE.md`
- Source: `packages/core/src/gate2-local-simulation-engine.ts`
- Tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
