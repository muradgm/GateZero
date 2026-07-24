# Gate 1 Skill Routing Matrix

## Purpose

This matrix defines which GateZero project-local skill lens to use for important decisions.

It is an operating-control record only. It does not add product scope, strategy state, risk state,
execution capability, external integrations, or gate movement.

## Boundary

Current financial gate:

```text
G1_BACKTESTING
```

Current operating scope:

```text
historical_backtesting_only
```

Use these skills to improve review judgment, not to authorize broker integration, live trading,
paper execution, autonomous execution, AI buy/sell prediction, strategy approval, readiness claims,
profitability claims, marketing claims, external publishing, credential handling, or risk-gate
loosening.

## Routing Matrix

| Decision type                             | Primary skill                                 | Supporting skill                       |
| ----------------------------------------- | --------------------------------------------- | -------------------------------------- |
| Assignment sequencing and handoff         | `gatezero-orchestrator-reviewer`              | `gatezero-docs-control-plane-reviewer` |
| Risk gate and autonomy boundary review    | `gatezero-risk-governance-reviewer`           | `gatezero-orchestrator-reviewer`       |
| Validation and blocked-scope review       | `gatezero-qa-security-reviewer`               | `gatezero-risk-governance-reviewer`    |
| Documentation and tracker consistency     | `gatezero-docs-control-plane-reviewer`        | `gatezero-orchestrator-reviewer`       |
| Product scope and wedge review            | `gatezero-product-strategy-reviewer`          | `trader-product-reviewer`              |
| Static command-center UI review           | `gatezero-ui-command-center-reviewer`         | `trader-product-reviewer`              |
| Backtest contract and metric review       | `gatezero-quant-backtest-reviewer`            | `trading-forex-domain-expert`          |
| Trader workflow and trust review          | `trader-product-reviewer`                     | `gatezero-risk-governance-reviewer`    |
| Forex mechanics and domain review         | `trading-forex-domain-expert`                 | `gatezero-quant-backtest-reviewer`     |
| Frontend marketing and positioning review | `traderframe-marketing-strategy-reviewer`     | `gatezero-product-strategy-reviewer`   |
| Frontend copy and claim-safety review     | `traderframe-copy-reviewer`                   | `gatezero-risk-governance-reviewer`    |
| Frontend engineering architecture review  | `traderframe-frontend-engineer`               | `gatezero-qa-security-reviewer`        |
| Frontend visual product design review     | `traderframe-visual-product-designer`         | `gatezero-ui-command-center-reviewer`  |
| Market intelligence and scenario analysis | `senior-market-intelligence-scenario-analyst` | `gatezero-risk-governance-reviewer`    |

## Selection Rules

- Use `gatezero-orchestrator-reviewer` when deciding what packet should run next.
- Use `gatezero-risk-governance-reviewer` when language could imply approval, readiness, or gate
  movement.
- Use `gatezero-qa-security-reviewer` when code, commands, scanners, validation, secrets, or
  blocked-scope checks change.
- Use `gatezero-docs-control-plane-reviewer` when docs, source links, trackers, snapshots, or
  handoffs change.
- Use `gatezero-product-strategy-reviewer` when product scope or roadmap sequencing is debated.
- Use `gatezero-ui-command-center-reviewer` when the command-center surface or display copy changes.
- Use `gatezero-quant-backtest-reviewer` when backtest contracts, assumptions, fixtures, or metrics
  are central.
- Use `trader-product-reviewer` when operator trust, workflow clarity, or trader UX is central.
- Use `trading-forex-domain-expert` when forex mechanics, market-data assumptions, or execution-risk
  mechanics are central.
- Use `traderframe-marketing-strategy-reviewer` when frontend positioning or market-facing language
  needs to stay claim-safe.
- Use `traderframe-copy-reviewer` when interface copy could imply action, approval, readiness, or
  performance claims.
- Use `traderframe-frontend-engineer` when read-only frontend architecture, local data flow, or
  component boundaries are central.
- Use `traderframe-visual-product-designer` when visual hierarchy, dashboard density, or operator
  scanning behavior is central.
- Use `senior-market-intelligence-scenario-analyst` for source-linked, conditional market scenarios.
  Keep it read-only, risk-reviewed, and operator-decided at Gate 2.

## Maintenance Rule

Update this matrix whenever a governed project-local skill is added, renamed, retired, or assigned a
new decision lane. Do not use this matrix to bypass QA_SECURITY, RISK, or ORCHESTRATOR review.

## Source Links

- Skill library intake policy: `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`
- Skill governance review: `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Skill routing guard: `scripts/check-gate0-skill-routing.ts`
- Skill routing tests: `packages/fixtures/tests/gate0-skill-routing.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-219_GATE0_SKILL_ROUTING_MATRIX.md`
- Frontend skill intake: `docs/operations/GATE2_FRONTEND_SKILL_LENS_INTAKE.md`
- TraderFrame marketing strategy skill: `skills/traderframe-marketing-strategy-reviewer/SKILL.md`
- TraderFrame copy skill: `skills/traderframe-copy-reviewer/SKILL.md`
- TraderFrame frontend engineering skill: `skills/traderframe-frontend-engineer/SKILL.md`
- TraderFrame visual product design skill: `skills/traderframe-visual-product-designer/SKILL.md`
- Reviews: `ops/runtime/reviews/TRD-219_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-219_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-219_ORCHESTRATOR_ACCEPTANCE.md`
