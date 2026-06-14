# Gate 0 Command Center Accessibility Contract Check

## Purpose

This record documents static checks for the command-center accessibility baseline.

## Covered Controls

- Skip link to `#main`
- Stable `main` target
- Evidence table caption
- Visible focus style

## Boundary

Accessibility checks reduce operator friction. They do not authorize execution, broker integration,
prediction, strategy readiness, strategy approval, public release, or risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-201_COMMAND_CENTER_ACCESSIBILITY_CONTRACT_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-201_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-201_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-201_ORCHESTRATOR_ACCEPTANCE.md`
- Tests: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
