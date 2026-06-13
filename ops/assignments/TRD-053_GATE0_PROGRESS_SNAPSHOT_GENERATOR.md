# TRD-053: Gate 0 Progress Snapshot Generator

## Objective

Add a local progress snapshot generator that summarizes accepted Gate 0 operating records.

## Required Agents

- ORCHESTRATOR
- BACKEND
- QA_SECURITY
- RISK

## Allowed Scope

- Add a local script that reads assignments, acceptance records, and the tracklist.
- Write a deterministic markdown snapshot under `ops/runtime/progress/`.
- Add focused tests for snapshot creation and rendering.
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

- `scripts/generate-gate0-progress-snapshot.ts`
- `packages/fixtures/tests/gate0-progress-snapshot-generator.test.ts`
- `ops/runtime/progress/GATE0_PROGRESS_SNAPSHOT.md`
- Updated `package.json`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-053_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-053_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-053_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Snapshot generator is local-only.
- Snapshot generator reads accepted ops records.
- Snapshot includes latest accepted packet and validation count.
- Snapshot includes assignment, accepted, and open counts.
- Snapshot does not include raw review payloads.
- Snapshot does not create external publishing paths.
- Tests cover snapshot creation and rendering.
- Tracklist is updated after acceptance.
- Full validation passes.

## Validation Commands

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
