# TRD-050: Gate 0 Inspect Command Help Text

## Objective

Add local help text for the Gate 0 dry-run inspect command.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add `--help` and `-h` handling to the local inspect CLI.
- Print usage, static scenario keys, redacted output shape, and Gate 0 boundary.
- Keep help text local and informational.
- Update the dry-run walkthrough.
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

- Updated `scripts/inspect-gate0-dry-run.ts`
- Updated `docs/operations/GATE0_DRY_RUN_WALKTHROUGH.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-050_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-050_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-050_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- `--help` exits successfully.
- `-h` exits successfully.
- Help text lists only static local scenario keys.
- Help text confirms `G0_RESEARCH` and `research_only`.
- Help text does not print inspect JSON payloads.
- Valid `clear` and `friction` scenario paths still pass.
- Invalid scenario handling still exits nonzero with bounded usage text.
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
