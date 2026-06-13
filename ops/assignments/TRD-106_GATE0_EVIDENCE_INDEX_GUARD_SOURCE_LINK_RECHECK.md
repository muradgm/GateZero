# TRD-106: Gate 0 Evidence Index Guard Source Link Recheck

## Objective

Recheck evidence-index guard source links after guard indexing and freeze compliance review.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a documentation-only source-link recheck for evidence-index guard records.
- Update evidence-index guard coverage, documentation index, artifact map, cross-link audit, and
  tracklist.
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

- `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_SOURCE_LINK_RECHECK.md`
- Updated local tracking references.
- TRD-106 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Recheck confirms guard docs remain source-linked.
- Recheck remains docs-only and local.
- Gate remains `G0_RESEARCH`.
- Full validation passes.
