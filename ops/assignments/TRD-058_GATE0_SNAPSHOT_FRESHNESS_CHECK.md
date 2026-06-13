# TRD-058: Gate 0 Snapshot Freshness Check

## Objective

Add a local check that verifies the generated Gate 0 progress snapshot matches the latest accepted
packet and current local record counts.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local freshness script for the generated progress snapshot.
- Add a package command for the check.
- Add focused tests for passing and failing freshness states.
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

- `scripts/check-gate0-progress-snapshot-freshness.ts`
- `packages/fixtures/tests/gate0-progress-snapshot-freshness.test.ts`
- Updated `package.json`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-058_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-058_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-058_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Check passes when snapshot latest packet and counts match local records.
- Check fails when snapshot latest packet is stale.
- Check fails when snapshot counts are stale.
- Check is local and deterministic.
- Check does not create external publishing paths.
- Tests cover passing and failing states.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

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
