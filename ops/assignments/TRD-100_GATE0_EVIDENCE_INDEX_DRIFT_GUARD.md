# TRD-100: Gate 0 Evidence Index Drift Guard

## Objective

Implement a local read-only evidence-index drift guard.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local evidence-index drift guard script.
- Add a package script for the guard.
- Update command and validation tracking references.
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

- `scripts/check-gate0-evidence-index-drift.ts`
- `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`
- `package.json` command wiring.
- TRD-100 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Guard checks local evidence-index docs, sources, command records, and tracker references.
- Guard exits with bounded findings on drift.
- Gate remains `G0_RESEARCH`.
- Full validation passes.
