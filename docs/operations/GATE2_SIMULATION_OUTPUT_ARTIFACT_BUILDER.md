# Gate 2 Simulation Output Artifact Builder

TRD-446 adds `buildGate2LocalSimulationOutputArtifact`.

The builder converts a local input assembly and local engine result into a deterministic artifact
record. The artifact is not an order, not an approval, and not execution authority.

## Source Links

- Source packet: `ops/assignments/TRD-446_SIMULATION_OUTPUT_ARTIFACT_BUILDER.md`
- Reviews: `ops/runtime/reviews/TRD-446_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-446_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-446_ORCHESTRATOR_ACCEPTANCE.md`
- Source: `packages/core/src/gate2-local-simulation-engine.ts`
- Tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
