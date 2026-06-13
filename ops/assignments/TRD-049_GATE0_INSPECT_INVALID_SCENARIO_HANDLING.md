# TRD-049: Gate 0 Inspect Invalid Scenario Handling

## Objective

Make invalid Gate 0 dry-run inspect scenario input return a bounded local error without stack noise.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Catch invalid inspect scenario input in the local CLI.
- Print a concise local error and usage text.
- Exit with a nonzero process code for invalid input.
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
- Raw bundle output expansion.
- Strategy approval language.
- Readiness claims.
- Strategy profitability or performance claims.
- Risk-gate loosening.

## Required Outputs

- Updated `scripts/inspect-gate0-dry-run.ts`
- Updated `docs/operations/GATE0_DRY_RUN_WALKTHROUGH.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-049_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-049_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-049_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Invalid scenario input exits nonzero.
- Invalid scenario input prints bounded usage text.
- Invalid scenario input does not print stack traces.
- Valid `clear` and `friction` scenario paths still pass.
- Output remains redacted and local-only.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

- `pnpm inspect:gate0-dry-run`
- `pnpm inspect:gate0-dry-run -- --scenario friction`
- Invalid scenario command with expected nonzero exit.
- `pnpm lint`
- `pnpm format:check`
- `pnpm typecheck`
- `pnpm test`
- `pnpm validate:gate0`
