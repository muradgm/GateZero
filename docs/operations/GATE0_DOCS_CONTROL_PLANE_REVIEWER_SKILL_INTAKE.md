# Gate 0 Docs Control Plane Reviewer Skill Intake

Documents governed intake of `gatezero-docs-control-plane-reviewer` for source-of-truth alignment,
tracker consistency, source links, handoff notes, docs indexes, progress snapshots, and operating
record freshness.

Boundary: `G0_RESEARCH`, `research_only`.

Accepted outputs:

- `skills/gatezero-docs-control-plane-reviewer/SKILL.md`
- `skills/gatezero-docs-control-plane-reviewer/agents/openai.yaml`
- `skills/gatezero-docs-control-plane-reviewer/evals/evals.json`

The skill is a reviewer lens only and requires `allow_implicit_invocation: false`.

Validation:

```powershell
pnpm check:gate0-skills
pnpm verify:gate0
```

## Source Links

- Source packet: `ops/assignments/TRD-215_GATE0_DOCS_CONTROL_PLANE_REVIEWER_SKILL_INTAKE.md`
- QA review: `ops/runtime/reviews/TRD-215_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-215_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-215_ORCHESTRATOR_ACCEPTANCE.md`
- Skill governance guard: `scripts/check-gate0-skill-governance.ts`
- Skill governance tests: `packages/fixtures/tests/gate0-skill-governance.test.ts`
