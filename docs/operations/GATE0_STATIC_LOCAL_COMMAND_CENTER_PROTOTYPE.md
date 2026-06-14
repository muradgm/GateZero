# Gate 0 Static Local Command Center Prototype

## Purpose

This record documents the initial static command center prototype in `apps/web`.

## Artifacts

- `apps/web/index.html`
- `apps/web/src/main.js`
- `apps/web/src/command-center-data.js`
- `apps/web/src/styles.css`
- `apps/web/README.md`

## Surface

The prototype shows:

- Gate and scope.
- Local verification health.
- Remote CI evidence health.
- Review coverage.
- Protected-loop steps.
- Risk boundary reminders.
- Evidence freshness rows.
- Source links.

## Boundary

The prototype is read-only and local-first. It has no external data access, credentials, broker
access, order controls, prediction features, strategy rankings, approval labels, readiness labels,
or performance claims.

## Source Links

- Source packet: `ops/assignments/TRD-190_STATIC_LOCAL_COMMAND_CENTER_PROTOTYPE.md`
- Reviews: `ops/runtime/reviews/TRD-190_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-190_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-190_ORCHESTRATOR_ACCEPTANCE.md`
- Scope record: `docs/operations/GATE0_COMMAND_CENTER_SCOPE_AND_BOUNDARY.md`
- Data contract: `docs/operations/GATE0_COMMAND_CENTER_DATA_CONTRACT.md`
- Tracker: `ops/runtime/tracklist.md`
