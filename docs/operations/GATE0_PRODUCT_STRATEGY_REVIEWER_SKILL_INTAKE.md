# Gate 0 Product Strategy Reviewer Skill Intake

Documents governed intake of `gatezero-product-strategy-reviewer` for product wedge discipline,
scope control, roadmap sequencing, operator value, and trust-before-breadth review.

Boundary: `G0_RESEARCH`, `research_only`.

Accepted outputs:

- `skills/gatezero-product-strategy-reviewer/SKILL.md`
- `skills/gatezero-product-strategy-reviewer/agents/openai.yaml`
- `skills/gatezero-product-strategy-reviewer/evals/evals.json`

The skill is a reviewer lens only and requires `allow_implicit_invocation: false`.

Validation:

```powershell
pnpm check:gate0-skills
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-216_GATE0_PRODUCT_STRATEGY_REVIEWER_SKILL_INTAKE.md`
- QA review: `ops/runtime/reviews/TRD-216_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-216_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-216_ORCHESTRATOR_ACCEPTANCE.md`
- Skill governance guard: `scripts/check-gate0-skill-governance.ts`
- Skill governance tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
