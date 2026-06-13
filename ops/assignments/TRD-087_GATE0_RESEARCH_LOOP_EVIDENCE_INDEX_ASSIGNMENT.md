# TRD-087: Gate 0 Research Loop Evidence Index Assignment

## Objective

Create a bounded packet for the evidence index if still useful.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local evidence index assignment note.
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
- Product code changes.
- Evidence index implementation in this packet.

## Required Outputs

- `docs/operations/GATE0_RESEARCH_LOOP_EVIDENCE_INDEX_ASSIGNMENT.md`
- Updated documentation index, artifact map, cross-link audit, and tracklist.
- TRD-087 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Assignment confirms `G0_RESEARCH`.
- Assignment confirms `research_only`.
- Assignment does not loosen gates or add autonomy.
- Full validation passes.
