# Gate 2 Read-Only Frontend App-Shell Scope Assessment

## Summary

TRD-466 scopes a future TraderFrame app shell as read-only evidence navigation. It is not a build
authorization.

## Allowed App-Shell Scope

- Evidence overview.
- Protected loop status.
- Paper-simulation limitation visibility.
- Risk review status.
- Operator workflow state.
- Source-link and review coverage navigation.
- Local verification status.

## Blocked App-Shell Scope

- Order tickets.
- Buy/sell controls.
- Broker or account connection controls.
- Credential entry.
- Live route controls.
- Autonomous action controls.
- AI directional prompts.
- Approval, readiness, safety, profitability, or deployment labels.

## Product Direction

The first real frontend should feel like a research control room, not a trading terminal. It should
help the operator see evidence quality, blockers, limitations, and workflow state quickly.

## Next Task

Proceed to `TRD-467`, the frontend evidence panel requirements draft.

## Source Links

- Source packet: `ops/assignments/TRD-466_READ_ONLY_FRONTEND_APP_SHELL_SCOPE_ASSESSMENT.md`
- QA/security review: `ops/runtime/reviews/TRD-466_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-466_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-466_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
