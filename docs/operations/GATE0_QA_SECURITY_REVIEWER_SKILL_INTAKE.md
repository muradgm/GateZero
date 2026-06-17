# Gate 0 QA Security Reviewer Skill Intake

## Purpose

This record documents the governed intake of `gatezero-qa-security-reviewer` as a project-local
reviewer skill.

The skill improves review quality for validation integrity, scanner coverage, secrets and credential
exposure, blocked-scope checks, artifact freshness, and QA evidence. It is a reviewer lens only.

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

| Field              | Value                                                     |
| ------------------ | --------------------------------------------------------- |
| Skill              | `gatezero-qa-security-reviewer`                           |
| Skill file         | `skills/gatezero-qa-security-reviewer/SKILL.md`           |
| Metadata           | `skills/gatezero-qa-security-reviewer/agents/openai.yaml` |
| Evals              | `skills/gatezero-qa-security-reviewer/evals/evals.json`   |
| Invocation policy  | `allow_implicit_invocation: false`                        |
| Governance command | `pnpm check:gate0-skills`                                 |

## Review Fit

Use this skill when reviewing:

- Validation command evidence.
- Scanner and blocked-pattern coverage.
- Secrets, tokens, API keys, credentials, or account-access exposure.
- Blocked-scope checks.
- Command-center, tracker, snapshot, and evidence freshness.
- Guard and test coverage.
- QA_SECURITY review completeness.

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
- Source packet: `ops/assignments/TRD-214_GATE0_QA_SECURITY_REVIEWER_SKILL_INTAKE.md`
- Reviews: `ops/runtime/reviews/TRD-214_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-214_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-214_ORCHESTRATOR_ACCEPTANCE.md`
