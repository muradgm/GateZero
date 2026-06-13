# TRD-078: Gate 0 Docs Coverage Drift Guard

## Objective

Implement a local read-only docs coverage drift guard.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local deterministic docs coverage check script.
- Add package command wiring for the check.
- Document the guard.
- Update the project tracklist.
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

- `scripts/check-gate0-docs-coverage.ts`
- `docs/operations/GATE0_DOCS_COVERAGE_DRIFT_GUARD.md`
- Updated `package.json`
- Updated `ops/runtime/tracklist.md`
- TRD-078 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Guard confirms `G0_RESEARCH`.
- Guard confirms `research_only`.
- Guard remains local, read-only, deterministic, and non-approval-oriented.
- Full validation passes.
