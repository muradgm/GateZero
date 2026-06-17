# Gate 0 Command Center Local Auto Refresh

## Purpose

This record documents the command center's local auto-refresh behavior.

The browser refreshes from the same-origin local preview endpoint and falls back to checked-in
static data when the app is opened without the preview server.

## Refresh Behavior

| Field            | Value                                                       |
| ---------------- | ----------------------------------------------------------- |
| Local endpoint   | `/runtime/command-center-data.json`                         |
| Refresh interval | `15` seconds                                                |
| Fallback         | `apps/web/src/command-center-data.js`                       |
| UI source        | `apps/web/src/main.js`                                      |
| Tests            | `packages/fixtures/tests/gate0-command-center-data.test.ts` |

## Boundary

This refresh does not add external live data fetching, broker access, execution pathways, AI
prediction, strategy approval, readiness claims, profitability claims, report publishing, credential
handling, or risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-246_COMMAND_CENTER_LOCAL_AUTO_REFRESH.md`
- Reviews: `ops/runtime/reviews/TRD-246_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-246_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-246_ORCHESTRATOR_ACCEPTANCE.md`
- Command center app: `apps/web/src/main.js`
- Command center data: `apps/web/src/command-center-data.js`
- Command center tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Runtime snapshot: `docs/operations/GATE0_COMMAND_CENTER_LOCAL_RUNTIME_SNAPSHOT.md`
- Tracker: `ops/runtime/tracklist.md`
