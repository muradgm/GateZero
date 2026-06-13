# TRD-065: Gate 0 Command Index Coverage Check

## Objective

Verify that command index entries match package scripts and operator docs.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local command-index coverage check.
- Document package script coverage against the command index.
- Document alignment with validation audit and operator checklist references.
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

- `docs/operations/GATE0_COMMAND_INDEX_COVERAGE_CHECK.md`
- Updated `docs/operations/GATE0_OPERATOR_COMMAND_INDEX.md`
- Updated `docs/operations/GATE0_VALIDATION_COMMAND_AUDIT.md`
- Updated `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`
- Updated `docs/operations/GATE0_DOCUMENTATION_CROSS_LINK_AUDIT.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-065_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-065_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-065_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Check confirms `G0_RESEARCH`.
- Check confirms `research_only`.
- Check covers all current `package.json` scripts.
- Check maps package scripts to command index sections.
- Check references validation audit and operator checklist coverage.
- Check remains documentation-only and non-approval-oriented.
- Check does not add approval, readiness, profitability, performance, or future-phase eligibility
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
