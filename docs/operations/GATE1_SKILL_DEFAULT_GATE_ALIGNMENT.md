# Gate 1 Skill Default Gate Alignment

## Purpose

Record the alignment of project-local skill defaults with the current TraderFrame operating state.

## Result

Project-local reviewer skills now default to:

```text
G1_BACKTESTING
historical_backtesting_only
```

The skill governance and routing guards now require these current-state snippets for accepted
project-local skills and the routing matrix.

## Boundary

This is reviewer-instruction alignment only. It does not rename legacy `gate0` command names, add
broker integration, authorize paper or live execution, expand autonomy, approve strategies, or make
performance claims.

## Source Links

- Source packet: `ops/assignments/TRD-322_SKILL_DEFAULT_GATE_ALIGNMENT.md`
- Reviews: `ops/runtime/reviews/TRD-322_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-322_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-322_ORCHESTRATOR_ACCEPTANCE.md`
