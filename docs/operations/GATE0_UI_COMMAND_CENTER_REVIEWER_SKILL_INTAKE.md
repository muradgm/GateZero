# Gate 0 UI Command Center Reviewer Skill Intake

Documents governed intake of `gatezero-ui-command-center-reviewer` for static local dashboard,
evidence visibility, source-link grouping, accessibility, mobile readability, operator handoff, and
control-plane copy review.

Boundary: `G0_RESEARCH`, `research_only`.

Accepted outputs:

- `skills/gatezero-ui-command-center-reviewer/SKILL.md`
- `skills/gatezero-ui-command-center-reviewer/agents/openai.yaml`
- `skills/gatezero-ui-command-center-reviewer/evals/evals.json`

The skill is a reviewer lens only and requires `allow_implicit_invocation: false`.

Validation:

```powershell
pnpm check:gate0-skills
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-217_GATE0_UI_COMMAND_CENTER_REVIEWER_SKILL_INTAKE.md`
- QA review: `ops/runtime/reviews/TRD-217_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-217_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-217_ORCHESTRATOR_ACCEPTANCE.md`
- Skill governance guard: `scripts/check-gate0-skill-governance.ts`
- Skill governance tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
