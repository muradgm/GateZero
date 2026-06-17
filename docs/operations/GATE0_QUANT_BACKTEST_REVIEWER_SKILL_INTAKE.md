# Gate 0 Quant Backtest Reviewer Skill Intake

Documents governed intake of `gatezero-quant-backtest-reviewer` for future historical backtest
contracts, data snapshots, assumptions, reproducibility, metric integrity, fixture boundaries, and
anti-claim controls.

Boundary: `G0_RESEARCH`, `research_only`.

Accepted outputs:

- `skills/gatezero-quant-backtest-reviewer/SKILL.md`
- `skills/gatezero-quant-backtest-reviewer/agents/openai.yaml`
- `skills/gatezero-quant-backtest-reviewer/evals/evals.json`

The skill is a reviewer lens only and requires `allow_implicit_invocation: false`.

Validation:

```powershell
pnpm check:gate0-skills
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-218_GATE0_QUANT_BACKTEST_REVIEWER_SKILL_INTAKE.md`
- QA review: `ops/runtime/reviews/TRD-218_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-218_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-218_ORCHESTRATOR_ACCEPTANCE.md`
- Skill governance guard: `scripts/check-gate0-skill-governance.ts`
- Skill governance tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
