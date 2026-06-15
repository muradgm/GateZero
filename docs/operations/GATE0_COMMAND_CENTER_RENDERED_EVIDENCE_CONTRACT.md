# Gate 0 Command Center Rendered Evidence Contract

## Purpose

This record documents the local render-contract guard for the command center.

## Command

```powershell
pnpm check:gate0-command-center-render
```

## Covered Contract

- Static app mount exists.
- Skip link and main target exist.
- Mobile evidence labels are rendered.
- Source links are grouped.
- Gate 0 and research-only copy remain present.
- Blocked execution-oriented action copy remains absent from app data.

## Boundary

The guard is local and static. It does not fetch external data, execute browser automation, deploy
the app, approve strategy quality, or change the operating gate.

## Source Links

- Source packet: `ops/assignments/TRD-204_COMMAND_CENTER_RENDERED_EVIDENCE_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-204_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-204_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-204_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-command-center-render-contract.ts`
- Tests: `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`
- Tracker: `ops/runtime/tracklist.md`
