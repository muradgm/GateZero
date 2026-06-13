# TRD-094: Gate 0 Evidence Index Coverage Check

## Objective

Verify that the Gate 0 evidence-index docs, schema, fixture, and tests are represented in local
tracking surfaces.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a documentation-only coverage check for evidence-index artifacts.
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

- `docs/operations/GATE0_EVIDENCE_INDEX_COVERAGE_CHECK.md`
- Updated local tracking references.
- TRD-094 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Coverage check confirms `G0_RESEARCH`.
- Coverage check confirms `research_only`.
- Coverage check remains local, deterministic, and docs-only.
- Full validation passes.
