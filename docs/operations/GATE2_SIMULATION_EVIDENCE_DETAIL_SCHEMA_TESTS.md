# Gate 2 Simulation Evidence Detail Schema Tests

TRD: TRD-533

## Coverage

The contract tests validate local evidence detail records and reject missing source artifacts,
nonlocal source paths, missing source-link maps, action paths, account paths, credential paths, live
routes, automation, approval claims, performance claims, and blocked failure-mode dependencies in
fresh evidence.

## Boundary

The tests treat passing validation as repository health only. They do not create execution authority
or strategy approval.

## Source Links

- Source packet: `ops/assignments/TRD-533_SIMULATION_EVIDENCE_SCHEMA_TESTS.md`
- `packages/contracts/tests/gate2-paper-simulation-contracts.test.ts`
- `packages/contracts/src/gate2-paper-simulation-contracts.ts`
- `ops/runtime/reviews/TRD-533_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-533_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-533_ORCHESTRATOR_ACCEPTANCE.md`
