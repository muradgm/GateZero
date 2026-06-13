# TRD-063: Gate 0 Validation Command Audit

## Objective

Audit current Gate 0 validation commands against accepted local checks.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local validation-command audit.
- Map current validation commands to local script or package sources.
- Confirm commands remain local, deterministic, bounded, and non-approval-oriented.
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

- `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Updated `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Updated `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`
- Updated `docs/operations/GATE0_DOCUMENTATION_CROSS_LINK_AUDIT.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-063_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-063_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-063_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Audit confirms `G0_RESEARCH`.
- Audit confirms `research_only`.
- Audit covers all current validation commands listed in the tracklist.
- Audit maps commands to local script or package sources.
- Audit remains documentation-only and non-approval-oriented.
- Audit does not add approval, readiness, profitability, performance, or future-phase eligibility
  semantics.
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
