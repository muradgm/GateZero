# Gate 0 Skill Library Intake

## Purpose

This policy defines how GateZero may add future project-local skills under `skills/` without letting
product breadth outrun trust in the core decision loop.

It is an operating-control policy only. It does not add product scope, strategy state, risk state,
operator decisions, execution capability, external integrations, or gate movement.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

At Gate 0, project-local skills may improve review judgment, planning quality, and blocker
identification. They must not authorize strategy promotion, readiness labels, paper trading, live
trading, broker integration, autonomous execution, AI buy/sell prediction, strategy performance
claims, marketing claims, or risk-gate loosening.

## No bulk skill dump

Do not bulk-copy skills into this repository. Every new skill must have a named purpose, a bounded
review surface, a Gate 0 boundary section, and accepted QA_SECURITY plus RISK review records.

A skill is eligible only when it improves one of these Gate 0 activities:

- Reviewing evidence quality.
- Finding gaps in the protected decision loop.
- Checking source-of-truth alignment.
- Improving operator documentation.
- Improving local validation or test planning.
- Identifying blockers before later-phase work.

## Required Skill Contract

Every accepted project-local skill must include:

- `SKILL.md` with skill frontmatter.
- `## GateZero Boundary First`.
- `G0_RESEARCH`.
- `research_only`.
- `At Gate 0`.
- `future-phase`.
- `blockers`.
- `agents/openai.yaml`.
- `allow_implicit_invocation: false`.
- Review records under `ops/runtime/reviews/`.

Optional `evals/` fixtures may be added when they help verify phase-aware behavior.

## Candidate intake backlog

This section is the candidate intake backlog.

These are candidate reviewer skills only. They are not approved additions until each receives its
own assignment, review, guard update, and passing validation:

| Candidate skill                        | Intended Gate 0 use                                                |
| -------------------------------------- | ------------------------------------------------------------------ |
| `gatezero-orchestrator-reviewer`       | Check assignment packets, sequencing, scope, and acceptance logic. |
| `gatezero-risk-governance-reviewer`    | Review risk gates, autonomy gates, and approval-language blockers. |
| `gatezero-qa-security-reviewer`        | Review validation, blocked scope, secrets, and evidence gaps.      |
| `gatezero-quant-backtest-reviewer`     | Review future backtest contract design without performance claims. |
| `gatezero-product-strategy-reviewer`   | Review product scope against the protected decision loop.          |
| `gatezero-ui-command-center-reviewer`  | Review command-center UI as read-only operating visibility.        |
| `gatezero-docs-control-plane-reviewer` | Review source-of-truth, docs, tracker, and handoff consistency.    |

## Blocked skill types

These are blocked skill types.

Do not add skills that build, instruct, or normalize:

- Broker integration builders.
- Live execution operators.
- Paper-order executors.
- AI signal or prediction skills.
- Strategy approval or readiness certifiers.
- Performance-claim or marketing-claim generators.
- Risk-gate loosening reviewers.
- Credential, API-key, or account-access handlers.
- External execution workflow operators.

## Intake Sequence

1. Name the candidate skill and its intended reviewer lane.
2. Confirm it does not duplicate an existing agent, skill, or source-of-truth document.
3. Write the Gate 0 boundary first, before task instructions.
4. Add explicit invocation metadata with `allow_implicit_invocation: false`.
5. Add eval fixtures when the skill has meaningful pass/fail behavior.
6. Update `scripts/check-gate0-skill-governance.ts` to include the new accepted skill.
7. Add or update tests for accepted and rejected skill states.
8. Record QA_SECURITY, RISK, and ORCHESTRATOR acceptance.
9. Run `pnpm verify:gate0`.

## QA Requirements

QA_SECURITY must verify:

- No executable trading, broker, order, credential, external account, or external service path is
  added.
- The skill requires explicit invocation.
- The skill contains Gate 0 boundary language.
- The skill is covered by the local skill governance guard.
- Any scanner allowlist expansion is justified by review-only content.

## Risk Requirements

RISK must verify:

- Gate remains `G0_RESEARCH`.
- Scope remains `research_only`.
- The skill does not imply approval, readiness, performance, profitability, paper execution, live
  execution, strategy promotion, autonomy increase, or risk-gate movement.
- Any later-phase references are written as blockers or review questions.

## Maintenance Rule

Update this policy when the project changes skill intake rules, accepted project-local skill lanes,
or the governance guard. Do not use this policy to approve future-phase implementation.

## Source Links

- Current skill governance review: `docs/operations/GATE0_SKILL_GOVERNANCE_REVIEW.md`
- Skill governance guard: `scripts/check-gate0-skill-governance.ts`
- Skill governance tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-209_GATE0_SKILL_LIBRARY_INTAKE.md`
- Reviews: `ops/runtime/reviews/TRD-209_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-209_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-209_ORCHESTRATOR_ACCEPTANCE.md`
