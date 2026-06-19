# Gate 1 Operator Decision Event Contract

## Purpose

Record a schema-only operator decision event for Gate 1 backtest evidence routing.

## Allowed Decisions

- `reject`
- `revise`
- `keep_as_research_evidence`

## Boundary

The event preserves operator authority and requires risk review. It does not authorize paper orders,
live orders, autonomous action, strategy approval, or readiness labels.

## Source Links

- Source packet: `ops/assignments/TRD-298_OPERATOR_DECISION_EVENT_CONTRACT.md`
- Reviews: `ops/runtime/reviews/TRD-298_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-298_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-298_ORCHESTRATOR_ACCEPTANCE.md`
