# TRD-075: Gate 0 Source Links Coverage Check

## Objective

Verify source-link sections remain present in current operator-facing Gate 0 operations documents.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local source-links coverage check.
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

- `docs/operations/GATE0_SOURCE_LINKS_COVERAGE_CHECK.md`
- Updated documentation index and maps.
- Updated `ops/runtime/tracklist.md`
- TRD-075 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Check confirms `G0_RESEARCH`.
- Check confirms `research_only`.
- Check remains documentation-only and non-approval-oriented.
- Full validation passes.
