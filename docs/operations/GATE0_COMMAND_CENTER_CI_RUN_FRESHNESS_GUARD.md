# Gate 0 Command Center CI Run Freshness Guard

## Purpose

This record documents the guard extension that checks the command center's displayed CI run against
the local remote-verification evidence index.

## Guarded Field

- `ciRun` in `apps/web/src/command-center-data.js`
- Latest run id in `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`

## Command

```powershell
pnpm check:gate0-command-center
```

## Boundary

The guard reads local repository records. It does not call GitHub, fetch external data, publish
reports, approve strategy quality, or change the operating gate.

## Source Links

- Source packet: `ops/assignments/TRD-199_COMMAND_CENTER_CI_RUN_FRESHNESS_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-199_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-199_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-199_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-command-center-freshness.ts`
- Tests: `packages/fixtures/tests/gate0-command-center-freshness-check.test.ts`
- Tracker: `ops/runtime/tracklist.md`
