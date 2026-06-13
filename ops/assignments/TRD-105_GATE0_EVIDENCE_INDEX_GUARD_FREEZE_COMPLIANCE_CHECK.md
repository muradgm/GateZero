# TRD-105: Gate 0 Evidence Index Guard Freeze Compliance Check

## Objective

Verify that the evidence-index drift guard preserves the evidence-index freeze boundary.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a documentation-only freeze compliance check for the guard.
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

- `docs/operations/GATE0_EVIDENCE_INDEX_GUARD_FREEZE_COMPLIANCE_CHECK.md`
- Updated local tracking references.
- TRD-105 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Check confirms the guard preserves the freeze note.
- Check cannot authorize evidence-index expansion.
- Gate remains `G0_RESEARCH`.
- Full validation passes.
