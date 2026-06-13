# TRD-055: Gate 0 Inspect Command Contract Notes

## Objective

Document the local inspect command input/output contract for the Gate 0 dry-run review workflow.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Document supported command forms.
- Document argument behavior, exit codes, stdout, and stderr.
- Document expected redacted output sections.
- Document invalid input handling.
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

- `docs/operations/GATE0_INSPECT_COMMAND_CONTRACT.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-055_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-055_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-055_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Contract notes confirm `G0_RESEARCH`.
- Contract notes confirm `research_only`.
- Contract notes document help, default, scenario, and invalid input paths.
- Contract notes document exit-code and stream behavior.
- Contract notes keep output expectations redacted and local.
- Contract notes do not add approval, readiness, profitability, performance, or future-phase
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
