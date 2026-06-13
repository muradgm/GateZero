# TRD-093: Gate 0 Evidence Index Documentation

## Objective

Document the local evidence index and boundary.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add operator-facing local evidence-index documentation.
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

- `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX.md`
- Updated documentation index, artifact map, cross-link audit, and tracklist.
- TRD-093 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Documentation confirms `G0_RESEARCH`.
- Documentation confirms `research_only`.
- Documentation remains non-authorizing.
- Full validation passes.
