# TRD-099: Gate 0 Evidence Index Drift Guard Assignment

## Objective

Bound the implementation of a local evidence-index drift guard.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a documentation-only assignment note for a future local evidence-index drift guard.
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

- `docs/operations/GATE0_EVIDENCE_INDEX_DRIFT_GUARD_ASSIGNMENT.md`
- Updated local tracking references.
- TRD-099 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Assignment bounds a local, deterministic, non-authorizing guard.
- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- Full validation passes.
