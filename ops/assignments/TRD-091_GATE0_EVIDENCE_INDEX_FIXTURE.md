# TRD-091: Gate 0 Evidence Index Fixture

## Objective

Add a synthetic local evidence-index fixture.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a synthetic local evidence-index fixture.
- Export the fixture from fixtures.
- Document fixture boundary.
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
- Real market or order data.
- Report export or publishing workflows.
- Strategy approval language.
- Readiness claims.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- `packages/fixtures/src/gate0-research-loop-evidence-index.ts`
- `docs/operations/GATE0_EVIDENCE_INDEX_FIXTURE.md`
- Updated exports and operating records.
- TRD-091 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Fixture is synthetic and deterministic.
- Fixture validates against the schema.
- Fixture remains Research Only.
- Full validation passes.
