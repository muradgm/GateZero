# TRD-052: Gate 0 Operator Review Runbook

## Objective

Add a disciplined local operator review runbook for the Gate 0 dry-run inspect workflow.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Document when to run the local inspect routine.
- Document help, clear, friction, invalid scenario, and validation checks.
- Document escalation rules for QA_SECURITY, RISK, and ORCHESTRATOR.
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
- New product code.

## Required Outputs

- `docs/operations/GATE0_OPERATOR_REVIEW_RUNBOOK.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-052_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-052_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-052_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Runbook confirms `G0_RESEARCH`.
- Runbook confirms `research_only`.
- Runbook covers help, clear, friction, and invalid scenario paths.
- Runbook includes full validation commands.
- Runbook explains escalation without changing gate status.
- Runbook does not add product code.
- Runbook does not claim strategy approval, readiness, profitability, performance, or future-phase
  eligibility.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run -- --help`
- `pnpm inspect:gate0-dry-run -- -h`
- `pnpm inspect:gate0-dry-run`
- `pnpm inspect:gate0-dry-run -- --scenario friction`
- Invalid scenario command with expected nonzero exit.
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
