# TRD-074: Gate 0 Review Record Naming Check

## Objective

Verify assignment and review record naming remains consistent for Gate 0 packets.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local review-record naming check.
- Update documentation indexes and maps.
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
- Product code changes.

## Required Outputs

- `docs/operations/GATE0_REVIEW_RECORD_NAMING_CHECK.md`
- Updated documentation index and maps.
- Updated `ops/runtime/tracklist.md`
- TRD-074 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Check confirms `G0_RESEARCH`.
- Check confirms `research_only`.
- Check remains documentation-only and non-approval-oriented.
- Full validation passes.
