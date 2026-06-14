# Gate 0 Command Center Data Contract

## Purpose

This document defines the static local data contract for the initial command center.

## Data Source

```text
apps/web/src/command-center-data.js
```

## Fields

- `project`: product name.
- `title`: command center title.
- `subtitle`: short operating purpose.
- `gate`: current operating gate.
- `scope`: current operating scope.
- `latestPacket`: latest accepted packet shown in the UI.
- `localVerification`: latest local verification summary.
- `ciRun`: latest recorded visible remote CI run.
- `ciState`: latest visible remote CI state.
- `navItems`: local navigation labels.
- `healthCards`: top-level operating health cards.
- `loopSteps`: protected-loop step labels.
- `boundaryItems`: blocked-scope reminders using non-executable UI language.
- `evidenceRows`: local and remote evidence table rows.
- `nextActions`: operator maintenance notes.
- `docs`: local source links.

## Boundary

The contract is display-only. It must not contain market data feeds, credentials, order state,
strategy rankings, AI recommendations, readiness scores, approval scores, or external APIs.

## Source Links

- Source packet: `ops/assignments/TRD-189_COMMAND_CENTER_DATA_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-189_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-189_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-189_ORCHESTRATOR_ACCEPTANCE.md`
- Data source: `apps/web/src/command-center-data.js`
- Tracker: `ops/runtime/tracklist.md`
