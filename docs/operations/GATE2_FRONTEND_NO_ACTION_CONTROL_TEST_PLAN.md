# Gate 2 Frontend No-Action-Control Test Plan

## Summary

TRD-480 defines the required no-action-control test plan for future TraderFrame read-only frontend
implementation.

This is a test-planning record only. It does not implement frontend code or expand product scope.

## Operating Boundary

| Field                  | Value                            |
| ---------------------- | -------------------------------- |
| Financial gate         | `G2_PAPER_TRADING`               |
| Operating scope        | `paper_simulation_planning_only` |
| Test posture           | Negative UI-affordance planning  |
| Implementation posture | Not authorized by this packet    |

## Test Surfaces

Future frontend implementation must include local tests or scanner coverage for these surfaces:

- `apps/web/src/command-center-data.js` labels, titles, rows, values, and copy constants.
- `apps/web/src/main.js` rendered section headings, links, tables, buttons, and interactive labels.
- `apps/web/index.html` static shell labels and landmarks.
- Any future component, route, menu, command palette, form, modal, drawer, or empty state.

## Blocked Copy And Affordance Classes

Tests must reject UI text or data keys that imply:

- Broker or account connection.
- API-key, token, credential, or secret entry.
- Placing, submitting, routing, dispatching, or executing orders.
- Buy/sell generation or directional signal production.
- Autonomous or scheduled trading actions.
- Strategy approval, readiness, safety, deployment, certification, or promotion.
- Profitability, performance, optimization, guarantee, or outcome claims.

## Example Blocked Terms

The exact fixture set may expand, but it must include at least these examples:

- `place order`
- `submit order`
- `connect broker`
- `enter api key`
- `auto execute`
- `generate buy`
- `generate sell`
- `approved strategy`
- `ready to trade`
- `profit claim`

## Allowed Replacement Classes

Allowed copy should stay in these families:

- Evidence status.
- Local verification.
- Risk review.
- Limitation.
- Blocker.
- Source link.
- Manual operator workflow.
- Paper-simulation assumption.
- Review coverage.

## Required Negative Fixture Shape

Future tests should include a fixture table with:

| Field                    | Purpose                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `surface`                | Button, route, panel title, empty state, menu item, data key, or rendered text. |
| `blocked_text`           | The forbidden copy or affordance phrase.                                        |
| `blocked_reason`         | The risk created by the phrase.                                                 |
| `safe_replacement_class` | The allowed copy family that should replace it.                                 |

## Required Checks Before Build Acceptance

- Static app-data scan rejects blocked action-like copy.
- Render contract scan rejects blocked action-like copy after markup assembly.
- Scanner allowlist is not expanded for frontend action text.
- Tests prove local evidence, risk, and limitation copy can render without action controls.
- `pnpm verify:gate0` remains green.

## QA Requirements

- Confirm no product code is implemented in this packet.
- Confirm future tests cover app data and rendered UI.
- Confirm no broker, credential, external account, order, live route, autonomous action, or AI
  prediction path is introduced.
- Confirm blocked terms are treated as failures outside explicitly historical docs and review
  records.

## Risk Requirements

- Gate remains `G2_PAPER_TRADING`.
- Scope remains `paper_simulation_planning_only`.
- Tests must prevent UI copy from implying action authority, approval, readiness, safety,
  profitability, or execution ability.

## Recommended Next Packet

Proceed to `TRD-481`, the frontend local data adapter plan.

## Source Links

- Source packet: `ops/assignments/TRD-480_FRONTEND_NO_ACTION_CONTROL_TEST_PLAN.md`
- QA/security review: `ops/runtime/reviews/TRD-480_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-480_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-480_ORCHESTRATOR_ACCEPTANCE.md`
- Prior guard plan: `docs/operations/GATE2_FRONTEND_NO_ACTION_CONTROL_GUARD_PLAN.md`
- Implementation packet draft:
  `docs/operations/GATE2_READ_ONLY_FRONTEND_IMPLEMENTATION_PACKET_DRAFT.md`
- Tracklist: `ops/runtime/tracklist.md`
