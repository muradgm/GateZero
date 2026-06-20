# Gate 1 Command Alias Compatibility Plan

Legacy `gate0` command names remain stable command identifiers while TraderFrame operates at
`G1_BACKTESTING`.

## Alias Plan

- Add future aliases only after a compatibility packet maps old and new commands.
- Keep `gate0` commands working until CI, docs, and operator workflows are updated.
- Treat aliases as operator ergonomics, not gate movement.

## Boundary

No command in this plan may add broker, paper, live, order, autonomous, prediction, approval, or
readiness behavior.

## Source Links

- Source packet: `ops/assignments/TRD-333_GATE_COMMAND_ALIAS_COMPATIBILITY_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-333_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-333_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-333_ORCHESTRATOR_ACCEPTANCE.md`
