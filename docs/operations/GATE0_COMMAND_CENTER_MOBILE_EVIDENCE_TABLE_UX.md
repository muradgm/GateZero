# Gate 0 Command Center Mobile Evidence Table UX

## Purpose

This record documents the mobile readability pass for the command-center evidence table.

## Change

On small viewports, evidence rows use labelled row cards instead of relying on a wide table layout.

Each evidence cell carries a `data-label` value so the mobile layout can show:

- Area
- Signal
- State
- Reference

## Boundary

This is a readability improvement only. It does not add new data authority, execution controls,
broker integration, prediction, strategy selection, readiness labels, approval semantics, or
risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-205_COMMAND_CENTER_MOBILE_EVIDENCE_TABLE_UX.md`
- Reviews: `ops/runtime/reviews/TRD-205_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-205_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-205_ORCHESTRATOR_ACCEPTANCE.md`
- Web app: `apps/web/`
- Tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Tracker: `ops/runtime/tracklist.md`
