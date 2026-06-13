# TRD-064: Gate 0 Name Check Coverage Audit

## Objective

Confirm GateZero project-name coverage across package, docs, ops, and asset-adjacent text paths.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local name-check coverage audit.
- Document current project-name check surfaces, checked extensions, ignored paths, and regression
  tests.
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

- `docs/operations/GATE0_NAME_CHECK_COVERAGE_AUDIT.md`
- Updated `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Updated `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`
- Updated `docs/operations/GATE0_DOCUMENTATION_CROSS_LINK_AUDIT.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-064_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-064_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-064_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Audit confirms `G0_RESEARCH`.
- Audit confirms `research_only`.
- Audit covers current project-name check surfaces.
- Audit documents checked file extensions and ignored directories.
- Audit references regression test coverage.
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
