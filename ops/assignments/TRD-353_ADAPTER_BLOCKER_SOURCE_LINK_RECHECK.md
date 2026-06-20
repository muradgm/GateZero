# TRD-353 Adapter Blocker Source Link Recheck

## Goal

Recheck that adapter blocker records remain source-linked, indexed, and guard-visible.

## Scope

- Verify adapter blocker docs are discoverable from the docs index and tracklist.
- Keep the check documentation-only.
- Preserve Gate 1 historical-backtesting-only boundaries.

## Blocked

- No adapter implementation.
- No provider integration.
- No credentials, broker paths, orders, paper execution, live execution, or autonomous execution.

## Acceptance

- Source-link recheck document exists and is guard-visible.
- QA_SECURITY, RISK, and ORCHESTRATOR records exist.
- `pnpm verify:gate0` passes.
