# TRD-054: Gate 0 Tracklist Consistency Check

## Objective

Add a local check that accepted packet records and `ops/runtime/tracklist.md` stay aligned.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local consistency script for accepted packet records and tracklist ledger rows.
- Add a package command for the check.
- Add focused tests for passing and failing consistency states.
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

- `scripts/check-gate0-tracklist-consistency.ts`
- `packages/fixtures/tests/gate0-tracklist-consistency.test.ts`
- Updated `package.json`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-054_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-054_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-054_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Check passes when accepted packet records and tracklist ledger rows align.
- Check fails on stale latest accepted packet.
- Check fails on missing or unexpected accepted ledger rows.
- Check is local and deterministic.
- Check does not create external publishing paths.
- Tests cover passing and failing states.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

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
