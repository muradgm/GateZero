# TRD-088: Gate 0 Evidence Index Source Link Check

## Objective

Check proposed evidence-index docs preserve local source links.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local source-link check for evidence-index proposal docs.
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

## Required Outputs

- `docs/operations/GATE0_EVIDENCE_INDEX_SOURCE_LINK_CHECK.md`
- Updated documentation index, artifact map, cross-link audit, and tracklist.
- TRD-088 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Check confirms `G0_RESEARCH`.
- Check confirms `research_only`.
- Check remains docs-only and non-authorizing.
- Full validation passes.
