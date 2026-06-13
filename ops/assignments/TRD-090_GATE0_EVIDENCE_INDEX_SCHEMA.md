# TRD-090: Gate 0 Evidence Index Schema

## Objective

Define the local evidence-index data shape.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local evidence-index schema.
- Export the schema from contracts.
- Document schema boundary.
- Update project records and reviews.

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

- `packages/contracts/src/research-loop-evidence-index.ts`
- `docs/operations/GATE0_EVIDENCE_INDEX_SCHEMA.md`
- Updated exports and operating records.
- TRD-090 QA_SECURITY, RISK, and ORCHESTRATOR review notes.

## Acceptance Criteria

- Schema enforces `G0_RESEARCH`.
- Schema enforces `research_only`.
- Schema blocks external access and execution path flags.
- Full validation passes.
