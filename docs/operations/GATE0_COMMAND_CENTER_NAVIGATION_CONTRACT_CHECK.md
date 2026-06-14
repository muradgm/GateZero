# Gate 0 Command Center Navigation Contract Check

## Purpose

This record documents the static check that keeps command-center navigation links aligned with
rendered section ids.

## Covered Sections

- Overview
- Loop
- Risk
- Evidence
- Actions
- Docs

## Boundary

Navigation checks improve operator orientation only. They do not add execution controls, external
data, prediction, strategy scoring, readiness labels, or approval semantics.

## Source Links

- Source packet: `ops/assignments/TRD-200_COMMAND_CENTER_NAVIGATION_CONTRACT_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-200_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-200_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-200_ORCHESTRATOR_ACCEPTANCE.md`
- Tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
