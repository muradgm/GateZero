# Gate 0 Command Center No-Execution Guardrails

## Purpose

This document records guardrails that keep the command center from becoming an execution,
prediction, approval, or marketing surface.

## Guardrails

- App data must show `G0_RESEARCH`.
- App data must show `research_only`.
- App data must avoid trading action language.
- App data must avoid broker connection copy.
- App data must avoid order-placement copy.
- App data must avoid readiness and approval semantics.

## Test

```powershell
pnpm test -- packages/fixtures/tests/gate0-command-center-data.test.ts
```

## Boundary

The command center may show operating health. It may not add broker integration, paper/live
execution, buy/sell prediction, strategy performance claims, readiness labels, approval labels, or
risk-gate loosening.

## Source Links

- Source packet: `ops/assignments/TRD-191_COMMAND_CENTER_NO_EXECUTION_GUARDRAILS.md`
- Reviews: `ops/runtime/reviews/TRD-191_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-191_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-191_ORCHESTRATOR_ACCEPTANCE.md`
- Test source: `packages/fixtures/tests/gate0-command-center-data.test.ts`
- Data source: `apps/web/src/command-center-data.js`
- Tracker: `ops/runtime/tracklist.md`
