# Gate 0 Command Center Scope And Boundary

## Purpose

This document defines the allowed scope for the initial GateZero command center.

## Decision

Build a small read-only local command center now.

The command center exists to show whether the research operating system is healthy. It does not help
an operator choose, place, route, or automate trades.

## Allowed Surface

- Gate status.
- Operating scope.
- Latest accepted packet.
- Local verification status.
- Remote CI evidence status.
- Agent and review coverage status.
- Protected-loop steps.
- Risk boundary reminders.
- Source links to local docs and runbooks.

## Blocked Surface

- Broker integration.
- Paper or live execution.
- AI buy/sell prediction.
- Strategy performance claims.
- Readiness labels.
- Approval semantics.
- Market-facing dashboards.
- Public marketing claims.

## Source Links

- Source packet: `ops/assignments/TRD-188_GATE0_COMMAND_CENTER_SCOPE_AND_BOUNDARY.md`
- Reviews: `ops/runtime/reviews/TRD-188_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-188_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-188_ORCHESTRATOR_ACCEPTANCE.md`
- Web app: `apps/web/`
- Tracker: `ops/runtime/tracklist.md`
