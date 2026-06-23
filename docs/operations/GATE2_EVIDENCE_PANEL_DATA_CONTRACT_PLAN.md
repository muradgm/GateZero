# Gate 2 Evidence Panel Data Contract Plan

## Summary

TRD-470 defines local read-only data inputs for future evidence panels.

## Allowed Inputs

- Accepted packet id.
- Local validation summary.
- Review coverage count.
- Evidence bundle identifiers.
- Limitation references.
- Risk review references.
- Operator workflow state.
- Source links to local docs, tests, and contracts.

## Blocked Inputs

- Secrets, tokens, API keys, broker account data, external feeds, live market data, execution
  payloads, AI prediction outputs, and performance-claim fields.

## Result

Evidence panel data must be local, deterministic, redacted where needed, and read-only.

## Next Task

Proceed to `TRD-471`, the limitation panel copy contract.

## Source Links

- Source packet: `ops/assignments/TRD-470_EVIDENCE_PANEL_DATA_CONTRACT_PLAN.md`
- QA/security review: `ops/runtime/reviews/TRD-470_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-470_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-470_ORCHESTRATOR_ACCEPTANCE.md`
- Tracklist: `ops/runtime/tracklist.md`
