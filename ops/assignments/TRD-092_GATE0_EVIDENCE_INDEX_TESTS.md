# TRD-092: Gate 0 Evidence Index Tests

## Objective

Add deterministic tests for the evidence-index shape.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add contract tests for schema behavior.
- Add fixture tests for deterministic local fixture behavior.
- Document test coverage.
- Update project records and reviews.

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

- `packages/contracts/tests/research-loop-evidence-index.test.ts`
- `packages/fixtures/tests/gate0-research-loop-evidence-index.test.ts`
- `docs/operations/GATE0_EVIDENCE_INDEX_TESTS.md`
- TRD-092 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Tests cover valid shape and bounded failure paths.
- Tests remain local and deterministic.
- Full validation passes.
