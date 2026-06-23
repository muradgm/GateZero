# Gate 2 Read-Only Frontend Implementation Packet Draft

## Summary

TRD-479 drafts the first bounded implementation packet for a TraderFrame read-only frontend app
shell.

This is not product-code implementation. It is the control packet that a later frontend build must
follow.

## Operating Boundary

| Field             | Value                              |
| ----------------- | ---------------------------------- |
| Financial gate    | `G2_PAPER_TRADING`                 |
| Operating scope   | `paper_simulation_planning_only`   |
| Frontend posture  | Read-only control-plane visibility |
| Data posture      | Local static/runtime data only     |
| Execution posture | No execution path                  |

## Allowed Build Objective

A later implementation packet may build a read-only TraderFrame frontend that helps the operator
inspect:

- Current gate, scope, and blocked scope.
- Local verification state and review coverage.
- Evidence bundle status and source links.
- Risk review state and blockers.
- Paper-simulation limitations and assumptions.
- Manual operator workflow state.
- Docs, packets, guards, and review records.

## Allowed Files For Later Build

- `apps/web/index.html`
- `apps/web/src/main.js`
- `apps/web/src/command-center-data.js`
- `apps/web/src/styles.css`
- `packages/fixtures/tests/gate0-command-center-data.test.ts`
- `packages/fixtures/tests/gate0-command-center-render-contract.test.ts`
- `packages/fixtures/tests/gate0-command-center-runtime-data.test.ts`
- Local guard scripts only when they verify read-only rendering, local data, accessibility, or
  blocked UI affordances.

## Blocked Files And Surfaces

- Broker connectors or account connection files.
- Credential, API-key, token, or secret handling.
- Live route, order placement, or external dispatch code.
- Autonomous action schedulers or execution workers.
- AI buy/sell prediction prompts or signal generation surfaces.
- Approval, readiness, safety, profitability, deployment, or public performance-claim copy.
- Any UI control that could be read as placing, submitting, routing, approving, or automating a
  trading action.

## Required Implementation Rules For The Next Packet

- Use local read-only data contracts.
- Keep data loading, rendering, and copy constants separable.
- Put risk and limitation copy near evidence, not in a distant footer.
- Preserve keyboard navigation, semantic landmarks, focus states, captions, and responsive
  readability.
- Add tests or scanner coverage for blocked action-like labels and affordances.
- Do not add a landing page, marketing hero, trading-terminal layout, or outcome-first dashboard.
- Keep copy literal, calm, evidence-first, and claim-safe.

## QA Requirements

- Run command-center render and freshness checks.
- Verify no blocked UI language is introduced.
- Verify no external service, credential, account, broker, order, or live route code is introduced.
- Verify keyboard and responsive behavior before accepting a rendered frontend change.
- Keep full `pnpm verify:gate0` green.

## Risk Requirements

- Gate remains `G2_PAPER_TRADING`.
- Scope remains `paper_simulation_planning_only`.
- UI must not imply approval, readiness, safety, profitability, performance, or execution authority.
- Risk and limitation surfaces must remain visible before manual workflow state.

## Recommended Next Packet

Proceed to `TRD-480`, the frontend no-action-control test plan.

## Source Links

- Source packet: `ops/assignments/TRD-479_READ_ONLY_FRONTEND_IMPLEMENTATION_PACKET_DRAFT.md`
- QA/security review: `ops/runtime/reviews/TRD-479_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-479_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-479_ORCHESTRATOR_ACCEPTANCE.md`
- Prior blocker audit: `docs/operations/GATE2_FRONTEND_IMPLEMENTATION_READINESS_BLOCKER_AUDIT.md`
- Frontend skill lens intake: `docs/operations/GATE2_FRONTEND_SKILL_LENS_INTAKE.md`
- Tracklist: `ops/runtime/tracklist.md`
