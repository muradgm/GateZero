# Gate 2 Frontend Local Data Adapter Plan

## Summary

TRD-481 plans a read-only frontend data adapter for TraderFrame.

The adapter must use local static/runtime data only. It must not fetch broker data, connect
accounts, store credentials, call external services, or imply live execution capability.

## Allowed Data Sources

- `apps/web/src/command-center-data.js`
- `runtime/command-center-data.json` served by the local preview helper
- Local docs, packets, review records, and guard outputs already represented in command-center data

## Adapter Rules

- Data is read-only.
- Missing data renders a limitation or blocker, not an action prompt.
- Risk and limitations stay adjacent to evidence.
- Runtime refresh remains same-origin and local.
- No credential, account, broker, live route, prediction, approval, readiness, or performance
  fields.

## Next Packet

Proceed to `TRD-482`, the frontend panel component inventory.

## Source Links

- Source packet: `ops/assignments/TRD-481_FRONTEND_LOCAL_DATA_ADAPTER_PLAN.md`
- QA/security review: `ops/runtime/reviews/TRD-481_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-481_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-481_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
