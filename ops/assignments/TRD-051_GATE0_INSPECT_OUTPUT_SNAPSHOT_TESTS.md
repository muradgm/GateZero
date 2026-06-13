# TRD-051: Gate 0 Inspect Output Snapshot Tests

## Objective

Add stable tests around the Gate 0 dry-run inspect command output shape.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Refactor the local inspect CLI into a testable runner without changing command behavior.
- Add tests for help output, clear output, friction output, invalid scenario output, and redaction
  boundaries.
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

## Required Outputs

- `scripts/inspect-gate0-dry-run-output.ts`
- Updated `scripts/inspect-gate0-dry-run.ts`
- `packages/fixtures/tests/gate0-dry-run-inspect-cli-output.test.ts`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-051_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-051_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-051_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- CLI behavior remains unchanged for help, clear, friction, and invalid scenario paths.
- Tests cover help output.
- Tests cover clear output top-level shape.
- Tests cover friction output action boundary.
- Tests cover invalid scenario output.
- Tests verify inspect output remains redacted.
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
