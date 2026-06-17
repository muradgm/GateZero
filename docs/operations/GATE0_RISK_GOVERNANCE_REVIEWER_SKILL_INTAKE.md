# Gate 0 Risk Governance Reviewer Skill Intake

## Purpose

This record documents the governed intake of `gatezero-risk-governance-reviewer` as a project-local
reviewer skill.

The skill improves review quality for financial risk gates, autonomy gates, approval-language
boundaries, readiness semantics, and later-phase blocker framing. It is a reviewer lens only.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

The skill does not add product scope, strategy state, risk state, operator decisions, execution
capability, external integrations, or gate movement.

## Accepted Skill

| Field              | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| Skill              | `gatezero-risk-governance-reviewer`                           |
| Skill file         | `skills/gatezero-risk-governance-reviewer/SKILL.md`           |
| Metadata           | `skills/gatezero-risk-governance-reviewer/agents/openai.yaml` |
| Evals              | `skills/gatezero-risk-governance-reviewer/evals/evals.json`   |
| Invocation policy  | `allow_implicit_invocation: false`                            |
| Governance command | `pnpm check:gate0-skills`                                     |

## Review Fit

Use this skill when reviewing:

- Financial risk gate preservation.
- Autonomy gate preservation.
- Approval or readiness language.
- Performance, profitability, or eligibility claims.
- Future-phase blocker framing.
- Command-center risk wording.
- Assignment and acceptance risk requirements.

## Blocked Use

Do not use this skill to authorize broker integration, live trading, paper execution, autonomous
execution, AI buy/sell prediction, strategy approval, readiness claims, profitability claims,
marketing claims, external publishing, credential handling, or risk-gate loosening.

## Validation

Required validation:

```powershell
pnpm check:gate0-skills
pnpm verify:gate0
```

## Source Links

- Skill library intake policy: `docs/operations/GATE0_SKILL_LIBRARY_INTAKE.md`
- Skill governance review: `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Guard script: `scripts/check-gate0-skill-governance.ts`
- Guard tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-213_GATE0_RISK_GOVERNANCE_REVIEWER_SKILL_INTAKE.md`
- Reviews: `ops/runtime/reviews/TRD-213_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-213_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-213_ORCHESTRATOR_ACCEPTANCE.md`
