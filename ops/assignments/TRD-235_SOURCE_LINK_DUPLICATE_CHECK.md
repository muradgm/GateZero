# TRD-235 Source-Link Duplicate Check

## Goal

Add a local guard that detects duplicate paths in the tracklist source-of-truth link section.

## Allowed Scope

- Add a local duplicate-link checker.
- Add focused tests for pass and failure paths.
- Add the command to the Gate 0 guard suite.
- Document the guard and update control-plane indexes.
- Add QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Blocked Scope

- No external link crawling.
- No remote network checks.
- No live trading, broker integration, paper order mechanics, autonomous execution, AI prediction,
  broker API key handling, strategy approval, readiness semantics, profitability claims, marketing
  claims, or risk-gate loosening.

## Required Outputs

- `scripts/check-gate0-source-link-duplicates.ts`.
- `packages/fixtures/tests/gate0-source-link-duplicates.test.ts`.
- `docs/operations/GATE0_SOURCE_LINK_DUPLICATE_CHECK.md`.
- Updated `package.json`.

## Acceptance Criteria

- `pnpm check:gate0-source-links` passes.
- Focused tests pass.
- The guard is included in `pnpm check:gate0`.
- Gate remains `G0_RESEARCH` and scope remains `research_only`.

## Next Agent

QA_SECURITY review, then RISK review, then ORCHESTRATOR acceptance.
