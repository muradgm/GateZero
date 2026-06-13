# TRD-060: Gate 0 Operator Command Index

## Objective

Create a compact command index for current local Gate 0 operator commands.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Document current local operator commands.
- Group inspect, operating record, and quality commands.
- Link the index from the documentation index.
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

- `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-060_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-060_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-060_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Command index confirms `G0_RESEARCH`.
- Command index confirms `research_only`.
- Command index covers inspect, operating record, and quality commands.
- Command index remains documentation-only and non-approval-oriented.
- Command index does not add approval, readiness, profitability, performance, or future-phase
  eligibility semantics.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

- `pnpm check:gate0-name`
- `pnpm check:gate0-snapshot`
- `pnpm check:gate0-tracklist`
- `pnpm snapshot:gate0-progress`
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
