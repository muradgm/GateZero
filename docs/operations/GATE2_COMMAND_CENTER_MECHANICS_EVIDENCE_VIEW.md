# Gate 2 Command Center Mechanics Evidence View

TRD-449 updates the command-center evidence surface for the local mechanics lane.

The command center remains read-only. It displays operating state and links to governed records; it
does not provide simulation controls, strategy selection, execution actions, or readiness labels.

## Source Links

- Source packet: `ops/assignments/TRD-449_COMMAND_CENTER_MECHANICS_EVIDENCE_VIEW.md`
- Reviews: `ops/runtime/reviews/TRD-449_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-449_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-449_ORCHESTRATOR_ACCEPTANCE.md`
- Command center data: `apps/web/src/command-center-data.js`
- Tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`,
  `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
