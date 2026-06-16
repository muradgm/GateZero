# Gate 0 Orchestrator Reviewer Skill Intake

## Purpose

This record documents the governed intake of `gatezero-orchestrator-reviewer` as a project-local
reviewer skill.

The skill improves assignment sequencing, scope review, acceptance criteria, tracker alignment, and
next-agent handoff quality. It is a reviewer lens only.

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

| Field              | Value                                                      |
| ------------------ | ---------------------------------------------------------- |
| Skill              | `gatezero-orchestrator-reviewer`                           |
| Skill file         | `skills/gatezero-orchestrator-reviewer/SKILL.md`           |
| Metadata           | `skills/gatezero-orchestrator-reviewer/agents/openai.yaml` |
| Evals              | `skills/gatezero-orchestrator-reviewer/evals/evals.json`   |
| Invocation policy  | `allow_implicit_invocation: false`                         |
| Governance command | `pnpm check:gate0-skills`                                  |

## Review Fit

Use this skill when reviewing:

- Assignment packet structure.
- Task sequencing.
- Allowed and blocked scope.
- Acceptance criteria.
- QA_SECURITY and RISK participation.
- ORCHESTRATOR acceptance readiness.
- Tracker, progress snapshot, source-link, and handoff alignment.
- Next-agent or next-packet recommendations.

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
- Source packet: `ops/assignments/TRD-212_GATE0_ORCHESTRATOR_REVIEWER_SKILL_INTAKE.md`
- Reviews: `ops/runtime/reviews/TRD-212_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-212_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-212_ORCHESTRATOR_ACCEPTANCE.md`
