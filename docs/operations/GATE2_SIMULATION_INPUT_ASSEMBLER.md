# Gate 2 Simulation Input Assembler

TRD-445 adds `assembleGate2LocalSimulationInput`.

The assembler validates existing Gate 2 contracts, builds a local input assembly record, carries
blocking reasons forward, and returns the parsed engine input. It does not fetch data, connect
accounts, dispatch actions, hold credentials, or infer approval.

## Source Links

- Source packet: `ops/assignments/TRD-445_SIMULATION_INPUT_ASSEMBLER.md`
- Reviews: `ops/runtime/reviews/TRD-445_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-445_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-445_ORCHESTRATOR_ACCEPTANCE.md`
- Source: `packages/core/src/gate2-local-simulation-engine.ts`
- Tests: `packages/core/tests/gate2-local-simulation-engine.test.ts`
