# TRD-083: Gate 0 Ergonomics Freeze Compliance Check

## Objective

Check the freeze note remains represented in docs and tracker.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local ergonomics freeze compliance check.
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

- `docs/operations/GATE0_ERGONOMICS_FREEZE_COMPLIANCE_CHECK.md`
- Updated documentation index, artifact map, cross-link audit, and tracklist.
- TRD-083 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Check confirms `G0_RESEARCH`.
- Check confirms `research_only`.
- Check remains documentation-only and non-approval-oriented.
- Full validation passes.
