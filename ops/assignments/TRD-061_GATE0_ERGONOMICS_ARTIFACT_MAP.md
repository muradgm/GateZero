# TRD-061: Gate 0 Ergonomics Artifact Map

## Objective

Map accepted Gate 0 operator ergonomics artifacts to their source packets.

## Required Agents

- ORCHESTRATOR
- QA_SECURITY
- RISK

## Allowed Scope

- Create a local documentation artifact map for TRD-044 through TRD-060.
- Link artifacts to source packets and paths.
- Link the map from the documentation index.
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

- `docs/operations/GATE0_ERGONOMICS_ARTIFACT_MAP.md`
- Updated `docs/README.md`
- Updated `ops/runtime/tracklist.md`
- `ops/runtime/reviews/TRD-061_QA_SECURITY_REVIEW.md`
- `ops/runtime/reviews/TRD-061_RISK_REVIEW.md`
- `ops/runtime/reviews/TRD-061_ORCHESTRATOR_ACCEPTANCE.md`

## Acceptance Criteria

- Artifact map confirms `G0_RESEARCH`.
- Artifact map confirms `research_only`.
- Artifact map covers accepted ergonomics packets from TRD-044 through TRD-060.
- Artifact map links artifacts to local paths.
- Artifact map remains documentation-only and non-approval-oriented.
- Artifact map does not add approval, readiness, profitability, performance, or future-phase
  eligibility semantics.
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
