# Gate 0 Skill Usage Handoff Note

## Purpose

This handoff tells future operators how to choose a GateZero project-local skill lens for important
Gate 0 maintenance decisions.

It is a reviewer-routing note only. It does not add product scope, strategy state, risk state,
execution capability, external integrations, or gate movement.

## Selection Handoff

- Use `gatezero-orchestrator-reviewer` when deciding what packet should run next.
- Use `gatezero-risk-governance-reviewer` when wording could imply approval, readiness, or gate
  movement.
- Use `gatezero-qa-security-reviewer` when validation, scanners, secrets, or blocked-scope checks
  change.
- Use `gatezero-docs-control-plane-reviewer` when source links, trackers, docs indexes, snapshots,
  or handoffs change.
- Use `gatezero-product-strategy-reviewer` when scope, roadmap sequence, or trust-before-breadth
  tradeoffs are debated.
- Use `gatezero-ui-command-center-reviewer` when static command-center display or operator copy
  changes.
- Use `gatezero-quant-backtest-reviewer` when future backtest contracts, assumptions, fixtures, or
  metrics are central.
- Use `trader-product-reviewer` when trader workflow clarity or operator trust is central.
- Use `trading-forex-domain-expert` when forex mechanics or market-data assumptions are central.

## Operator Rule

Use the smallest skill set that covers the decision. If the needed lens is missing, create a new
skill only after a concrete maintenance gap is named and reviewed.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Do not use this handoff to authorize broker access, execution, AI prediction, strategy approval,
readiness claims, profitability claims, public release claims, or risk-gate movement.

## Source Links

- Source packet: `ops/assignments/TRD-224_GATE0_SKILL_USAGE_HANDOFF_NOTE.md`
- Reviews: `ops/runtime/reviews/TRD-224_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-224_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-224_ORCHESTRATOR_ACCEPTANCE.md`
- Skill routing matrix: `docs/operations/GATE0_SKILL_ROUTING_MATRIX.md`
- Skill library closeout: `docs/operations/GATE0_SKILL_LIBRARY_CLOSEOUT_REVIEW.md`
- Skill governance review: `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Tracker: `ops/runtime/tracklist.md`
