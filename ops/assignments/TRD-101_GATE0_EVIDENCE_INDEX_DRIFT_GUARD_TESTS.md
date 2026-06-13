# TRD-101: Gate 0 Evidence Index Drift Guard Tests

## Objective

Add bounded tests for the local evidence-index drift guard.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add local tests for pass and bounded failure paths.
- Add operator-facing test documentation.
- Update documentation index, artifact map, cross-link audit, and tracklist.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Blocked Scope

- Live trading.
- Broker integration.
- Autonomous execution.
- AI buy/sell prediction.
- Real or paper market order placement.
- Broker API key handling.
- External persistence services.
- API routes or UI flows.
- Report export or publishing workflows.
- Strategy approval language.
- Readiness claims.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- `packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts`
- `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_TESTS.md`
- TRD-101 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Tests cover aligned records.
- Tests cover missing document/source/command/index drift.
- Tests cover missing packet review reference drift.
- Full validation passes.
