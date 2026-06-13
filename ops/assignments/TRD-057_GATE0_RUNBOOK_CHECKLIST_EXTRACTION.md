# TRD-057: Gate 0 Runbook Checklist Extraction

## Objective

Extract a compact operator checklist from the Gate 0 operator review runbook.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Add a short operator checklist derived from the existing runbook.
- Keep checklist steps local, deterministic, and command-focused.
- Link checklist back to the full runbook and command contract.
- Update the documentation index.
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

- `docs/operations/GATE0_OPERATOR_CHECKLIST.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-057_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-057_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-057_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Checklist confirms `G0_RESEARCH`.
- Checklist confirms `research_only`.
- Checklist covers boundary, help, clear, friction, invalid input, and validation checks.
- Checklist links to the full runbook and command contract.
- Checklist remains documentation-only and non-approval-oriented.
- Checklist does not add approval, readiness, profitability, performance, or future-phase
  eligibility semantics.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run -- --help`
- `pnpm inspect:gate0-dry-run -- -h`
- `pnpm inspect:gate0-dry-run`
- `pnpm inspect:gate0-dry-run -- --scenario friction`
- Invalid scenario command with expected nonzero exit.
- `pnpm check:gate0-tracklist`
- `pnpm snapshot:gate0-progress`
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
