# TRD-059: Gate 0 Project Name Check

## Objective

Rename the app identity to GateZero and add a local check that prevents the previous app name from
returning in repo-relative paths or checked text files.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Rename user-facing project references to GateZero.
- Keep package metadata lowercase as `gatezero`.
- Rename repo-relative legacy app-name paths where safe.
- Add a local project-name check script.
- Add focused tests for passing and failing name states.
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

- `scripts/check-gate0-project-name.ts`
- `packages/fixtures/tests/gate0-project-name-check.test.ts`
- Updated `package.json`
- Updated project docs and ops references.
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-059_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-059_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-059_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- User-facing app name is GateZero.
- Package name is `gatezero`.
- Check passes when app-name surfaces use GateZero.
- Check fails when the previous display name appears in checked content.
- Check fails when the previous lowercase package name appears in repo-relative paths.
- Check is local and deterministic.
- Check does not create external publishing paths.
- Tests cover passing and failing states.
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
